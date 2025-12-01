import {
  invoicesRepository,
  InvoicesRepository,
} from "../repositories/invoices.repository.js";
import { CreateInvoice } from "../utils/types.js";

export class CreateInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoicesRepository) {}
  async execute(invoiceData: CreateInvoice) {
    return await this.invoiceRepository.createInvoice(invoiceData);
  }
}

export const createInvoiceUseCase = new CreateInvoiceUseCase(
  invoicesRepository
);
