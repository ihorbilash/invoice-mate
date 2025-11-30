import { pino } from "pino";

const options = {
  name: "fastify",
  level: process.env.LOG_LEVEL || "info",
};

const logger = pino(options);

export { logger, options };
