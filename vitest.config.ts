import { defineConfig } from "vitest/config";
import path from "node:path";

const root = import.meta.dirname;

export default defineConfig({
  resolve: {
    alias: {
      "@": root,
      "server-only": path.resolve(root, "lib/__tests__/__mocks__/server-only.ts"),
    },
  },
  test: {
    environment: "node",
  },
});
