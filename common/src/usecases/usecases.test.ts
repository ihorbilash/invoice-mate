import { describe, it, expect, vi } from "vitest";

import { CreateInvoiceUseCase } from "./create-invoice.usecase.js";
import { GetInvoicesListUseCase } from "./get-invoices-list.usecase.js";

type CreateInvoiceRepo = ConstructorParameters<typeof CreateInvoiceUseCase>[0];
type GetInvoicesRepo = ConstructorParameters<typeof GetInvoicesListUseCase>[0];

describe("CreateInvoiceUseCase ", () => {
  it("delegates creation to repository", async () => {
    const payload = { amount: 100, currency: "USD" };
    const createdInvoice = { id: "inv_1", ...payload };
    const repository: CreateInvoiceRepo = {
      createInvoice: vi.fn().mockResolvedValue(createdInvoice),
    };

    const useCase = new CreateInvoiceUseCase(repository);
    const result = await useCase.execute(payload as never);

    expect(repository.createInvoice).toHaveBeenCalledWith(payload);
    expect(result).toEqual(createdInvoice);
  });
});

describe("GetInvoicesListUseCase ", () => {
  it("returns invoices from repository", async () => {
    const invoices = [
      { id: "1", amount: 100 },
      { id: "2", amount: 200 },
    ];
    const repository: GetInvoicesRepo = {
      getInvoices: vi.fn().mockResolvedValue(invoices),
    };

    const useCase = new GetInvoicesListUseCase(repository);
    const result = await useCase.execute();

    expect(repository.getInvoices).toHaveBeenCalled();
    expect(result).toEqual(invoices);
  });
});
