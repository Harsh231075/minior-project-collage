
# AgroSense AI — Scope, Flow & Build Plan (for team/bhai)

Date: 25 Mar 2026

## 0) One-line summary
AgroSense AI is an **IoT decision-making system for farmers**: sensors send readings → backend stores + analyzes → system generates **alerts + “what to do next” recommendations** → UI shows actions clearly (not too many charts).

---

## 1) What we already have (Client/UI status)
The `client/` is a Next.js UI scaffold with these routes:
- Dashboard (`/`) — strong UI layout + demo AI recommendation + demo zone cards
- AI Assistant (`/ai-assistant`) — ChatGPT-like UI (currently simulated responses)
- Sensors (`/sensors`) — placeholder for historical table/logs
- Alerts (`/alerts`) — placeholder inbox (active/archived)
- Devices (`/devices`) — placeholder “pair new device”
- Analytics (`/analytics`) — placeholder
- Settings (`/settings`) — static profile-style settings UI

Important: UI looks “complete” but **real functionality is not connected yet** (no real API, no real DB, no device status tracking).

---

## 2) Hardware → Software flow (real system)
### Hardware chain
Sensors → NodeMCU (ESP8266) → WiFi → Node.js Backend API → MongoDB → Alert/AI Logic → Frontend UI

### Sensors
- Soil Moisture
- Temperature & Humidity (DHT11)
- Soil pH
- Rain sensor

### Data payload (example)
Backend receives JSON (from NodeMCU):
```json
{
	"deviceId": "farm_1",
	"temperature": 32.5,
	"humidity": 70,
	"soilMoisture": 620,
	"phValue": 6.5,
	"rain": 0,
	"timestamp": "2026-03-25T12:00:00Z"
}
```

---

## 3) What makes AgroSense AI “next-level” (core product thinking)
### Not just monitoring
We are not building a generic dashboard. We are building **decision support**.

### UX principle
User should feel: **“I know exactly what to do next.”**

So the UI should:
- highlight 1 main recommendation
- show 2–3 highest priority alerts
- keep sensor data minimal (details hidden in Sensors page)

---

## 4) Users & roles (realistic)
Minimum realistic roles:

1) **Owner / Admin**
- Add/remove devices
- Set farm zones
- Configure alert thresholds
- View everything

2) **Worker / Operator**
- View dashboard + alerts
- Acknowledge alerts
- Perform actions (manual irrigation step, field check)

3) **Agronomist / Advisor (optional)**
- Read-only access
- Add notes / recommendations (optional future)

4) **Viewer (optional)**
- Read-only dashboard

If we want multi-farm support later:
- One account can have multiple farms
- Each farm has zones + devices

---

## 5) Backend data handling (what must be decided first)
### Transport (recommended)
- Phase 1: **HTTP POST** from NodeMCU (easy, mini-project friendly)
- Phase 2 (optional): MQTT for scaling

### Device authentication (must-have)
- Each device has a **device token** or API key
- Without auth, anyone can send fake readings

### Validation rules (must-have)
- Check types + ranges (examples):
	- humidity: 0–100
	- pH: 0–14
	- rain: 0/1
	- temperature: expected sensor range
	- soilMoisture: expected ADC range
- Handle missing fields (reject or store partial with flags)

### Duplicates / idempotency
If the same `deviceId + timestamp` arrives again:
- ignore duplicate OR update last record (choose one)

### Data frequency
Define expected send interval (example): every 30 seconds / 1 minute / 5 minutes.
This affects:
- device offline detection
- database size
- chart aggregation

---

## 6) Proposed backend modules (no code, just clear pieces)
### A) Ingestion API
Responsibilities:
- Receive reading
- Validate + normalize
- Store into DB
- Update `devices.lastSeen`
- Trigger alert + recommendation checks

### B) Device status service
- “Online” if lastSeen within X minutes
- “Offline” if no data > X minutes

### C) Alert engine (rules-based)
Generate alerts like:
- Low moisture (warn/critical)
- High temperature
- pH out of range
- Rain detected (pause irrigation suggestion)
- Device offline
- Sensor fault (stuck value / out-of-range)

