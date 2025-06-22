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
    version: text("version").notNull(), // scanner version
    owner: text("owner").notNull(), // owner of the repo
    repository: text("repository").notNull(),
    /** The total number of files changed as reported in the summary line */
    changed: integer("changed"),
    /** When present in the diff, lists the details of each file changed */
    files: integer("files"),
    /** The number of files changed with insertions */
    insertions: integer("insertions"),
    /** The number of files changed with deletions */
    deletions: integer("deletions"),
    commitHash: text("commit_hash").notNull(),
    commitMessage: text("commit_message").notNull(),
    commitDate: integer("commit_data", { mode: "timestamp_ms" }).notNull(),
    scannedAt: integer("scanned_at", { mode: "timestamp_ms" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    cpus: text("cpus").notNull(),
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
