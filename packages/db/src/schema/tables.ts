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
    /* base info */
    id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
    package: text("package").notNull(), // デバッグ頻度が高いため、単一テーブルのみでデバッグしやすいように非正規化しない
    isSuccess: integer("is_success", { mode: "boolean" }).notNull(),
    isCached: integer("is_cached", { mode: "boolean" }).notNull(),
    scanId: integer("scan_id")
      .notNull()
      .references(() => scanTbl.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

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
    // 'Files:                         618',
    files: integer("files"),
    // 'Lines of Library:            41836',
    linesOfLibrary: integer("lines_of_library"),
    // 'Lines of Definitions:       127137',
    linesOfDefinitions: integer("lines_of_definitions"),
    // 'Lines of TypeScript:          1068',
    linesOfTypeScript: integer("lines_of_typescript"),
    // 'Lines of JavaScript:             0',
    linesOfJavaScript: integer("lines_of_javascript"),
    // 'Lines of JSON:                  44',
    linesOfJSON: integer("lines_of_json"),
    // 'Lines of Other:                  0',
    linesOfOther: integer("lines_of_other"),
    // 'Identifiers:                186597',
    identifiers: integer("identifiers"),
    // 'Symbols:                    203309',
    symbols: integer("symbols"),
    // 'Types:                       71049',
    types: integer("types"),
    // 'Instantiations:             926111',
    instantiations: integer("instantiations"),
    // 'Memory used:               285146K',
    memoryUsed: integer("memory_used"),
    // 'Assignability cache size:    15536',
    assignabilityCacheSize: integer("assignability_cache_size"),
    // 'Identity cache size:           181',
    identityCacheSize: integer("identity_cache_size"),
    // 'Subtype cache size:            139',
    subtypeCacheSize: integer("subtype_cache_size"),
    // 'Strict subtype cache size:      35',
    strictSubtypeCacheSize: integer("strict_subtype_cache_size"),
    // 'Tracing time:                0.03s',
    tracingTime: numeric("tracing_time", { mode: "number" }),
    // 'I/O Read time:               0.04s',
    ioReadTime: numeric("io_read_time", { mode: "number" }),
    // 'Parse time:                  0.28s',
    parseTime: numeric("parse_time", { mode: "number" }),
    // 'ResolveModule time:          0.10s',
    resolveModuleTime: numeric("resolve_module_time", { mode: "number" }),
    // 'ResolveTypeReference time:   0.00s',
    resolveTypeReferenceTime: numeric("resolve_type_reference_time", {
      mode: "number",
    }),
    // 'ResolveLibrary time:         0.01s',
    resolveLibraryTime: numeric("resolve_library_time", { mode: "number" }),
    // 'Program time:                0.51s',
    programTime: numeric("program_time", { mode: "number" }),
    // 'Bind time:                   0.21s',
    bindTime: numeric("bind_time", { mode: "number" }),
    // 'Check time:                  0.69s',
    checkTime: numeric("check_time", { mode: "number" }),
    // 'printTime time:              0.00s',
    printTime: numeric("print_time", { mode: "number" }),
    // 'Emit time:                   0.00s',
    emitTime: numeric("emit_time", { mode: "number" }),
    // 'Dump types time:             0.99s',
    dumpTypesTime: numeric("dump_types_time", { mode: "number" }),
    // 'Total time:                  1.41s',
    totalTime: numeric("total_time", { mode: "number" }),

    /* error */
    error: text("error"),
  },
  (tbl) => [
    uniqueIndex("uq_result_scanId_package").on(tbl.scanId, tbl.package),
  ],
);
