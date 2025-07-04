import { execSync } from "node:child_process";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export const MCP_TOOL_NAME__SHOW_TSC_DIAGNOSTICS = "show-tsc-diagnostics";

export const registerToolShowTscDiagnostics = (server: McpServer) => {
  server.registerTool(
    MCP_TOOL_NAME__SHOW_TSC_DIAGNOSTICS,
    {
      title: "Show TypeScript Compiler Diagnostics",
      description:
        "Show TypeScript compiler diagnostics for a single package. This tool runs `tsc --noEmit --diagnostics` to analyze TypeScript performance and issues.",
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
        const command = "npx tsc --noEmit --diagnostics";
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
