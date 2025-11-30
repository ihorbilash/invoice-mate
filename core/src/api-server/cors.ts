import { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import env, { required } from "@monorepo/core/src/env.js";

const CORS_ORIGIN = required(env.CORS_ORIGIN);
const SITE_URL = required(env.CORS_ORIGIN);

export function registerCorsPlugin(fastify: FastifyInstance) {
  fastify.register(fastifyCors, {
    origin:
      env.NODE_ENV === "production" ? (CORS_ORIGIN || "").split(",") : SITE_URL,
    credentials: true,
  });
}
