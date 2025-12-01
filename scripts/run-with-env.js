#!/usr/bin/env node
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const DEFAULT_ENV_PATH = join(__dirname, "..", ".env");

export function parseEnvFile(envPath = DEFAULT_ENV_PATH) {
  const envVars = {};
  const fileContents = readFileSync(envPath, "utf-8");
  fileContents.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }
    const [key, ...valueParts] = trimmed.split("=");
    if (!key) {
      return;
    }
    const value = valueParts.join("=").replace(/^["']|["']$/g, "");
    envVars[key.trim()] = value.trim();
  });
  return envVars;
}

export function mergeEnvs(baseEnv, envVars) {
  return {
    ...baseEnv,
    ...envVars,
  };
}

export function replacePlaceholders(args, env) {
  return args.map((arg) =>
    arg.replace(/__([A-Z_][A-Z0-9_]*)__/g, (match, varName) => {
      const value = env[varName];
      if (value === undefined) {
        console.error(
          `Warning: Environment variable ${varName} not found in .env file`
        );
        return match;
      }
      return value;
    })
  );
}

export function createSpawnPromise(command, commandArgs, options = {}) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, commandArgs, options);
    const result = {
      stdout: "",
      stderr: "",
    };

    if (child.stdout) {
      child.stdout.on("data", (chunk) => {
        result.stdout += chunk.toString();
      });
    }

    if (child.stderr) {
      child.stderr.on("data", (chunk) => {
        result.stderr += chunk.toString();
      });
    }

    child.on("exit", (code) => {
      resolvePromise({ code: code ?? 0, ...result });
    });

    child.on("error", (error) => {
      rejectPromise(error);
    });
  });
}

export async function runWithEnv(args, options = {}) {
  const {
    envPath = DEFAULT_ENV_PATH,
    baseEnv = process.env,
    spawnOptions,
  } = options;
  if (!args.length) {
    throw new Error("Usage: run-with-env.js <command> [args...]");
  }

  const envVars = parseEnvFile(resolve(envPath));
  const env = mergeEnvs(baseEnv, envVars);
  const processedArgs = replacePlaceholders(args, env);

  const [command, ...commandArgs] = processedArgs;
  if (!command) {
    throw new Error("Command is required");
  }

  const finalSpawnOptions = {
    stdio: "inherit",
    shell: false,
    ...spawnOptions,
    env,
  };

  return createSpawnPromise(command, commandArgs, finalSpawnOptions);
}

async function runCli() {
  try {
    const result = await runWithEnv(process.argv.slice(2));
    process.exit(result.code);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

const invokedDirectly =
  (process.argv[1] &&
    pathToFileURL(process.argv[1]).href === import.meta.url) ||
  process.argv[1] === __filename;

if (invokedDirectly) {
  runCli();
}
