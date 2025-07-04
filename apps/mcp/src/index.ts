import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import packageJson from "../package.json";
import {
  extractTypeSignatures,
  prismaTypescriptOptimization,
  showMonorepoInternalDependencyGraph,
  showTscDeepAnalyzeAndHotSpot,
  showTscDiagnostics,
  tsBenchCli,
  typescriptOptimization,
} from "./register";

// Create an MCP server
const server = new McpServer({
  name: packageJson.name,
  version: packageJson.version,
});

// Register tools
tsBenchCli(server);
showTscDiagnostics(server);
showTscDeepAnalyzeAndHotSpot(server);
extractTypeSignatures(server);
showMonorepoInternalDependencyGraph(server);

// register prompts
typescriptOptimization(server);
prismaTypescriptOptimization(server);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
