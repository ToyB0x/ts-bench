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
    scanId: integer("scan_id")
      .notNull()
      .references(() => scanTbl.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),

    /* trace */
    traceMs: numeric("trace_ms").notNull(),
    traceNumType: integer("trace_num_type").notNull(),
    traceNumTrace: integer("trace_num_trace").notNull(),
    traceFileSizeType: integer("trace_file_size_type").notNull(),
    traceFileSizeTrace: integer("trace_file_size_trace").notNull(),

    /* analyze */
    analyzeHotSpot: integer("num_hot_spot").notNull(),
    analyzeHotSpotMs: numeric("duration_ms_hot_spot").notNull(),
    analyzeFileSize: integer("analyze_file_size").notNull(),

    /* diagnostics */
    // 'Files:                         618',
    files: integer("files").notNull(),
    // 'Lines of Library:            41836',
    linesOfLibrary: integer("lines_of_library").notNull(),
    // 'Lines of Definitions:       127137',
    linesOfDefinitions: integer("lines_of_definitions").notNull(),
    // 'Lines of TypeScript:          1068',
    linesOfTypeScript: integer("lines_of_typescript").notNull(),
    // 'Lines of JavaScript:             0',
    linesOfJavaScript: integer("lines_of_javascript").notNull(),
    // 'Lines of JSON:                  44',
    linesOfJSON: integer("lines_of_json").notNull(),
    // 'Lines of Other:                  0',
    linesOfOther: integer("lines_of_other").notNull(),
    // 'Identifiers:                186597',
    identifiers: integer("identifiers").notNull(),
    // 'Symbols:                    203309',
    symbols: integer("symbols").notNull(),
    // 'Types:                       71049',
    types: integer("types").notNull(),
    // 'Instantiations:             926111',
    instantiations: integer("instantiations").notNull(),
    // 'Memory used:               285146K',
    memoryUsed: integer("memory_used").notNull(),
    // 'Assignability cache size:    15536',
    assignabilityCacheSize: integer("assignability_cache_size").notNull(),
    // 'Identity cache size:           181',
    identityCacheSize: integer("identity_cache_size").notNull(),
    // 'Subtype cache size:            139',
    subtypeCacheSize: integer("subtype_cache_size").notNull(),
    // 'Strict subtype cache size:      35',
    strictSubtypeCacheSize: integer("strict_subtype_cache_size").notNull(),
    // 'Tracing time:                0.03s',
    tracingTime: numeric("tracing_time").notNull(),
    // 'I/O Read time:               0.04s',
    ioReadTime: numeric("io_read_time").notNull(),
    // 'Parse time:                  0.28s',
    parseTime: numeric("parse_time").notNull(),
    // 'ResolveModule time:          0.10s',
    resolveModuleTime: numeric("resolve_module_time").notNull(),
    // 'ResolveTypeReference time:   0.00s',
    resolveTypeReferenceTime: numeric("resolve_type_reference_time").notNull(),
    // 'ResolveLibrary time:         0.01s',
    resolveLibraryTime: numeric("resolve_library_time").notNull(),
    // 'Program time:                0.51s',
    programTime: numeric("program_time").notNull(),
    // 'Bind time:                   0.21s',
    bindTime: numeric("bind_time").notNull(),
    // 'Check time:                  0.69s',
    checkTime: numeric("check_time").notNull(),
    // 'printTime time:              0.00s',
    printTime: numeric("print_time").notNull(),
    // 'Emit time:                   0.00s',
    emitTime: numeric("emit_time").notNull(),
    // 'Dump types time:             0.99s',
    dumpTypesTime: numeric("dump_types_time").notNull(),
    // 'Total time:                  1.41s',
    totalTime: numeric("total_time").notNull(),

    /* error */
    error: text("error"),
  },
  (tbl) => [
    uniqueIndex("uq_result_scanId_package").on(tbl.scanId, tbl.package),
  ],
);
