import { execSync } from "node:child_process";
import * as fs from "node:fs/promises";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { MCP_TOOL_NAME__SHOW_TSC_DIAGNOSTICS } from "./showTscDiagnostics";

export const MCP_TOOL_NAME__ANALYZE_MONOREPO_TYPESCRIPT_PERFORMANCE =
  "analyze-monorepo-typescript-performance";

export const tsBenchCli = (server: McpServer) => {
  server.registerTool(
    MCP_TOOL_NAME__ANALYZE_MONOREPO_TYPESCRIPT_PERFORMANCE,
    {
      title: "Analyze Monorepo TypeScript Performance",
      description: `A tool to analyze TypeScript performance in a monorepo using ts-bench-cli. (If you don't need to analyze the whole monorepo, and want to analyze a single package, you should use MCP tool ${MCP_TOOL_NAME__SHOW_TSC_DIAGNOSTICS} instead.)`,
    },
    async () => {
      const tempDb = "ts-bench-temp.sqlite";
      const reportFile = "ts-bench-report.md";

      try {
        const command = `DB_FILE_NAME=${tempDb} npx @ts-bench/cli analyze`;
        execSync(command);

        // Read the generated report
        const reportContent = await fs.readFile(reportFile, "utf-8");

        return {
          content: [{ type: "text", text: reportContent }],
        };
      } catch (error) {
        return {
          content: [
            { type: "text", text: `Error executing command: ${error}` },
          ],
        };
      } finally {
        // Clean up the report file and temp database
        await fs.rm(reportFile, { force: true });
        await fs.rm(tempDb, { force: true });
      }
    },
  );
};
