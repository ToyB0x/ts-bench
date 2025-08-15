# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Test Commands
- `pnpm dev` - Start development servers (runs db:seed, build first via Turbo)
- `pnpm build` - Build all packages
- `pnpm build:prerender` - Build web app with prerendering (requires DB)
- `pnpm build:prerender:with-seed` - Build web app with database seeding
- `pnpm test` - Run all tests across packages  
- `pnpm typecheck` - Type check all packages
- `pnpm lint` - Check code formatting and linting (Biome)
- `pnpm lint:fix` - Fix code formatting and linting issues
- `pnpm db:generate` - Generate Drizzle ORM migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed database with test data
- **Single package test**: `pnpm --filter <package> test` (e.g., `pnpm --filter cli test`)
- **Single package typecheck**: `pnpm --filter <package> typecheck`
- **Web dev**: `pnpm --filter web dev` - Run web app in development mode

## Code Style Guidelines
- **Formatter**: Biome with double quotes (`"`) and space indentation (2 spaces)
- **Imports**: Use `import * as moduleName from "node:fs"` for Node.js built-ins
- **Imports**: Named imports for libraries (e.g., `import { Command } from "commander"`)
- **Imports**: Organize imports automatically via Biome
- **Error Handling**: Use try-catch blocks with `console.error` and `process.exit(1)`
- **Functions**: Prefer arrow function syntax (`const func = () => {}`)
- **Testing**: Vitest with `describe`, `it`, `expect` patterns
- **TypeScript**: Strict typing with `@tsconfig/strictest` base config
- **Naming**: camelCase for variables/functions, PascalCase for classes/types
- **Database**: Drizzle ORM with SQLite (Turso LibSQL client)
- **Monorepo**: pnpm workspaces with Turbo for build orchestration
- **Node Version**: Requires Node.js 24.6.0 (managed via Volta)
- **Build Tools**: tsup for CLI/MCP packages, React Router build for web
- **Linting exceptions**: Use `biome-ignore` comments when necessary

## Project Architecture
**TS Bench** - TypeScript performance monitoring and repository analysis tool

### Core Packages
- **`apps/cli`** (`@ts-bench/cli`): CLI for analyzing TypeScript repositories
  - Analyzes TypeScript compilation performance metrics
  - Generates performance reports with AI insights (Google Gemini)
  - Saves results to SQLite database
  - Entry: `src/index.ts` → Commands in `src/commands/`

- **`apps/web`** (`@ts-bench/web`): React Router v7 dashboard
  - Visualizes performance metrics with Recharts
  - Prerendered static site generation
  - Database-driven charts and reports
  - Routes in `app/routes/`

- **`apps/mcp`** (`@ts-bench/mcp`): Model Context Protocol server
  - Provides TypeScript analysis tools for AI agents
  - Extracts type signatures and dependency graphs
  - Runs TSC diagnostics and trace analysis

- **`packages/db`** (`@ts-bench/db`): Shared database layer
  - Drizzle ORM schema definitions
  - SQLite with Turso LibSQL client
  - Migration files in `drizzle/`
  - Schema in `src/schema/`

- **`packages/utils`**: Shared utilities (private package)

### Key Technical Details
- **Database**: SQLite file location via `DB_FILE_NAME` env variable
- **Turbo Pipeline**: Tasks have dependencies (e.g., `build:prerender` needs `db:migrate`)
- **TypeScript Analysis**: Uses `@typescript/analyze-trace` for performance profiling
- **AI Integration**: Google Gemini API for generating optimization suggestions
- **Testing**: Vitest for unit tests, test files as `*.test.ts`
