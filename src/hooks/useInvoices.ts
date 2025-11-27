import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string | null;
  amount: number;
  status: "pending" | "paid" | "overdue";
  due_date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceData {
  invoice_number: string;
  client_name: string;
  client_email?: string;
  amount: number;
  status?: "pending" | "paid" | "overdue";
  due_date: string;
  description?: string;
}

export function useInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Invoice[];
    },
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoice: CreateInvoiceData) => {
      const { data, error } = await supabase
        .from("invoices")
        .insert([invoice])
        .select()
        .single();

      if (error) throw error;
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
      const { data, error } = await supabase.functions.invoke("health");
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Check every 30 seconds
  });
}
