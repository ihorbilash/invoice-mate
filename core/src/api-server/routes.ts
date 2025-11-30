import { FastifyInstance } from "fastify";
import fastifyAutoload from "@fastify/autoload";

import env, { required } from "@monorepo/core/src/env.js";

const ENVIRONMENT = required(env.ENVIRONMENT);

export function registerRoutesAutoloadPlugin(
  fastify: FastifyInstance,
  options: { prefix: string; dir: string }
) {
  fastify.register(fastifyAutoload, {
    dir: options.dir,
    scriptPattern: ENVIRONMENT === "development" ? /\.ts$/ : /\.js$/,
    routeParams: true,
    options: { prefix: options.prefix },
  });
}
