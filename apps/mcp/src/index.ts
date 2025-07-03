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
          text: `I need you to optimize TypeScript performance in a Prisma project using this below process:
IMPORTANT TOOLS: 
- \`extract-type-signatures\`: Analyze TypeScript files for type signatures and performance issues (very useful for this process)

PREPARATION:
Immediately after starting, do the following before moving on to the rest of the process.
- Ask the user to select a language as below.
  1. English
  2. 日本語 (Japanese)

STEP 1: Notify user of process overview and confirm target directory
- Explain that this process requires 3-10 user confirmations
- Ask the user to select the target directory with below selection number message.
  [-Selection Number]: Select a specific package directory (AI must list packages found in the monorepo with search for package.json files and show them with selection number 2, 3, 4, etc.)
  (For monorepos, we recommend limiting the scope to a certain extent, such as apps and packages, as this will shorten the time to create a PR and make things easier.)

STEP 2: Detect problematic code patterns
- Search for files containing "PrismaClient" type references in function signatures (ignore node_modules and .git directories)
- Look for patterns like: \`(prismaClient: PrismaClient)\` or similar direct type references
- Identify files that might benefit from \`typeof\` optimization
- Check for duplicate PrismaClient instantiations across files
- Present findings to user with file paths and line numbers

STEP 3: Benchmark current performance
- For monorepos: First detect all packages by finding package.json files, then ask user which specific packages to analyze if there are many (>3)
- Prioritize packages with the most PrismaClient references found in STEP 2
- Check each selected package directory for tsconfig.json and run \`tsc --noEmit --extendedDiagnostics\` in directories that have it
- For single repos: Run \`tsc --noEmit --extendedDiagnostics\` in the specific directory
- Skip directories without tsconfig.json (this is fine for packages that don't use TypeScript)
- Process packages sequentially, one at a time
- Extract and present key metrics: type count, instantiations, and compilation time
- Show these baseline numbers to user

STEP 4: Plan shared client architecture
- Analyze current PrismaClient initialization patterns in the target package(s)
- Identify duplicate initialization code that should be consolidated
- Create a shared client instance file if not exists
- Plan the typeof reference strategy to avoid type errors
- Present the architectural plan to user for approval

STEP 5: Confirm changes (IMPORTANT: ASK FOR USER APPROVAL)
- Present the proposed changes clearly showing before/after code
- Include both the type changes AND the shared client consolidation
- Show specific file paths and estimated number of changes
- Ask user for explicit approval before making any modifications
- Only proceed if user confirms

STEP 6: Apply fixes and re-benchmark (WITH INCREMENTAL VERIFICATION)
- Create shared PrismaClient instance and type exports
- **INTERMEDIATE CHECK 1**: Run \`tsc --noEmit --diagnostics\` after creating shared client
  - Report initial improvement metrics to user
  - Present type count and compilation time changes from baseline
- Replace direct PrismaClient instantiations with shared instance usage
- **INTERMEDIATE CHECK 2**: Run \`tsc --noEmit --diagnostics\` after shared instance replacement
  - Report cumulative improvement metrics to user
  - Show progress: baseline → after shared client → after instance replacement
- Replace type patterns like \`(prismaClient: PrismaClient)\` with \`(prismaClient: typeof sharedClient)\`
- **INTERMEDIATE CHECK 3**: Run \`tsc --noEmit --diagnostics\` after type pattern replacement
  - Report cumulative improvement metrics to user
  - Show progress: baseline → shared client → instances → type patterns
- Update imports to use the shared types
- **FINAL VERIFICATION**: Run \`tsc --noEmit --extendedDiagnostics\` for complete analysis
- Process packages sequentially, one at a time (same as STEP 3)
- Skip directories without tsconfig.json (same as STEP 3)
- Calculate and present final improvement percentages (type count, instantiations, compilation time)
- Show improvement progression: baseline → checkpoint 1 → checkpoint 2 → checkpoint 3 → final
- Verify that TypeScript compilation still succeeds after changes
- Ask user for confirmation to run package-specific test and build commands (e.g., \`pnpm --filter <package> test\`, \`pnpm --filter <package> build\`)
- Execute package tests and builds only if user confirms

STEP 7: Repository-wide verification (IMPORTANT: ASK FOR USER CONFIRMATION)
- Ask user for confirmation to run repository-wide commands for final verification
- If confirmed, execute repository-wide commands: \`pnpm test\`, \`pnpm build\`, \`pnpm typecheck\`, \`pnpm lint\`
- Present any failures or issues found during repository-wide testing
- Only proceed to pull request creation if all repository-wide checks pass

STEP 8: Create a pull request
- Confirm with the user that createing a pull request is acceptable and make new branch before committing changes
- Generate a pull request with all changes made in STEP 6
- Include a detailed description of the changes, improvements, and benchmarks
- Provide links to the original and optimized code for easy review

STEP 9: Final confirmation
- Ask the user to review the pull request and confirm that everything looks good
- If Monorepo and if there are remain un-checked package directory, ask user to repeat STEP 2 to STEP 8 for the next package
  (Recommend save progress to the progress.md file in the root directory of the monorepo, and take user to have a coffee break before starting the next package with a fantastic emoji)

STEP 10: Improvement report generation (OPTIONAL)
- Ask the user if they would like to generate an improvement report for the MCP prompt implementation
- If confirmed, create a detailed report analyzing the optimization process results, including:
  - Performance improvements achieved (type count reduction, compilation time improvements)
  - Patterns that worked best for different scenarios
  - Challenges encountered and how they were resolved
  - Suggestions for improving the MCP prompt process flow
  - Recommendations for future TypeScript performance optimization workflows
- Generate this report as a structured document for the author to review and incorporate into future MCP implementations

**Problematic patterns to fix:**
1. \`async (prismaClient: PrismaClient) => {}\` → \`async (prismaClient: typeof sharedClient) => {}\`
2. \`function saveFn(db: PrismaClient)\` → \`function saveFn(db: typeof sharedClient)\`
3. \`constructor(prismaClient: PrismaClient)\` → \`constructor(prismaClient: typeof sharedClient)\`
4. Duplicate \`new PrismaClient()\` instantiations → Shared client pattern
5. Import consolidation: Replace multiple PrismaClient imports with shared type imports
6. Complex type relationships → Interface minimization pattern: \`interface IPrismaMinimal { table1: PrismaClient['table1']; }\`
7. Recursive type expansion → Scoped interface definitions that limit type inference scope
8. Direct PrismaClient type usage in generics → \`typeof\` references to avoid recursive type resolution

**Implementation Requirements:**
- Create a shared client instance before replacing type references
- Use \`typeof sharedClient\` pattern to maintain type safety
- Consolidate duplicate PrismaClient configurations into shared utility
- Update all imports to use shared types to avoid circular dependencies
- **CRITICAL**: Run \`tsc --noEmit --diagnostics\` after EACH major change to verify incremental improvements
- Report performance metrics to user at each checkpoint to avoid rework
- Show progressive improvement: baseline → shared client → instance replacement → type patterns → final
- Test TypeScript compilation after each major change

**Example shared client pattern:**
\`\`\`typescript
// db/client.ts
import { PrismaClient } from '@prisma/client'
export const client = new PrismaClient()

// other files
import { client } from './db/client'
async function myFunction(db: typeof client) { ... }
\`\`\`

**Example interface minimization pattern:**
\`\`\`typescript
// For complex cases, create minimal interfaces to limit type scope
interface IPrismaMinimal {
  user: PrismaClient['user'];
  post: PrismaClient['post'];
}

function processData<T extends IPrismaMinimal>(prisma: T) {
  // Only exposes needed tables, avoiding full PrismaClient type resolution
}
\`\`\`

Start with STEP 2 by searching for problematic patterns in the codebase.`,
        },
      },
    ],
  }),
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
