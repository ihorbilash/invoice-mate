import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { Invoice } from "@/hooks/useInvoices";
import { FileText } from "lucide-react";

interface InvoiceTableProps {
  invoices: Invoice[];
  isLoading: boolean;
}

export function InvoiceTable({ invoices, isLoading }: InvoiceTableProps) {
  if (isLoading) {
    return (
      <div className="glass rounded-lg p-8">
        <div className="flex items-center justify-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-muted-foreground">Loading invoices...</span>
        </div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="glass rounded-lg p-12 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">No invoices yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first invoice to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="font-semibold">Invoice</TableHead>
            <TableHead className="font-semibold">Client</TableHead>
            <TableHead className="font-semibold">Amount</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Due Date</TableHead>
            <TableHead className="font-semibold">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice, index) => (
            <TableRow
              key={invoice.id}
              className="animate-fade-in hover:bg-muted/50 transition-colors"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell className="font-mono font-medium text-primary">
                {invoice.invoice_number}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{invoice.client_name}</p>
                  {invoice.client_email && (
                    <p className="text-sm text-muted-foreground">
                      {invoice.client_email}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className="font-mono font-semibold">
                ${Number(invoice.amount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>
                <StatusBadge status={invoice.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(invoice.due_date), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-muted-foreground max-w-[200px] truncate">
                {invoice.description || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
