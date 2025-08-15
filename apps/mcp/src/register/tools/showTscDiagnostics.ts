import { execSync } from "node:child_process";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export const MCP_TOOL_NAME__SHOW_TSC_DIAGNOSTICS = "show-tsc-diagnostics";

const MAX_OLD_SPACE_SIZE = 16384; // 16GB, adjust as needed (bigger and bad ts files, more memory needed)

export const showTscDiagnostics = (server: McpServer) => {
  server.registerTool(
    MCP_TOOL_NAME__SHOW_TSC_DIAGNOSTICS,
    {
      title: "Show TypeScript Compiler Diagnostics",
      description:
        "Show TypeScript compiler diagnostics for a single package. This tool runs `tsc --noEmit --diagnostics --incremental` to analyze TypeScript performance and issues.",
      inputSchema: {
        targetDir: z
          .string()
          .default(".")
          .describe(
            "Target directory to run TypeScript diagnostics in. Defaults to the current directory. (specify the package directory if you want to analyze a specific package in a monorepo)",
          ),
      },
    },
    async ({ targetDir }) => {
      try {
        const command = `NODE_OPTIONS=--max-old-space-size=${MAX_OLD_SPACE_SIZE} npx tsc --noEmit --diagnostics --incremental false`;
        const result = execSync(command, {
          cwd: targetDir,
        });
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
