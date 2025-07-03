import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { prismaTypescriptOptimizationPrompt } from "../prompts";

export const registerPromptPrismaTypescriptOptimization = (
  server: McpServer,
) => {
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
};
