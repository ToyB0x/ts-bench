import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const DB_FILE_NAME = process.env["DB_FILE_NAME"];
if (!DB_FILE_NAME)
  throw new Error("DB_FILE_NAME environment variable is not set.");

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema/tables.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: DB_FILE_NAME,
  },
});
