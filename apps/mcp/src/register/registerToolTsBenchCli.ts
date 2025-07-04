import { execSync } from "node:child_process";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const registerToolTsBenchCli = (server: McpServer) => {
  server.registerTool(
    "analyze-monorepo-typescript-performance-with-ts-bench-cli",
    {
      title: "Analyze Monorepo TypeScript Performance with ts-bench-cli",
      description:
        "A tool to analyze TypeScript performance in a monorepo using ts-bench-cli. (If you don't need to analyze whole monorepo, you can use the `npx tsc --diagnostics` instead.)",
    },
    async () => {
      try {
        const command = "npx @ts-bench/cli analyze";
        const result = execSync(command);
        return {
          content: [{ type: "text", text: result.toString() }],
        };
      } catch (error) {
        return {
          content: [
            { type: "text", text: `Error executing command: ${error}` },
          ],
        };
      }
    },
  );
};
