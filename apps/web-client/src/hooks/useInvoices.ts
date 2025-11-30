import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAPIFetch } from "@/api/fetch";
import type {
  CreateInvoiceData,
  HealthStatus,
  Invoice,
} from "@monorepo/common/src/utils/types.js";

// load invoices
export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const data = await useAPIFetch<Invoice[]>("/invoices/list", {
        method: "GET",
      });

      if (!data) throw new Error("No invoices found");
      return data as Invoice[];
    },
  });
}

//create invoice
export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoice: CreateInvoiceData) => {
      const data = await useAPIFetch<Invoice>("/invoices/create", {
        method: "POST",
        body: JSON.stringify(invoice),
      });

      if (!data) throw new Error("No invoice created");
      return data as Invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({
        title: "Invoice created",
        description: "Your invoice has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const data = await useAPIFetch<HealthStatus>("/health", {
        method: "GET",
      });

      if (!data) throw new Error("");
      return data;
    },
    refetchInterval: 30000, // Check every 30 seconds
  });
}
