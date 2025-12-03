import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["apps/**/*.test.ts", "common/**/*.test.ts", "core/**/*.test.ts"],
    name: "all",
    isolate: true,
  },
});
