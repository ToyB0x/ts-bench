import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { typescriptOptimizationPromptBasic } from "./texts";

export const typescriptOptimizationBasic = (server: McpServer) => {
  server.registerPrompt(
    "typescript-optimization-basic",
    {
      title:
        "⚡️ TypeScript Performance Optimization (Basic mode | Recommended ⚡️)",
      description: "⚡️ Detect and fix TypeScript performance issues. ⚡️",
    },
    () => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: typescriptOptimizationPromptBasic,
          },
        },
      ],
    }),
  );
};
