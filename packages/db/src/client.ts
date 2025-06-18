import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import "dotenv/config"; // If you need variable expansion in .env files, use @dotenvx/dotenvx/config

export * from "./schema";
// export * from "drizzle-orm"; if you need to export types or functions from drizzle-orm

const DB_FILE_NAME = process.env["DB_FILE_NAME"];
if (!DB_FILE_NAME)
  throw new Error("DB_FILE_NAME environment variable is not set.");

const client = createClient({ url: `file:${DB_FILE_NAME}` });

export const db = drizzle(client, {
  schema,
});
