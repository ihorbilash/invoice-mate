import type { Fastify } from "@monorepo/core/src/api-server.js";
import { JSONSchemaType } from "@monorepo/core/src/validation.js";
import type { Invoice } from "@monorepo/common/src/utils/types.js";
import { InvoiceStatusEnum } from "@monorepo/common/src/utils/types.js";
import { supabaseClient } from "@monorepo/core/src/db/supabase-client.js";

export const invoicesResponseSchema: JSONSchemaType<Invoice[]> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: "string" },
      amount: { type: "number" },
      client_email: { type: "string", nullable: true },
      client_name: { type: "string" },
      created_at: { type: "string" },
      description: { type: "string", nullable: true },
      due_date: { type: "string" },
      invoice_number: { type: "string" },
      status: {
        type: "string",
        enum: Object.values(InvoiceStatusEnum),
      },
      updated_at: { type: "string" },
    },
    required: [
      "id",
      "amount",
      "client_name",
      "created_at",
      "due_date",
      "invoice_number",
      "status",
      "updated_at",
    ],
  },
};

export default async function (
  app: Fastify.FastifyInstance,
  _: Fastify.FastifyPluginOptions
) {
  app.get<{
    Reply: { 200: Invoice[] };
  }>(
    "/list",
    {
      schema: {
        // params: paramsSchema,
        response: {
          200: invoicesResponseSchema,
        },
      },
    },
    async (_, res) => {
      //   const document = await getTranslationContent(id, isShielding);
      const { data } = await supabaseClient.from("invoices").select("*");

      if (!data) {
        throw new Error("Failed to fetch invoices");
      }

      return res.status(200).send(data);
    }
  );
}
