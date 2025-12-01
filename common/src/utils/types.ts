export type Invoice = {
  amount: number;
  client_email?: string | null;
  client_name: string;
  created_at: string;
  description?: string | null;
  due_date: string;
  id: string;
  invoice_number: string;
  status: InvoiceStatus;
  updated_at: string;
};

export type CreateInvoice = {
  invoice_number: string;
  client_name: string;
  client_email?: string;
  amount: number;
  status?: InvoiceStatus;
  due_date: string;
  description?: string;
};

export type HealthStatus = {
  status: string;
  timestamp: string;
  service: string;
  version: string;
};

export type InvoiceStatus = "pending" | "paid" | "overdue";

export enum InvoiceStatusEnum {
  pending = "pending",
  paid = "paid",
  overdue = "overdue",
}
