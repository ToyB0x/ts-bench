import { execSync } from "node:child_process";
import * as fs from "node:fs/promises";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const registerToolTsBenchCli = (server: McpServer) => {
  server.registerTool(
    "analyze-monorepo-typescript-performance",
    {
      title: "Analyze Monorepo TypeScript Performance",
      description:
        "A tool to analyze TypeScript performance in a monorepo using ts-bench-cli. (If you don't need to analyze whole monorepo, you can use the `npx tsc --diagnostics` instead.)",
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
