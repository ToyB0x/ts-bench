import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import packageJson from "../package.json";
import {
  registerPromptPrismaTypescriptOptimization,
  registerToolExtractTypeSignatures,
  registerToolShowMonorepoInternalDependencyGraph,
  registerToolShowTscDeepAnalyzeAndHotSpot,
  registerToolShowTscDiagnostics,
  registerToolTsBenchCli,
} from "./register";

// Create an MCP server
const server = new McpServer({
  name: packageJson.name,
  version: packageJson.version,
});

// Register tools
registerToolTsBenchCli(server);
registerToolShowTscDiagnostics(server);
registerToolShowTscDeepAnalyzeAndHotSpot(server);
registerToolExtractTypeSignatures(server);
registerToolShowMonorepoInternalDependencyGraph(server);

// register prompts
registerPromptPrismaTypescriptOptimization(server);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
