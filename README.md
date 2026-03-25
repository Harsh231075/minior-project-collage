# AgroSense AI (Mini Project)

Smart agriculture dashboard + AI assistant UI.

## Repo Structure

- `client/` — Next.js app (UI)
- `server/` — backend placeholder (currently empty)

## Tech Stack (Client)

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Framer Motion
- lucide-react icons

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Run the client

```bash
cd client
npm install
npm run dev
```

Open:

- `http://localhost:3000/` — Dashboard
- `http://localhost:3000/ai-assistant` — AI Assistant (mobile-first chat UI)

### Build / Lint

```bash
cd client
npm run lint
npm run build
npm start
```

## Notes

- The `server/` directory is reserved for backend APIs/services. Add your server implementation there when ready.
- If you add environment variables later, prefer a `client/.env.local` file for local development (do not commit secrets).
