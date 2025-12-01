import env, { required } from "@monorepo/core/src/env.js";
import { execSync } from "child_process";

const token = required(env.SUPABASE_TOKEN);
const projectId = required(env.SUPABASE_PROJECT_ID);

execSync(`supabase login --token ${token}`, {
  stdio: "inherit",
});

execSync(`supabase functions deploy health --project-ref ${projectId}`, {
  stdio: "inherit",
});
