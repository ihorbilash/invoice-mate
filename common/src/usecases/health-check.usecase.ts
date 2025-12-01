import { supabaseClient } from "@monorepo/core/src/db/supabase-client.js";

class HealthCheckUseCase {
  async execute() {
    const { data, error } = await supabaseClient.functions.invoke("health");
    if (error) {
      throw new Error(`Health check failed: ${error.message}`); // // change to global handler exception
    }
    return data;
  }
}

export const healthCheckUseCase = new HealthCheckUseCase();