Avoid alert spam:
- **hysteresis** (don’t flip too quickly)
- **cooldown** (don’t repeat same alert every minute)

Workflow:
Active → Acknowledge → Resolved/Archived

### D) Recommendation service (AI-style decisions)
Start with deterministic rules (Phase 1), then become smarter:
- Phase 1: rule-based “action cards” (with reason + confidence)
- Phase 2: add crop/soil context
- Phase 3: AI Assistant uses real data + history to answer

Each recommendation should store:
- suggested action (e.g., irrigate 15 min)
- reason (the key data points)
- confidence (simple score)
- createdAt + related device/zone

---

## 6.1) External LLM layer (Claude / OpenAI / Groq) — how “real AI” will work
You said clearly: our chatbot will NOT be a normal generic chatbot. It must know:
- **current sensor data** (latest readings)
- **past/historical data** (last 24h/7d trends)
- **recent alerts + decisions** (what happened and what we did)

So we will integrate an external LLM provider (example providers: Claude, OpenAI, Groq) but we will **always ground it** with our farm context.

### A) Where LLM fits in the architecture
We will keep two layers:

1) **Deterministic engine (rules-based)**
- Creates alerts and base recommendations reliably
- Works even if LLM is down
- Prevents hallucinations for critical actions

2) **LLM layer (reasoning + explanation + conversation)**
- Explains “why” in simple farmer language
- Summarizes “what changed since yesterday”
- Answers questions using our real data (“data-aware chat”)
- Suggests optional optimizations, but should not override safety rules

### B) Context we send to LLM (the important part)
The LLM input should include **structured context**, not raw database dumps:

- Farm identity: farmId, zoneId, deviceId
- Latest reading snapshot (current values + timestamp)
- Recent history summary (e.g., last 6h/24h min/max/avg + trend direction)
- Recent alerts (top 3–5) with severity + status
- Recent recommendations (applied/dismissed)
- Farm metadata (optional future): crop type, soil type, growth stage

This context is what makes responses “real” and not generic.

### C) System instruction (policy for the assistant)
We will send a strong system instruction that enforces:
- **Grounding**: only claim facts that appear in provided context
- **Action-first**: always end with a clear next step (e.g., “Irrigate 10–15 min” or “Wait; rain detected”)
- **Safety**: do not recommend unsafe actions; if unsure, ask a short clarifying question
- **Explainability**: provide 1–3 reasons (not a long essay)
- **No spam**: do not show too many numbers; keep it farmer-friendly

### D) Two AI outputs we want
1) **Recommendation text for dashboard**
- Title: one line action
- Confidence: numeric or simple level (High/Medium/Low)
- Reasons: 2–3 bullets
- Suggested duration/target (if irrigation)

2) **Chat responses (AI Assistant)**
- Data-aware answers (current + past)
- Can compare: “now vs last 24h average”
- Can answer: “why did I get this alert?”

### E) Guardrails (to keep LLM reliable)
Minimum guardrails:
- If LLM fails: fallback to rule-based recommendation text
- If context is missing/outdated: assistant says it clearly (“Latest data not received since …”)
- Rate-limit and cache: avoid calling LLM too often for the same question
- Logging: store prompt metadata (not secrets) + response for debugging

### F) Privacy/cost notes (practical)
- Don’t send secrets/tokens to LLM.
- Keep payload small by sending summaries, not full history.
- Track cost per request and add a hard limit for demo.

---

## 7) MongoDB model (simple but practical)
### Collections
1) `devices`
- deviceId (unique)
- farmId
- zoneId (optional)
- name
- tokenHash (or token)
- lastSeen
- status (online/offline)
- firmwareVersion (optional)

2) `sensorReadings`
- deviceId
- timestamp (ISO)
- temperature, humidity, soilMoisture, phValue, rain
- flags: validationWarnings (optional)

Indexes (important):
- `(deviceId, timestamp)` unique or indexed

