import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      include: [
        "apps/**/*.test.ts",
        "common/**/*.test.ts",
        "core/**/*.test.ts",
      ],
      name: "all",
      isolate: true,
    },
  },
]);
