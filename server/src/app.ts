import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { ingestRouter } from "./modules/readings/ingest.routes.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: "256kb" }));
  app.use(pinoHttp({ logger }));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/v1/ingest", ingestRouter);

  // Basic error handler
  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error({ err }, "Unhandled error");
    res.status(500).json({ ok: false, error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
  });

  return app;
}
