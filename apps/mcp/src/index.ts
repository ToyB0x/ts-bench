import { execSync } from "node:child_process";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import packageJson from "../package.json";
import { packDir } from "./libs";
import { prismaTypescriptOptimizationPrompt } from "./prompts";

// Create an MCP server
const server = new McpServer({
  name: packageJson.name,
  version: packageJson.version,
});

/**
 * Extracts type signatures for ts and tsx files in a specified directory and provides a very useful summary for analysis.
 */
server.registerTool(
  "extract-type-signatures",
  {
    title: "Extract TypeScript Type Signatures",
    description:
      "Extracts type signatures for ts and tsx files in a specified directory and provides a very useful summary for analysis",
    inputSchema: {
      dir: z
        .string()
        .describe("Directory path to analyze for TypeScript files"),
    },
  },
  async ({ dir }) => ({
    content: [{ type: "text", text: await packDir(dir) }],
  }),
);

/**
 * Show project npm packages dependency graph.
 */
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
        content: [{ type: "text", text: `Error executing command: ${error}` }],
      };
    }
  },
);

server.registerPrompt(
  "prisma-typescript-optimization",
  {
    title: "Prisma TypeScript Performance Optimization",
    description:
      "Detect and fix TypeScript performance issues in Prisma projects through an enhanced 6-step process",
  },
  () => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: prismaTypescriptOptimizationPrompt,
        },
      },
    ],
  }),
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
