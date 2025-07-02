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
      "Detect and fix TypeScript performance issues in Prisma projects through an enhanced 5-step process",
    argsSchema: { projectPath: z.string().optional() },
  },
  ({ projectPath = "." }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `I need you to optimize TypeScript performance in a Prisma project using this enhanced 5-step process:

STEP 1: Notify to user below process overview, these process need 3 ~ 10times user confirmations and instructions and wait user confirm it.

STEP 2: Detect problematic code patterns
- Search for files containing "PrismaClient" type references in function signatures (ignore node_modules and .git directories)
- Look for patterns like: \`(prismaClient: PrismaClient)\` or similar direct type references
- Identify files that might benefit from \`typeof\` optimization
- **NEW: Also check for duplicate PrismaClient instantiations across files**
- Present findings to user with file paths and line numbers

STEP 3: Benchmark current performance
- For monorepos: First detect all packages by finding package.json files, then **ask user which specific packages to analyze** if there are many (>3)
- **NEW: Prioritize packages with the most PrismaClient references found in STEP 2**
- Check each selected package directory for tsconfig.json and run \`tsc --noEmit --extendedDiagnostics\` in directories that have it
- For single repos: Run \`tsc --noEmit --extendedDiagnostics\` in the project directory: ${projectPath}
- Skip directories without tsconfig.json (this is fine for packages that don't use TypeScript)
- Process packages sequentially, one at a time
- Extract and present key metrics: type count, instantiations, and compilation time
- Show these baseline numbers to user

STEP 4: Plan shared client architecture (NEW STEP)
- **Analyze current PrismaClient initialization patterns in the target package(s)**
- **Identify duplicate initialization code that should be consolidated**
- **Create a shared client instance file if not exists**
- **Plan the typeof reference strategy to avoid type errors**
- Present the architectural plan to user for approval

STEP 5: Confirm changes (IMPORTANT: ASK FOR USER APPROVAL)
- Present the proposed changes clearly showing before/after code
- **Include both the type changes AND the shared client consolidation**
- **Show specific file paths and estimated number of changes**
- Ask user for explicit approval before making any modifications
- Only proceed if user confirms

STEP 6: Apply fixes and re-benchmark 
- **First: Create shared PrismaClient instance and type exports**
- **Second: Replace direct PrismaClient instantiations with shared instance usage**
- **Third: Replace type patterns like \`(prismaClient: PrismaClient)\` with \`(prismaClient: typeof sharedClient)\`**
- **Ensure imports are updated to use the shared types**
- Run \`tsc --noEmit --extendedDiagnostics\` again in the same directories as STEP 3
- Process packages sequentially, one at a time (same as STEP 3)
- Skip directories without tsconfig.json (same as STEP 3)
- Calculate and present improvement percentages (type count, instantiations, compilation time)
- **Verify that TypeScript compilation still succeeds after changes**

**Enhanced problematic patterns to fix:**
1. \`async (prismaClient: PrismaClient) => {}\` → \`async (prismaClient: typeof sharedClient) => {}\`
2. \`function saveFn(db: PrismaClient)\` → \`function saveFn(db: typeof sharedClient)\`
3. \`constructor(prismaClient: PrismaClient)\` → \`constructor(prismaClient: typeof sharedClient)\`
4. **Duplicate \`new PrismaClient()\` instantiations → Shared client pattern**
5. **Import consolidation: Replace multiple PrismaClient imports with shared type imports**
6. Direct PrismaClient imports used as parameter types: \`async (prismaClient: PrismaClient) => {}\` → \`async (prismaClient: typeof sharedClient) => {}\`

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

**Critical Implementation Notes:**
- **ALWAYS create a shared client instance before replacing type references**
- **Use \`typeof sharedClient\` pattern to maintain type safety**
- **Consolidate duplicate PrismaClient configurations into shared utility**
- **Update all imports to use shared types to avoid circular dependencies**
- **Test TypeScript compilation after each major change**

Start with STEP 2 by searching for problematic patterns in the codebase.`,
        },
      },
    ],
  }),
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
