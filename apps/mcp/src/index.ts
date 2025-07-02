import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import packageJson from "../package.json";

// Create an MCP server
const server = new McpServer({
  name: packageJson.name,
  version: packageJson.version,
});

// Add an addition tool
server.registerTool(
  "add",
  {
    title: "Addition Tool",
    description: "Add two numbers",
    inputSchema: { a: z.number(), b: z.number() },
  },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }],
  }),
);

/**
 * Sample resource that provides application information.
 */
// Static resource
server.registerResource(
  "mcp-app-info",
  "config://app-info",
  {
    title: "Application Information",
    description: "Application information data like name, version, etc.",
    mimeType: "text/plain",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        text: `Application Name: ${packageJson.name}\nVersion: ${packageJson.version}`,
      },
    ],
  }),
);

/**
 * List files with a given pattern.
 */
// server.registerResource(
//   "list-files",
//   new ResourceTemplate("list-file://{pattern}", { list: undefined }),
//   {
//     title: "Grep Files",
//     description: "Grep files with a given pattern",
//   },
//   async (uri, { pattern }) => ({
//     contents: [
//       {
//         uri: uri.href,
//         text: `Hello, ${pattern}!`,
//       },
//     ],
//   }),
// );

server.registerPrompt(
  "grep-by-ai",
  {
    title: "Grep Files by AI",
    description: "Grep files with a given pattern using AI(You)",
    argsSchema: { pattern: z.string() },
  },
  ({ pattern }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Find files that contain below string under current dir:\n\n${pattern}`,
        },
      },
    ],
  }),
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
