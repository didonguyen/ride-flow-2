import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"]
  },
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname,
      "@/src": new URL("./src", import.meta.url).pathname,
      "@/components": new URL("./components", import.meta.url).pathname
    }
  }
});
