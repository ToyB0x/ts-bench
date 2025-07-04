import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { typescriptOptimizationPrompt } from "./texts";

export const typescriptOptimization = (server: McpServer) => {
  server.registerPrompt(
    "typescript-optimization",
    {
      title: "TypeScript Performance Optimization",
      description: "Detect and fix TypeScript performance issues in projects",
    },
    () => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: typescriptOptimizationPrompt,
          },
        },
      ],
    }),
  );
};
