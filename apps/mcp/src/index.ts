import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import packageJson from "../package.json";
import { packDir } from "./libs";

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
          text: `Optimize TypeScript performance in Prisma projects through systematic analysis and refactoring.

**TOOL**: Use \`extract-type-signatures\` to analyze TypeScript files for performance issues.

**SETUP**:
1. Confirm user to select language: 1.English or 2.日本語 (wait for user input)
2. Explain the whole optimization process in selected language
3. List available packages (search for package.json files) with selection numbers
4. User selects target directory/package for optimization (wait for user input)

**PROCESS**:

**STEP 1: Pattern Detection**
- Search for problematic PrismaClient patterns (exclude node_modules/.git):
  - Direct type usage: \`(prismaClient: PrismaClient)\`
  - Duplicate instantiations: multiple \`new PrismaClient()\`
  - Complex type relationships in function signatures
- Present findings with file paths and line numbers

**STEP 2: Baseline Measurement**
- Run \`tsc --noEmit --extendedDiagnostics\` in packages with tsconfig.json
- Extract metrics: type count, instantiations, compilation time
- Present baseline numbers for comparison

**STEP 3: Architecture Planning**
- Analyze current PrismaClient initialization patterns
- Plan shared client instance strategy OR factory function approach
- Design \`typeof\` reference replacements
- **IMPORTANT**: Select appropriate refactoring scope - avoid forcing all clients into single pattern
- Present architectural plan for user approval

**STEP 4: Change Preview**
- Show before/after code examples
- List specific files and number of changes
- **Require explicit user approval before proceeding**

**STEP 5: Implementation with Verification**
Apply changes incrementally with verification at each stage:

a) Create shared client instance and exports
   - Run \`tsc --noEmit --diagnostics\` → report improvements

b) Replace duplicate PrismaClient instantiations
   - Run \`tsc --noEmit --diagnostics\` → report cumulative improvements

c) Update type patterns: \`PrismaClient\` → \`typeof sharedClient\`
   - Run \`tsc --noEmit --diagnostics\` → report cumulative improvements

d) Final verification
   - Run \`tsc --noEmit --extendedDiagnostics\`
   - Calculate improvement percentages
   - Show progression: baseline → stage 1 → stage 2 → stage 3 → final

**STEP 6: Testing** (with user confirmation)
- Package-specific: \`pnpm --filter <package> test\` and \`build\`
- Repository-wide: \`pnpm test build typecheck lint\`
- Only proceed if all checks pass

**STEP 7: Pull Request**
- Confirm PR creation with user
- Create new branch and commit changes
- Include detailed description with benchmarks

**STEP 8: Next Steps**
- For monorepos: Ask to continue with remaining packages
- Optional: Generate improvement report for future MCP enhancements

**PATTERNS TO FIX** (selective approach - mixed patterns are acceptable):
1. \`(prismaClient: PrismaClient)\` → \`(prismaClient: typeof sharedClient)\`
2. \`new PrismaClient()\` duplicates → Shared instance
3. Dynamic initialization → Factory function + \`ReturnType<typeof createClient>\`
4. Complex types → Minimal interfaces: \`interface IPrismaMinimal { table: PrismaClient['table']; }\`

**IMPORTANT PERFORMANCE INSIGHT**: 
Simple \`const prisma = new PrismaClient()\` initialization has minimal TypeScript performance impact. The real performance bottlenecks occur when:
- PrismaClient types are used in function parameters: \`(prismaClient: PrismaClient) => {}\`
- Class constructors with PrismaClient typed parameters: \`constructor(private prisma: PrismaClient)\`
- Variables are passed to these typed parameters, triggering extensive type checking
- Large type compatibility checks happen during assignment/function calls

**FOCUS AREAS for optimization**:
- Function signatures with PrismaClient types where variables are actually passed
- Class constructors that receive PrismaClient instances as parameters
- Skip optimization for simple initialization without type usage
- Prioritize any location where PrismaClient instances are passed as arguments

**IMPORTANT**: Don't force all clients into a single pattern. Select improvements based on:
- Code clarity and maintainability
- Performance impact
- Risk of breaking changes

**CLIENT PATTERNS EXAMPLES**:
\`\`\`typescript
// ✅ Pattern 1: Static shared client
// Before
const prisma1 = new PrismaClient({ log: ['query'] })
const prisma2 = new PrismaClient({ log: ['query'] })

// After
export const client = new PrismaClient({ log: ['query'] })
function myFunction(db: typeof client) { ... }

// ✅ Pattern 2: Dynamic initialization with factory
// Before
const config = getConfig()
const prisma1 = new PrismaClient(config)
const prisma2 = new PrismaClient(config)

// After
const createPrismaClient = (config: Config) => new PrismaClient(config)
export type ClientType = ReturnType<typeof createPrismaClient>
function myFunction(db: ClientType) { ... }

// ✅ Pattern 3: Mixed approach (acceptable in same package)
export const staticClient = new PrismaClient({ log: ['query'] })
export const createDynamicClient = (env: string) => new PrismaClient({ datasources: { db: { url: getUrl(env) } } })
export type DynamicClientType = ReturnType<typeof createDynamicClient>

// ❌ BAD: Loses constructor arguments
export const client = new PrismaClient() // Lost configuration!
\`\`\`

Begin by searching for problematic patterns in the selected directory.`,
        },
      },
    ],
  }),
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
