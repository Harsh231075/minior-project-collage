#include <ArduinoJson.h>
#include <DHT.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>

/**
 * AgroSense AI - NodeMCU Firmware (MVP)
 * Project: Mini Project Collage
 */

// --- CONFIGURATION ---
const char *WIFI_SSID = "MR_HARSH";
const char *WIFI_PASS = "23107510";

// Backend Config
const char *BACKEND_URL = "http://10.212.96.197:4000/api/v1/ingest/readings";
String deviceIdStr = ""; // Will hold the unique Chip ID
const char *DEVICE_TOKEN = "7c37bb81321f8d8ae87c141730d1bc5394787e835e05c73f";

// Pins
#define DHTPIN 2 // D4 on NodeMCU
#define DHTTYPE DHT22
#define SOIL_PIN A0

DHT dht(DHTPIN, DHTTYPE);

unsigned long lastMillis = 0;
const long INTERVAL = 60000; // Send data every 1 minute

void setup() {
  Serial.begin(115200);
  dht.begin();

  // Fetch unique Chip ID and format it
  deviceIdStr = "AS-" + String(ESP.getChipId());

  Serial.println("\n--- AgroSense AI Starting ---");
  Serial.print("STicker par ye likho -> DEVICE ID: ");
  Serial.println(deviceIdStr); 

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

  Serial.println("\n--- New Reading ---");
  Serial.print("Soil Moisture (Raw): ");
  Serial.println(soilRaw);

  if (soilRaw > 1020) {
    Serial.println("Soil Status: DRY / SENSOR DISCONNECTED");
  } else {
    Serial.println("Soil Status: REAL DATA READ");
  }

  // DHT check
  if (isnan(h) || isnan(t)) {
    Serial.println("DHT Read Failed! Sending default values.");
    Serial.println("console message: defult value gyi h");
    t = 27.0;
    h = 55.0;
  } else {
    Serial.print("DHT Data: Temp: ");
    Serial.print(t);
    Serial.print(" C, Hum: ");
    Serial.print(h);
    Serial.println(" %");
  }

  // 2. Prepare JSON Payload
  StaticJsonDocument<256> doc;
  doc["deviceId"] = deviceIdStr;
  doc["temperature"] = t;
  doc["humidity"] = h;
  doc["soilMoisture"] = soilRaw;
  doc["phValue"] = 7.0;
  doc["rain"] = 0;

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  // 3. Send HTTP POST
  WiFiClient client;
  HTTPClient http;

  Serial.print("Sending to Backend: ");
  Serial.println(BACKEND_URL);

  http.begin(client, BACKEND_URL);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-device-token", DEVICE_TOKEN);

  int httpResponseCode = http.POST(jsonPayload);

  Serial.print("HTTP Response: ");
  Serial.println(httpResponseCode);

  http.end();
}
