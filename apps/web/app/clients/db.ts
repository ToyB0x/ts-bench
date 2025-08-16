import type { DrizzleConfig } from "@ts-bench/db/browser";
import { resultTbl, scanTbl } from "@ts-bench/db/browser";
import { drizzle } from "drizzle-orm/sql-js";
import initSqlJs from "sql.js";

let dbInstance: ReturnType<typeof drizzle> | null = null;
let initPromise: Promise<ReturnType<typeof drizzle>> | null = null;

/**
 * WASMベースのDrizzle ORMクライアントを初期化
 * Git Dashパターンを参考に、sql.jsとDrizzleを統合
 */
export const getDb = async () => {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = initializeDb();
  return initPromise;
};

const initializeDb = async () => {
  // sql.js WASMの初期化（CDN経由）
  const SQL = await initSqlJs({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/${file}`,
  });

  // データベースファイルの取得
  const response = await fetch("/report.db");
  if (!response.ok) {
    throw new Error(`Failed to fetch database: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  const data = new Uint8Array(buffer);
  const sqldb = new SQL.Database(data);

  // Drizzle ORMクライアントの作成（スキーマ付き）
  const schema = { scanTbl, resultTbl };
  const config: DrizzleConfig<typeof schema> = {
    schema,
    logger: true, // 開発時のデバッグ用
  };

  dbInstance = drizzle(sqldb, config);
  return dbInstance;
};
