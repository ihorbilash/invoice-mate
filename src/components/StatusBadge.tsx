import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "pending" | "paid" | "overdue";
}

const statusConfig = {
  paid: {
    label: "Paid",
    className: "status-paid",
  },
  pending: {
    label: "Pending",
    className: "status-pending",
  },
  overdue: {
    label: "Overdue",
    className: "status-overdue",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
