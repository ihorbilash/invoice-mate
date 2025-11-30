import { useInvoices } from "@/hooks/useInvoices";
import { InvoiceTable } from "@/components/InvoiceTable";
import { CreateInvoiceDialog } from "@/components/CreateInvoiceDialog";
import { HealthIndicator } from "@/components/HealthIndicator";
import { FileText, DollarSign, Clock, CheckCircle } from "lucide-react";

const Index = () => {
  const { data: invoices = [], isLoading } = useInvoices();

  const stats = {
    total: invoices.length,
    totalAmount: invoices.reduce((sum, inv) => sum + Number(inv.amount), 0),
    pending: invoices.filter((inv) => inv.status === "pending").length,
    paid: invoices.filter((inv) => inv.status === "paid").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Invoice Service</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your invoices
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <HealthIndicator />
              <CreateInvoiceDialog />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<FileText className="h-5 w-5" />}
            label="Total Invoices"
            value={stats.total.toString()}
            color="primary"
          />
          <StatCard
            icon={<DollarSign className="h-5 w-5" />}
            label="Total Amount"
            value={`$${stats.totalAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}`}
            color="success"
          />
          <StatCard
            icon={<Clock className="h-5 w-5" />}
            label="Pending"
            value={stats.pending.toString()}
            color="warning"
          />
          <StatCard
            icon={<CheckCircle className="h-5 w-5" />}
            label="Paid"
            value={stats.paid.toString()}
            color="success"
          />
        </div>

        {/* Invoice Table */}
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold mb-4">Recent Invoices</h2>
          <InvoiceTable invoices={invoices} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "primary" | "success" | "warning" | "destructive";
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    destructive: "text-destructive bg-destructive/10",
  };

  return (
    <div className="glass rounded-lg p-4 animate-slide-in">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default Index;
