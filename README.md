# TS Bench
A tool to monitor various metrics of your repository

# Motivation
- Feature to measure IDE comfort and type inference load using TSC command (There is a strong correlation between the TSC command and IDE IntelliSense functionality)

# Usage
```bash
npx @ts-bench/cli
```

# Roadmap
- Graph display of report results for monitoring
- Creation of MCP
  - Provide description of refactoring policies
  - Provide measurement tools

# TODO
- Add web interface with report display
- Implement hotspot checking functionality
- Implement feature to verify TypeScript compilation metrics changes (comparing with previous commits or comparing current commit with uncommitted state)
- Use pnpm link internally for local development
- Update prisma config to use queryCompiler or replace prisma to Drizzle ORM for better OS compatibility
