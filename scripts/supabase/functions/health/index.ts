const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Health check endpoint called");

  try {
    const healthStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "invoice-service",
      version: "1.0.0",
    };

    console.log("Health status:", JSON.stringify(healthStatus));

    return new Response(JSON.stringify(healthStatus), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Health check error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    return new Response(
      JSON.stringify({
        status: "unhealthy",
        error: message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
