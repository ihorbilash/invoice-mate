import { join } from "path";

import env, { required } from "@monorepo/core/src/env.js";
import { ErrorsHandler } from "@monorepo/core/src/errors.js";

import path from "node:path";

import { options as loggerOptions } from "@monorepo/core/src/logger.js";
import { Fastify } from "@monorepo/core/src/api-server.js";
import { registerCorsPlugin } from "@monorepo/core/src/api-server/cors.js";
import { registerSecurityHeadersPlugin } from "@monorepo/core/src/api-server/headers.js";
import { registerRoutesAutoloadPlugin } from "@monorepo/core/src/api-server/routes.js";

const errorsHandler = new ErrorsHandler();
errorsHandler.handleProcessErrors();

const API_PORT = Number(required(env.API_PORT));
const APP_DIR = import.meta.dirname.split(path.sep).slice(0, -1).join(path.sep);
const SRC_DIR = join(APP_DIR, "src");

const main = async () => {
  // await connectToDb();
  const apiServer = Fastify({
    logger: loggerOptions,
    jsonShorthand: false,
    ajv: {
      customOptions: {
        keywords: ["collectionFormat"], // To support OpenAPI collectionFormat to handle querystring arrays. https://github.com/fastify/fastify-swagger?tab=readme-ov-file#openapi-parameter-options
      },
    },
  }); // https://fastify.dev/docs/latest/Reference/Server/#jsonshorthand
  registerCorsPlugin(apiServer);
  registerSecurityHeadersPlugin(apiServer);
  registerRoutesAutoloadPlugin(apiServer, {
    prefix: "api",
    dir: join(SRC_DIR, "routes"),
  });
  await apiServer.listen({ host: "0.0.0.0", port: API_PORT });
};

await main();
