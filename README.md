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
- Implement a feature to check the size of the debug files (trace, types, analysis) in the repository
- Implement a feature to analyze the monorepo dependencies topology
- Implement a feature to prepare scripts
  - Provide a way to run prepare scripts (pre-install, pre-build types, etc.)
- Implement features to rapid scan
  - limit the packages (this is useful for large monorepos, but difficult to analyze if type dependent package build is needed, also but, turborepo can help build cache)
    - specify the paths to scan directory
    - specify the package names to scan
- Implement features to bulk scan
  - specify the time range for the scan (e.g., last 24 hours, last week, last month, last half year, last year)
  - specify the number of commits to scan (recent 10, 100, etc.)
  - specify the commits hashes (commit-a, commit-b, commit-c)
  - specify the skip span (e.g., skip each odd commit, skip each even commit, skip every 10th commit, scan only 1st each day, scan only 1st commit each week etc.)
- Check Hotspot checking functionality
