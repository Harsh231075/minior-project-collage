# AgroSense AI — API Plan (NodeMCU ↔ Backend, Client ↔ Backend)

Date: 25 Mar 2026

Goal: make it crystal-clear **kitni APIs banengi**, kis side pe, aur kaunsi MVP me zaroori hain.

---

## 0) Two API groups (important)
### A) Device/Ingestion APIs (NodeMCU → Backend)
These APIs are optimized for **frequent sensor pushes** and **device status**.

### B) Product APIs (Client UI → Backend)
These APIs power the dashboard pages: **recommendations, alerts, devices, sensors, analytics, AI assistant**.

We will keep both under versioning: `POST /api/v1/...`

---

## 1) NodeMCU → Backend APIs (Device/Ingestion)
### MVP (recommended) — 2 APIs
1) **POST** `/api/v1/ingest/readings`
- Purpose: NodeMCU sends sensor JSON payload.
- Auth: `X-Device-Token: <token>`
- Result: store reading, update `lastSeen`, trigger alert/reco evaluation.

2) **POST** `/api/v1/ingest/heartbeat` (optional but useful)
- Purpose: device says “I am alive” even if sensor read fails.
- Auth: device token.
- Result: update `lastSeen`, status = online.

If you want to keep it super simple, heartbeat can be skipped and only **readings** used for online/offline detection.

### Next-level (Phase 2) — +2 APIs
3) **POST** `/api/v1/ingest/status`
- Purpose: send firmwareVersion, wifiRSSI, battery (if available), restart reason.

4) **POST** `/api/v1/ingest/logs`
- Purpose: device error logs to help debugging in real deployments.

### Device side total
- MVP: **1–2 APIs**
- Full: **3–4 APIs**

---

## 2) Client → Backend APIs (UI/Product)
We’ll design these around pages:
- Dashboard (recommendation + top alerts + snapshot)
- Alerts inbox
- Devices status
- Sensors history
- Analytics summaries
- AI Assistant chat (LLM grounded)

### MVP set (practical) — 10 APIs
#### Auth / User (2)
1) **POST** `/api/v1/auth/login`
2) **POST** `/api/v1/auth/logout` (or token revoke)

> If you don’t want full auth in mini-project, you can temporarily skip auth and run with a single admin mode. But “next-level” project needs auth.

#### Dashboard (2)
3) **GET** `/api/v1/dashboard/summary`
- Returns: latest snapshot + main recommendation + top 2–3 alerts.

4) **GET** `/api/v1/recommendations/active`
- Returns: current recommendation cards (for dashboard).

#### Alerts (2)
5) **GET** `/api/v1/alerts?status=active|archived&limit=...`
6) **POST** `/api/v1/alerts/:id/ack`
- (optional) `/resolve` or `/archive` in phase 2.

#### Devices (2)
7) **GET** `/api/v1/devices`
- Returns: list with status online/offline + lastSeen.

8) **POST** `/api/v1/devices/pair`
- Purpose: add/register new device (deviceId + token generate).

#### Sensors (1)
9) **GET** `/api/v1/readings?deviceId=...&from=...&to=...&limit=...`
- Returns: paginated readings table.

#### Analytics (1)
10) **GET** `/api/v1/analytics/overview?deviceId=...&range=24h|7d`
- Returns: aggregates (avg/min/max, trend) + anomaly markers.

### Realtime (recommended for “wow” factor) — +1 API
11) **GET** `/api/v1/stream/events` (SSE)
- Server-Sent Events stream for:
  - `reading.latest`
  - `alert.created`
  - `recommendation.created`
  - `device.status.changed`

### AI Assistant (LLM) — +2 APIs
12) **POST** `/api/v1/ai/chat`
- Input: user message + (farmId/deviceId optional)
- Backend builds context (latest + history + alerts) then calls external LLM.

13) **GET** `/api/v1/ai/suggestions?context=dashboard|alerts|devices`
- Returns: smart suggestion buttons dynamically.

### Client side total
- MVP (without realtime + AI): **10 APIs**
- With realtime SSE: **11 APIs**
- With AI assistant endpoints: **12–13 APIs**

---

## 3) Total API count summary (simple)
### Minimum MVP (very practical)
- NodeMCU → Backend: **1 API** (`/ingest/readings`)
- Client → Backend: **10 APIs**
Total: **11 APIs**

### Recommended “next-level” demo
- NodeMCU → Backend: **2 APIs** (readings + heartbeat)
- Client → Backend: **13 APIs** (includes SSE + AI)
Total: **15 APIs**

---

## 4) API response style (planning rules)
### Standard response
- Success: `{ ok: true, data: ... }`
- Error: `{ ok: false, error: { code, message } }`

### IDs & time
- Use ISO timestamps always.
- Use `deviceId` as a stable identifier.

### Validation
- If payload invalid: return 400 and store nothing.
- If partial data allowed: store with `validationWarnings`.

---

## 5) Which APIs map to which UI pages (so team doesn’t get confused)
- Dashboard (`/`): `GET /dashboard/summary`, `GET /recommendations/active`, SSE events
- Alerts (`/alerts`): `GET /alerts`, `POST /alerts/:id/ack`
- Devices (`/devices`): `GET /devices`, `POST /devices/pair`, SSE device status
- Sensors (`/sensors`): `GET /readings`
- Analytics (`/analytics`): `GET /analytics/overview`
- AI Assistant (`/ai-assistant`): `POST /ai/chat`, `GET /ai/suggestions`

---

## 6) Next decision (need your confirmation)
Choose transport for NodeMCU MVP:
- Option A: **HTTP POST** to `/api/v1/ingest/readings` (recommended)
- Option B: MQTT (more setup)

Once you confirm, we freeze:
- endpoint names
- auth header name
- expected payload + frequency
