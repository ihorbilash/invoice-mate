import { supabaseClient } from "@monorepo/core/src/db/supabase-client.js";
import { BaseRepository } from "./base.interface.js";
import { CreateInvoice, Invoice } from "../utils/types.js";

type InvoicesModel = ReturnType<(typeof supabaseClient)["from"]>;
export class InvoicesRepository extends BaseRepository<InvoicesModel> {
  constructor(model: typeof supabaseClient) {
    super(model.from("invoices") as InvoicesModel);
  }

  async getInvoices(): Promise<Invoice[]> {
    const { data, error } = await this.model.select("*");
    if (error) {
      throw new Error(`Failed to get invoices: ${error.message}`); // change to global handler exception
    }
    return data;
  }

  async createInvoice(invoiceData: CreateInvoice): Promise<Invoice> {
    const { data, error } = await this.model
      .insert([invoiceData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create invoice: ${error.message}`); // // change to global handler exception
    }
    return data;
  }
}

export const invoicesRepository = new InvoicesRepository(supabaseClient);
