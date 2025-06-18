import { migrateDb } from "@ts-bench/db";
import { Command, Option } from "commander";

export const makeDbCommand = () => {
  const db = new Command("db");
  db.description("db related commands.");

  db.command("migrate", { isDefault: true })
    .description("run migrate")
    .addOption(new Option("--force", "force migration").default(false))
    .action(async (options) => migrateDb(options.force));

  return db;
};
