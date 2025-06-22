import { Command, Option } from "@commander-js/extra-typings";
import { migrateDb } from "@ts-bench/db";

export const makeDbCommand = () => {
  const db = new Command("db");
  db.description("db related commands.");

  db.command("migrate", { isDefault: true })
    .description("run migrate")
    .addOption(new Option("--force", "force migration").default(false))
    .action(async (options) => migrateDb(options.force));

  return db;
};