3) `alerts`
- deviceId / zoneId / farmId
- type (LOW_MOISTURE, DEVICE_OFFLINE, etc.)
- severity (info/warn/critical)
- status (active/ack/resolved/archived)
- createdAt, updatedAt
- message + suggestedAction

4) `recommendations`
- farmId / zoneId / deviceId
- title + action
- reason (structured)
- confidence
- status (active/dismissed/applied)
- createdAt

5) `users`, `farms`, `zones`
- users: role, farm memberships
- farms: name, location
- zones: name, cropType (future), soilType (future)

Retention idea:
- keep raw readings 30–90 days
- store hourly/daily aggregates for older history

---

## 8) Realtime updates (UI will feel “alive”)
Options:
- **SSE (Server-Sent Events)**: simplest for “live feed” (server → client)
- WebSockets: best if two-way, more complex
- Polling: easiest but less real-time

Recommended for mini project: **SSE**.

What to stream:
- latest reading per device
- new alert created
- new recommendation created
- device online/offline changes

---

## 9) UI pages: what each should do (decision-first)
### Dashboard
- 1 main recommendation card (action + reason + confidence)
- 2–3 top alerts
- minimal sensor summary
- zone health (optional)

### Alerts
- Inbox style: newest + highest severity
- one-tap Acknowledge
- archived tab

### Devices
- list with online/offline badge
- lastSeen time
- “pair new device” flow

### Sensors
- table + filters (device, date range)
- export CSV (optional)
- used mainly for debugging/historical check

### Analytics
Keep actionable:
- 24h moisture trend (1–2 charts max)
- anomaly markers
- alert frequency summary

### AI Assistant
- chat answers must be data-aware
- suggestion buttons: “Should I irrigate now?”, “Why alert happened?”, “Show last 24h moisture”

To make it “non-normal chatbot”, AI Assistant should always be backed by:
- latest reading + recent history summary
- recent alerts + recommendation history
- (optional) farm profile (crop/soil)

---

## 10) Step-by-step build plan (milestones)
### Milestone 1 — Ingestion + storage (MVP)
- Decide: HTTP POST, token auth, frequency
- Store readings in MongoDB
- Update device lastSeen/status

Success = we can post JSON and see it in DB + device becomes online.

### Milestone 2 — Alerts engine (rules)
- Add thresholds + cooldown + acknowledge flow
- Alert list visible in UI

Success = low moisture triggers alert + user can acknowledge it.

### Milestone 3 — Recommendations (decision cards)
- Generate recommendation card from rules
- Store + show on dashboard
- Track status: applied/dismissed

Success = dashboard shows a real actionable decision based on current data.

### Milestone 4 — Realtime feed
- Add SSE endpoint
- UI updates recommendation/alerts without refresh

Success = UI updates in real-time when new reading arrives.

### Milestone 5 — Analytics (minimal)
- daily/hourly aggregates
- one moisture trend + simple anomaly flags

Success = analytics helps answer “what happened yesterday?”

### Milestone 6 — AI Assistant becomes real (LLM + grounded farm context)
- Connect external LLM (Claude/OpenAI/Groq)
- Build a “context builder” that fetches: current snapshot + past summary + recent alerts
- Add system instruction for grounded, action-first responses
- Store chat logs (with farmId/deviceId) for improvement

Success = chat answers compare current vs past and reference our alerts/decisions.

---

## 11) Testing & reliability (simple but professional)
- A “device simulator” script (later) that sends readings at interval
- Basic API tests (ingestion + alert rules)
- Logging (request logs + errors)
- Env config: DB URL, tokens, thresholds via env vars

---

## 12) Optional future upgrades
- Add irrigation actuator control (relay) + audit logs of actions
- Weather API integration (rain forecast → adjust irrigation recommendation)
- Multi-zone mapping + farm map UI
- Battery/signal metrics if hardware supports

---

## Quick decision required (choose now)
For Phase 1 MVP, we should choose one transport:
- Option A: **HTTP POST** (recommended for mini-project)
- Option B: MQTT (more setup)

Once chosen, we can finalize endpoint contract + MongoDB schema.

