# AgroSense AI — PPT + Team Report Draft

Date: 15 Apr 2026  
Prepared from: `AgroSenseAI_Scope_and_Plan.md`, `AgroSenseAI_API_Plan.md`, `NodeMCU_Arduino_and_IoT_Flow_Beginner_Guide.md`

---

## 1) One-Line Project Summary
**AgroSense AI** ek IoT-based smart farming decision system hai jisme sensors ka real-time data backend me aata hai, alerts + actionable recommendations generate hoti hain, aur farmer ko clear next step milta hai.

---

## 2) Hum Kya Bana Rahe Hain (What We Are Building)
- Sensor-driven farm monitoring + decision support platform
- Focus sirf charts pe nahi, **actionable guidance** pe hai
- Core output:
  - Priority alerts (low moisture, high temp, pH issue, rain, device offline)
  - Main recommendation card (example: “Irrigate 10–15 min”)
  - AI Assistant (context-aware chat using real farm data)

---

## 3) Kaise Bana Rahe Hain (How We Are Building)
### End-to-end Flow
Sensors -> NodeMCU (ESP8266) -> WiFi -> Node.js Backend API -> MongoDB -> Alert/Recommendation Engine -> Frontend (Next.js)

### Phase Strategy
1. **Phase 1 (MVP):** One-way HTTP ingest + rules-based alerts/recommendations
2. **Phase 2:** Realtime stream + AI chat integration + optional two-way device communication
3. **Phase 3:** Advanced reliability (OTA, richer analytics, device health)

---

## 4) Current Project Status (Team Update)
### Frontend Status
- UI routes ready: Dashboard, AI Assistant, Sensors, Alerts, Devices, Analytics, Settings
- Current status: mostly scaffold/placeholder; real backend integration pending

### Backend Status (Planned Architecture Ready)
- Ingestion module plan ready
- Alert engine plan ready
- Recommendation module plan ready
- Device online/offline tracking plan ready
- API structure and endpoint naming drafted

### Hardware/IoT Status
- NodeMCU + Arduino flow defined (beginner to deploy path clear)
- MVP communication confirmed as one-way HTTP POST pattern

---

## 5) API Plan Snapshot (for PPT/report)
### NodeMCU -> Backend
- MVP: `POST /api/v1/ingest/readings`
- Recommended add-on: `POST /api/v1/ingest/heartbeat`

### Client -> Backend (MVP core)
- Auth: login/logout
- Dashboard summary + active recommendations
- Alerts list + acknowledge
- Devices list + pair device
- Readings history
- Analytics overview

### Count Summary
- Minimum practical MVP: **11 APIs total**
- Next-level demo (SSE + AI): **15 APIs total**

---

## 6) AI/LLM Integration Strategy
- Deterministic rule engine remains primary safety layer
- LLM used for explanation + conversational guidance
- LLM is always grounded with:
  - latest sensor snapshot
  - recent trend summary (24h/7d)
  - active/recent alerts
  - recent decisions/recommendations
- Assistant response format:
  - clear action
  - short reason (1–3 points)
  - confidence level

---

## 7) Alert + Recommendation Logic (Core Product Value)
### Alert Types
- Low soil moisture
- High temperature
- pH out of range
- Rain detected
- Device offline
- Sensor fault/anomaly

### Recommendation Example
- Action: Irrigate for 10–15 minutes
- Reason: moisture below threshold, no rain, rising temperature trend
- Confidence: High/Medium/Low

### Anti-spam Controls
- Hysteresis
- Cooldown window

---

## 8) Roles and Access (Team/Client Clarity)
- **Owner/Admin:** full control, thresholds, devices, overview
- **Worker/Operator:** dashboard + alerts + ack actions
- **Agronomist (optional):** advisory/read-oriented role
- **Viewer (optional):** read-only access

---

## 9) PPT Ready Slide Structure (Copy Directly)
1. Title + vision (AgroSense AI)
2. Problem in farming decisions today
3. Our solution (action-first, not chart-first)
4. System architecture (sensor to dashboard)
5. Hardware stack (NodeMCU + sensors)
6. Software stack (Next.js + Node.js + MongoDB)
7. Core modules (ingestion, alerts, recommendations, devices)
8. API strategy (MVP vs next-level counts)
9. AI strategy (rule engine + grounded LLM)
10. Current progress (UI ready, backend integration in progress)
11. Near-term roadmap (Phase 1 -> 2 -> 3)
12. Expected impact/demo outcome

---

## 10) Team Report (Copy-Paste Version)
**Subject:** AgroSense AI Weekly Build Update

Team,

Hum AgroSense AI me ek IoT-powered smart farming decision system build kar rahe hain. Iska main goal sirf monitoring nahi, balki farmer ko clear next action dena hai.

### What we are building
- Sensor data ingestion from NodeMCU
- Backend alerts + actionable recommendations
- Dashboard + AI Assistant for easy decision support

### How we are building
- Phase 1: NodeMCU -> HTTP ingest -> backend rules engine -> dashboard output
- Phase 2: realtime updates + AI chat grounded on farm context
- Phase 3: advanced automation/reliability improvements

### Current status
- Frontend pages scaffold ready
- API structure defined
- IoT communication flow defined
- Backend integration and rule implementation are priority work

### Immediate next tasks
- Freeze ingest payload + frequency
- Build `/api/v1/ingest/readings`
- Implement dashboard summary + alerts APIs
- Connect frontend to live backend data

### Outcome target
Ek working demo jahan live/near-live sensor data se alerts aur recommendations generate ho, aur AI assistant context-aware explanation de.

Thanks.

---

## 11) Decisions to Freeze Quickly (for smooth execution)
- NodeMCU send interval: `1 min` / `2 min` / `5 min`
- MVP timestamp source: server-side
- Device auth header: `X-Device-Token`
- Duplicate policy: `deviceId + timestamp` idempotency rule
- Initial alert thresholds per sensor

---

## 12) Short WhatsApp/Slack Update (Optional)
AgroSense AI update: hum smart farming decision platform build kar rahe hain jahan NodeMCU sensor data backend ko send karega, system alerts + recommendation generate karega, aur dashboard pe clear action milega. UI scaffold ready hai, API architecture finalize ho chuka hai, next focus live ingest + alerts + dashboard integration hai.
