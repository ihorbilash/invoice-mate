import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log(`Invoices endpoint called with method: ${req.method}`);

  try {
    if (req.method === 'GET') {
      // Fetch all invoices
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching invoices:", error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} invoices`);

      return new Response(JSON.stringify({ invoices: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (req.method === 'POST') {
      // Create new invoice
      const body = await req.json();
      console.log("Creating invoice:", JSON.stringify(body));

      const { data, error } = await supabase
        .from('invoices')
        .insert([body])
        .select()
        .single();

      if (error) {
        console.error("Error creating invoice:", error);
        throw error;
      }

      console.log("Invoice created:", data?.id);

      return new Response(JSON.stringify({ invoice: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201,
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });

  } catch (error: unknown) {
    console.error("Invoices endpoint error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    
    return new Response(JSON.stringify({ 
      error: message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
