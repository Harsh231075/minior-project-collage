# AgroSense AI — Server (TypeScript, module-based)

This folder contains the **Node.js backend** for AgroSense AI.

## What’s implemented (now)
- TypeScript + Express app bootstrap
- MongoDB connection (Mongoose)
- Modular structure under `src/modules/*`
- Core models (no user model yet):
  - Device
  - SensorReading
  - Alert
  - Recommendation
- Ingestion endpoints:
  - `POST /api/v1/ingest/readings`
  - `POST /api/v1/ingest/devices/register` (device pairing; auth/users skipped for now)

## Setup
1) Copy env file:

```bash
cp .env.example .env
```

2) Put your MongoDB URL in `.env` (`MONGODB_URI=...`).

3) Install + run:

```bash
npm install
npm run dev
```

Health check:
- `GET http://localhost:4000/health`

## Seed dummy data (when IoT is not connected yet)
This will create 2 demo devices (`farm_1`, `farm_2`) and insert last 24h readings + sample alerts + recommendations.

```bash
npm run seed -- --reset
```

The command prints device tokens you can use for ingestion:
- Header name: `x-device-token`
- Send readings to: `POST /api/v1/ingest/readings`
