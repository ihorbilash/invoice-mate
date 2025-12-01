import type { Fastify } from "@monorepo/core/src/api-server.js";
import { JSONSchemaType } from "@monorepo/core/src/validation.js";
import {
  InvoiceStatusEnum,
  type CreateInvoice,
  type Invoice,
} from "@monorepo/common/src/utils/types.js";

import { createInvoiceUseCase } from "@monorepo/common/src/usecases/create-invoice.usecase.js";

type CreateInvoiceResponse = Omit<Invoice, "id">;

const createInvoiceDataSchema: JSONSchemaType<CreateInvoice> = {
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
  app.post<{ Body: CreateInvoice; Reply: { 200: Invoice } }>(
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
      const data = await createInvoiceUseCase.execute({
        client_email,
        client_name,
        invoice_number,
        amount,
        status,
        due_date,
        description,
      });

      return res.status(200).send(data);
    }
  );
}
