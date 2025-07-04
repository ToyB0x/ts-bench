import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { typescriptOptimizationPromptAdvanced } from "./texts";

export const typescriptOptimizationAdvanced = (server: McpServer) => {
  server.registerPrompt(
    "typescript-optimization-advanced",
    {
      title:
        "TypeScript Performance Optimization (Advanced mode | Not recommended currently)",
      description: "Detect and fix TypeScript performance issues in projects",
    },
    () => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: typescriptOptimizationPromptAdvanced,
          },
        },
      ],
    }),
  );
};
