import { unlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "./schema";
import "dotenv/config"; // If you need variable expansion in .env files, use @dotenvx/dotenvx/config

export * from "./schema"; // if you need to export types or functions: export * from "drizzle-orm";

const DEFAULT_DB_FILE_NAME = "ts-bench.sqlite";
const DB_FILE_NAME_ENV = process.env["DB_FILE_NAME"]; // Use the environment variable or .env file via dotenv
const DB_FILE_NAME = DB_FILE_NAME_ENV || DEFAULT_DB_FILE_NAME;

export const db = drizzle(createClient({ url: `file:${DB_FILE_NAME}` }), {
  schema,
});

export const migrateDb = async (force = false) => {
  console.info("Running migrations...", force ? " (force mode)" : "");
  const __dirname = dirname(new URL(import.meta.url).pathname);

  try {
    await migrate(db, { migrationsFolder: resolve(__dirname, "../drizzle") });
    console.info("Migrations completed successfully.");
  } catch (e) {
    console.error(e);

    if (force) {
      console.warn("Forcing migration reset...");
      await unlink(DB_FILE_NAME).catch(() => {
        console.error(`Failed to delete the database file: ${DB_FILE_NAME}`);
      });

      console.info("Database file deleted. Re-running migrations...");
      await migrateDb(false); // Re-run migrations without force
    }
  }
};
