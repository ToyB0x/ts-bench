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

server.registerPrompt(
  "prisma-typescript-optimization",
  {
    title: "Prisma TypeScript Performance Optimization",
    description:
      "Detect and fix TypeScript performance issues in Prisma projects through a 4-step process",
    argsSchema: { projectPath: z.string().optional() },
  },
  ({ projectPath = "." }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `I will help you optimize TypeScript performance in a Prisma project through a systematic 4-step process:

OVERVIEW:
1. Detect problematic PrismaClient type usage patterns in your codebase
2. Benchmark current TypeScript compilation performance
3. Present proposed fixes and get your approval
4. Apply optimizations and measure improvements

This process will replace direct PrismaClient type references with typeof patterns to reduce TypeScript's type instantiation overhead. Before we begin, do you want to proceed with this optimization process?

Wait for user confirmation before proceeding to STEP 1.

STEP 1: Detect problematic code patterns
- Search for files containing "PrismaClient" type references in function signatures (ignore node_modules and .git directories)
- Look for patterns like: \`(prismaClient: PrismaClient)\` or similar direct type references
- Identify files that might benefit from \`typeof\` optimization
- Present findings to user with file paths and line numbers

STEP 2: Benchmark current performance
- For monorepos: First detect all packages by finding package.json files, then ask user which packages to analyze if there are many
- Check each selected package directory for tsconfig.json and run \`tsc --noEmit --extendedDiagnostics\` in directories that have it
- For single repos: Run \`tsc --noEmit --extendedDiagnostics\` in the project directory: ${projectPath}
- Skip directories without tsconfig.json (this is fine for packages that don't use TypeScript)
- Process packages sequentially, one at a time
- Extract and present key metrics: type count, instantiations, and compilation time
- Show these baseline numbers to user

STEP 3: Confirm changes (IMPORTANT: ASK FOR USER APPROVAL)
- Present the proposed changes clearly showing before/after code
- Ask user for explicit approval before making any modifications
- Only proceed if user confirms

STEP 4: Apply fixes and re-benchmark
- Replace patterns like \`(prismaClient: PrismaClient)\` with \`(prismaClient: typeof client)\`
- Run \`tsc --noEmit --extendedDiagnostics\` again in the same directories as STEP 2
- Process packages sequentially, one at a time (same as STEP 2)
- Skip directories without tsconfig.json (same as STEP 2)
- Calculate and present improvement percentages (type count, instantiations, compilation time)

Common problematic patterns to fix:
1. \`async (prismaClient: PrismaClient) => {}\` → \`async (prismaClient: typeof client) => {}\`
2. \`function saveFn(db: PrismaClient)\` → \`function saveFn(db: typeof client)\`
3. Direct PrismaClient imports used as parameter types

IMPORTANT: Prisma Client Initialization Best Practices
When implementing these optimizations, ensure that:
- The target package has a common Prisma client initialization pattern (usually in a shared db.ts or client.ts file)
- The client instance is exported so that \`typeof client\` can be used throughout the codebase
- Avoid multiple Prisma client instantiations which can cause performance issues and connection pool problems
- If a shared client doesn't exist, recommend creating one before applying typeof optimizations
- Example good pattern:
  \`\`\`typescript
  // db/client.ts
  import { PrismaClient } from '@prisma/client'
  export const client = new PrismaClient()
  
  // other files
  import { client } from './db/client'
  async function myFunction(db: typeof client) { ... }
  \`\`\`

Start with STEP 1 by searching for problematic patterns in the codebase.`,
        },
      },
    ],
  }),
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
