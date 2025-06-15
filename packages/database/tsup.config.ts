import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  entry: ["src/client.ts"],
  format: ["esm"],
});
