import dotenv from "dotenv";
import path from "node:path";
import assert from "node:assert/strict";

const ENV_FILE = path.join(
  import.meta.dirname.split(path.sep).slice(0, -2).join(path.sep),
  ".env"
);

export function loadEnvs() {
  dotenv.config({ path: ENV_FILE, override: false });
  console.log("Envs loaded from:", ENV_FILE);
}

export function required(variable?: string): string {
  assert(variable, "Required variable is not set");
  return variable;
}

loadEnvs();
export default process.env;
