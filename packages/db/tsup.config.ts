import { defineConfig } from "tsup";

export default defineConfig({
  format: ["esm"],
  entry: ["src/client.ts"],
  sourcemap: true,
  clean: true,
});
