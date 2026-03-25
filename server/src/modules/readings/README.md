# Readings/Ingestion module

This module receives sensor readings from NodeMCU devices and stores them in MongoDB.

Endpoints (current):
- `POST /api/v1/ingest/readings`
- `POST /api/v1/ingest/devices/register` (admin pairing; user auth not added yet)
