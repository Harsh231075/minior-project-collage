import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

async function main() {
  await connectDb();

  const app = createApp();
  
  // Start the background data simulator for development
  await import("./scripts/simulator.js").then(m => m.startDataSimulator());

  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, "Server started");
  });
}

main().catch((err) => {
  logger.fatal({ err }, "Failed to start server");
  process.exit(1);
});
