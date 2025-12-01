import {
  invoicesRepository,
  InvoicesRepository,
} from "../repositories/invoices.repository.js";

export class GetInvoicesListUseCase {
  constructor(private readonly invoiceRepository: InvoicesRepository) {}
  async execute() {
    return await this.invoiceRepository.getInvoices();
  }
}

export const getInvoicesListUseCase = new GetInvoicesListUseCase(
  invoicesRepository
);
