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

# TODO: high priority
- Implement features to rapid scan
  - use the monorepo dependencies topology (speed up analyze)
  - Use intelligent code analysis to run analyze command for specific files that affected by the changes
    - https://turborepo.com/docs/reference/run#--dry----dry-run
    - https://turborepo.com/docs/reference/query
    - eg: add option for monorepo typecheck command that user already use (typecheck, check-types, tsc, tsc-check, etc...)
  - limit the packages (this is useful for large monorepos, but difficult to analyze if type dependent package build is needed, also but, turborepo can help build cache)
    - specify the paths to scan directory
    - specify the package names to scan
- Add Human(or AI) readable / and "Actionable" report (including hotspots summary)
  - Provide a way to generate a report that is easy to understand and actionable
  - Provide a way to generate a report that can be used for code review
  - Provide report for LLM First 
- Add MCP
  - Add MCP to find .ts / .ts file that import specific package (find positive reason for split export / import)
  - Add MCP to find .ts / .ts file that does not generate .d.ts file (find positive reason for not generating .d.ts file and import them)

# TODO: mid-priority
- Implement a feature to check the size of the debug files (trace, types, analysis) in the repository
- Implement features to bulk scan
  - specify the time range for the scan (e.g., last 24 hours, last week, last months)
  - specify the skip span (e.g., skip each odd commit, skip each even commit, skip every 10th commit, scan only 1st each day, scan only 1st commit each week etc.)

# TODO: low priority
- Add github action to deploy site
- refactor database table models (decrease size, remove unused fields, etc.)
- Add dark mode support
- Add E2E tests
- Add Graph / Split Graph recent 10, recent 1year (or drill down to specific range)
- Add ability to show report web site without self-hosting (mostly large monorepos are belonging to companies with private repo, so it is a little bit difficult to self-host the report site with github-pages and so on)
