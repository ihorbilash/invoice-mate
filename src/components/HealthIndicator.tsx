import { useHealthCheck } from "@/hooks/useInvoices";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

export function HealthIndicator() {
  const { data, isLoading, isError } = useHealthCheck();

  const status = isLoading ? "checking" : isError ? "unhealthy" : "healthy";

  return (
    <div className="flex items-center gap-2 text-sm">
      <Activity className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">API:</span>
      <span
        className={cn(
          "flex items-center gap-1.5 font-medium",
          status === "healthy" && "text-success",
          status === "unhealthy" && "text-destructive",
          status === "checking" && "text-muted-foreground"
        )}
      >
        <span
          className={cn(
            "h-2 w-2 rounded-full",
            status === "healthy" && "bg-success animate-pulse",
            status === "unhealthy" && "bg-destructive",
            status === "checking" && "bg-muted-foreground animate-pulse"
          )}
        />
        {status === "healthy" && "Healthy"}
        {status === "unhealthy" && "Unhealthy"}
        {status === "checking" && "Checking..."}
      </span>
    </div>
  );
}
