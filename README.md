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
- Add Human readable / and "Actionable" report (including hotspots summary)
  - Provide a way to generate a report that is easy to understand and actionable
  - Provide a way to generate a report that can be used for code review
  - Provide report for LLM First 
- Add Graph / Split Graph recent 10, recent 1year
- Add MCP to find .ts / .ts file that import specific package (find positive reason for split export / import)
- Add MCP to find .ts / .ts file that does not generate .d.ts file (find positive reason for not generating .d.ts file and import them)
- Use intelligent code analysis to run analyze command for specific files that affected by the changes
  - https://turborepo.com/docs/reference/run#--dry----dry-run
  - https://turborepo.com/docs/reference/query
  - eg: add option for monorepo typecheck command that user already use (typecheck, check-types, tsc, tsc-check, etc...)
- Add E2E tests
- Consider using `--extendedDiagnostics` option for TSC command to get more detailed information about the type checking process
- Add github action to deploy site
- refactor database table models (decrease size, remove unused fields, etc.)
- Add ability to show report web site without self-hosting (mostly large monorepos are belonging to companies with private repo, so it is a little bit difficult to self-host the report site with github-pages and so on)
- Add dark mode support
