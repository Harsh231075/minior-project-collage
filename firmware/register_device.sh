#!/bin/bash

# Simple script to register a device and get the token for NodeMCU
# Usage: ./register_device.sh <deviceId> <deviceName>

if [ -z "$1" ]; then
  echo "Usage: ./register_device.sh <deviceId> <deviceName>"
  echo "Example: ./register_device.sh ESP8266_NODE_01 'Field Sensor 1'"
  exit 1
fi

DEVICE_ID=$1
DEVICE_NAME=$2
BACKEND_URL="http://localhost:4000/api/v1/ingest/devices/register"

echo "Registering device: $DEVICE_ID ($DEVICE_NAME)..."

curl -X POST "$BACKEND_URL" \
     -H "Content-Type: application/json" \
     -d "{\"deviceId\": \"$DEVICE_ID\", \"name\": \"$DEVICE_NAME\"}"

echo -e "\n\nCopy the 'deviceToken' from the response above and paste it into your Arduino code."
