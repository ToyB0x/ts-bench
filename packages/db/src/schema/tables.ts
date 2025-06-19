import { sql } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const scanTbl = sqliteTable(
  "scan",
  {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    repository: text("repository").notNull(),
    commitHash: text("commit_hash").notNull(),
    commitMessage: text("commit_message").notNull(),
    commitDate: integer("commit_data", { mode: "timestamp_ms" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    cpus: text("cpus").notNull().default(""),
  },
  (tbl) => [
    uniqueIndex("uq_scan_repository_commit_hash").on(
      tbl.repository,
      tbl.commitHash,
    ),
  ],
);

export const resultTbl = sqliteTable(
  "result",
  {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    package: text("package").notNull(),
    isSuccess: integer("is_success", { mode: "boolean" }).notNull(),
    numTrace: integer("num_trace").notNull(),
    numType: integer("num_type").notNull(),
    numHotSpot: integer("num_hot_spot").notNull(),
    durationMs: integer("duration_ms").notNull(),
    durationMsHotSpot: integer("duration_ms_hot_spot").notNull(),
    error: text("error"),
    scanId: integer("scan_id")
      .notNull()
      .references(() => scanTbl.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
  },
  (tbl) => [
    uniqueIndex("uq_result_scanId_package").on(tbl.scanId, tbl.package),
  ],
);
