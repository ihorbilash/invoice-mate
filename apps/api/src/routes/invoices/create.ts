import type { Fastify } from "@monorepo/core/src/api-server.js";
import { JSONSchemaType } from "@monorepo/core/src/validation.js";
import {
  InvoiceStatusEnum,
  type CreateInvoiceData,
  type Invoice,
} from "@monorepo/common/src/utils/types.js";
import { supabaseClient } from "@monorepo/core/src/db/supabase-client.js";

type CreateInvoiceResponse = Omit<Invoice, "id">;

const createInvoiceDataSchema: JSONSchemaType<CreateInvoiceData> = {
  type: "object",
  properties: {
    invoice_number: { type: "string" },
    client_name: { type: "string" },
    client_email: { type: "string", nullable: true },
    amount: { type: "number" },
    status: {
      type: "string",
      enum: Object.values(InvoiceStatusEnum),
      nullable: true,
    },
    due_date: { type: "string" },
    description: { type: "string", nullable: true },
  },
  required: ["invoice_number", "client_name", "amount", "due_date"],
};

export const createInvoicesResponseSchema: JSONSchemaType<CreateInvoiceResponse> =
  {
    type: "object",
    properties: {
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
      "amount",
      "client_name",
      "created_at",
      "due_date",
      "invoice_number",
      "status",
      "updated_at",
    ],
  };

export default async function (
  app: Fastify.FastifyInstance,
  _: Fastify.FastifyPluginOptions
) {
  app.post<{ Body: CreateInvoiceData; Reply: { 200: Invoice } }>(
    "/create",
    {
      schema: {
        body: createInvoiceDataSchema,
        response: {
          200: createInvoicesResponseSchema,
        },
      },
    },
    async (req, res) => {
      const {
        client_email,
        client_name,
        invoice_number,
        amount,
        status,
        due_date,
        description,
      } = req.body;
      //   const document = await getTranslationContent(id, isShielding);
      const { data, error } = await supabaseClient
        .from("invoices")
        .insert([
          {
            client_email,
            client_name,
            invoice_number,
            amount,
            status,
            due_date,
            description,
          },
        ])
        .select()
        .single();

      if (!data) {
        throw new Error("Failed to fetch invoices");
      }

      return res.status(200).send(data);
    }
  );
}
