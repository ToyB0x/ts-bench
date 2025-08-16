// Browser-compatible schema definitions
// Duplicated from @ts-bench/db to avoid importing Node.js-specific code

import { sql } from "drizzle-orm";
import {
  integer,
  numeric,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const scanTbl = sqliteTable(
  "scan",
  {
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    version: text("version").notNull(),
    owner: text("owner").notNull(),
    repository: text("repository").notNull(),
    changed: integer("changed"),
    files: integer("files"),
    insertions: integer("insertions"),
    deletions: integer("deletions"),
    commitHash: text("commit_hash").notNull(),
    commitMessage: text("commit_message").notNull(),
    commitDate: integer("commit_data", { mode: "timestamp_ms" }).notNull(),
    scannedAt: integer("scanned_at", { mode: "timestamp_ms" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    cpus: text("cpus").notNull(),
    aiCommentImpact: text("ai_comment_impact"),
    aiCommentReason: text("ai_comment_reason"),
    aiCommentSuggestion: text("ai_comment_suggestion"),
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
    isCached: integer("is_cached", { mode: "boolean" }).notNull(),
    scanId: integer("scan_id")
      .notNull()
      .references(() => scanTbl.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    error: text("error"),

    /* trace */
    traceNumType: integer("trace_num_type"),
    traceNumTrace: integer("trace_num_trace"),
    traceFileSizeType: integer("trace_file_size_type"),
    traceFileSizeTrace: integer("trace_file_size_trace"),

    /* analyze */
    analyzeHotSpot: integer("num_hot_spot"),
    analyzeHotSpotMs: numeric("duration_ms_hot_spot", {
      mode: "number",
    }),
    analyzeFileSize: integer("analyze_file_size"),

    /* diagnostics */
    files: integer("files"),
    linesOfLibrary: integer("lines_of_library"),
    linesOfDefinitions: integer("lines_of_definitions"),
    linesOfTypeScript: integer("lines_of_typescript"),
    linesOfJavaScript: integer("lines_of_javascript"),
    linesOfJSON: integer("lines_of_json"),
    linesOfOther: integer("lines_of_other"),
    identifiers: integer("identifiers"),
    symbols: integer("symbols"),
    types: integer("types"),
    instantiations: integer("instantiations"),
    memoryUsed: integer("memory_used"),
    assignabilityCacheSize: integer("assignability_cache_size"),
    identityCacheSize: integer("identity_cache_size"),
    subtypeCacheSize: integer("subtype_cache_size"),
    strictSubtypeCacheSize: integer("strict_subtype_cache_size"),
    tracingTime: numeric("tracing_time", { mode: "number" }),
    ioReadTime: numeric("io_read_time", { mode: "number" }),
    parseTime: numeric("parse_time", { mode: "number" }),
    resolveModuleTime: numeric("resolve_module_time", { mode: "number" }),
    resolveTypeReferenceTime: numeric("resolve_type_reference_time", {
      mode: "number",
    }),
    resolveLibraryTime: numeric("resolve_library_time", { mode: "number" }),
    programTime: numeric("program_time", { mode: "number" }),
    bindTime: numeric("bind_time", { mode: "number" }),
    checkTime: numeric("check_time", { mode: "number" }),
    printTimeTime: numeric("print_time_time", { mode: "number" }),
    emitTime: numeric("emit_time", { mode: "number" }),
    dumpTypesTime: numeric("dump_types_time", { mode: "number" }),
    totalTime: numeric("total_time", { mode: "number" }),
  },
  (tbl) => [
    uniqueIndex("uq_result_scan_id_package").on(tbl.scanId, tbl.package),
  ],
);
