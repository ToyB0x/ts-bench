import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { packDir } from "../../libs";

export const MCP_TOOL_NAME__EXTRACT_TYPE_SIGNATURES = "extract-type-signatures";
/**
 * Extracts type signatures for ts and tsx files in a specified directory and provides a very useful summary for analysis.
 */
export const extractTypeSignatures = (server: McpServer) => {
  server.registerTool(
    MCP_TOOL_NAME__EXTRACT_TYPE_SIGNATURES,
    {
      title: "Extract TypeScript Type Signatures",
      description: `Extracts type signatures for ts and tsx files in a specified directory and provides a very useful summary for analysis.
IMPORTANT: This tool's results contain a large amount of text. It's recommended to specify a single package path in the monorepo.
`,
      inputSchema: {
        dir: z
          .string()
          .describe(
            "Directory path to analyze for TypeScript files. (Strongly recommended to use a single package path in monorepo)",
          ),
      },
    },
    async ({ dir }) => ({
      content: [{ type: "text", text: await packDir(dir) }],
    }),
  );
};
