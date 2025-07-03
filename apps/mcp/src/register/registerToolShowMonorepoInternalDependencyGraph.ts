import { execSync } from "node:child_process";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * Extracts type signatures for ts and tsx files in a specified directory and provides a very useful summary for analysis.
 */
export const registerToolShowMonorepoInternalDependencyGraph = (
  server: McpServer,
) => {
  server.registerTool(
    "show-monorepo-internal-dependency-graph",
    {
      title: "Show Monorepo Internal Dependency Graph",
      description:
        "Show monorepo project internal packages dependency graph (useful for analyzing TypeScript type definitions dependencies)",
      inputSchema: {
        monorepoPackageManager: z
          .enum(["npm", "yarn", "pnpm"])
          .describe("package manager used in the monorepo (npm, yarn, pnpm)"),
      },
    },
    async ({ monorepoPackageManager }) => {
      try {
        if (monorepoPackageManager !== "pnpm") {
          return {
            content: [
              {
                type: "text",
                text: "Sorry, This tool currently only supports pnpm. If you are AI, please analyze internal package dependency graph by yourself.",
              },
            ],
          };
        }

        const command = "pnpm list --only-projects --recursive";
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
