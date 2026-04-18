#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

/**
 * AgroSense AI - NodeMCU Firmware (MVP)
 * Project: Mini Project Collage
 * 
 * Hardware:
 * - NodeMCU (ESP8266)
 * - DHT22 (Temperature & Humidity) - Pin D4 (GPIO2)
 * - Soil Moisture Sensor - Pin A0
 * 
 * Dependencies (Install via Arduino Library Manager):
 * - DHT sensor library (by Adafruit)
 * - ArduinoJson (by Benoit Blanchon)
 */

// --- CONFIGURATION ---
const char* WIFI_SSID = "MR_HARSH";     // Set from user's last message
const char* WIFI_PASS = "23107510"; // Set from user's last message

// Backend Config
const char* BACKEND_URL = "http://192.168.1.10:4000/api/v1/ingest/readings"; 
const char* DEVICE_ID = "ESP8266_NODE_01";
const char* DEVICE_TOKEN = "7c37bb81321f8d8ae87c141730d1bc5394787e835e05c73f"; 

// Pins
#define DHTPIN 2          // D4 on NodeMCU
#define DHTTYPE DHT22
#define SOIL_PIN A0

DHT dht(DHTPIN, DHTTYPE);

unsigned long lastMillis = 0;
const long INTERVAL = 60000; // Send data every 1 minute

void setup() {
  Serial.begin(115200);
  dht.begin();

  Serial.println("\n--- AgroSense AI NodeMCU Initializing ---");
  
  // WiFi setup
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Check interval
  if (millis() - lastMillis > INTERVAL) {
    lastMillis = millis();

    if (WiFi.status() == WL_CONNECTED) {
      sendSensorData();
    } else {
      Serial.println("WiFi Disconnected. Reconnecting...");
      WiFi.begin(WIFI_SSID, WIFI_PASS);
    }
  }
}

void sendSensorData() {
  // 1. Read Sensors
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  int soilRaw = analogRead(SOIL_PIN);
  int soilMoisture = soilRaw; 

  // Check if DHT readings are valid, if not use default values
  if (isnan(h) || isnan(t)) {
    Serial.println("Warning: Failed to read from DHT sensor! Sending default values.");
    Serial.println("console message: defult value gyi h");
    t = 27.0; // Default Temperature
    h = 55.0; // Default Humidity
  }

  // Check if Soil Moisture reading is valid (Analog read always returns 0-1024, but adding check for safety)
  if (soilRaw < 0) {
    Serial.println("Warning: Invalid Soil Moisture reading! Sending default value.");
    Serial.println("console message: defult value gyi h");
    soilMoisture = 500; // Default Soil Moisture
  }

  // 2. Prepare JSON Payload
  // Based on ingest.schema.ts: deviceId, temperature, humidity, soilMoisture, phValue, rain
  StaticJsonDocument<256> doc;
  doc["deviceId"] = DEVICE_ID;
  doc["temperature"] = t;
  doc["humidity"] = h;
  doc["soilMoisture"] = soilMoisture;
  doc["phValue"] = 7.0; // Default since sensor not present
  doc["rain"] = 0;      // Default since sensor not present

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  // 3. Send HTTP POST
  WiFiClient client;
  HTTPClient http;

  Serial.print("Sending data to: ");
  Serial.println(BACKEND_URL);

  http.begin(client, BACKEND_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-device-token", DEVICE_TOKEN);

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    Serial.println("Response: " + response);
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}
