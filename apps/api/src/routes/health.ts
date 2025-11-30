import type { Fastify } from "@monorepo/core/src/api-server.js";
import { JSONSchemaType } from "@monorepo/core/src/validation.js";
import type { HealthStatus } from "@monorepo/common/src/utils/types.js";

import { healthCheckUseCase } from "@monorepo/common/src/usecases/health-check.usecase.js";

export const healthStatusResponseSchema: JSONSchemaType<HealthStatus> = {
  type: "object",
  properties: {
    status: { type: "string" },
    timestamp: { type: "string" },
    service: { type: "string" },
    version: { type: "string" },
  },
  required: ["status", "timestamp", "service", "version"],
};

export default async function (
  app: Fastify.FastifyInstance,
  _: Fastify.FastifyPluginOptions
) {
  app.get<{
    Reply: { 200: any };
  }>(
    "/health",
    {
      schema: {
        response: {
          200: healthStatusResponseSchema,
        },
      },
    },
    async (_, res) => {
      const data = await healthCheckUseCase.execute();

      return res.status(200).send(data);
    }
  );
}
