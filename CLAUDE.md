# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Test Commands
- `pnpm dev` - Start development servers
- `pnpm build` - Build all packages
- `pnpm build:prerender` - Build web app with prerendering
- `pnpm build:prerender:with-seed` - Build with database seeding
- `pnpm test` - Run all tests across packages
- `pnpm typecheck` - Type check all packages
- `pnpm lint` - Check code formatting and linting
- `pnpm lint:fix` - Fix code formatting and linting issues
- `pnpm db:generate` - Generate Drizzle client
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed database
- Single test: `pnpm --filter <package> test` (e.g., `pnpm --filter cli test`)
- Web dev: `pnpm --filter web dev` - Run web app in development mode

## Code Style Guidelines
- **Formatter**: Uses Biome with double quotes (`"`) and space indentation
- **Imports**: Use `import * as moduleName` for Node.js modules (e.g., `import * as fs from "node:fs"`)
- **Imports**: Named imports for libraries (e.g., `import { Command } from "commander"`)
- **Imports**: Organize imports automatically via Biome
- **Error Handling**: Use try-catch blocks with `console.error` and `process.exit(1)`
- **Functions**: Prefer arrow function syntax (`const func = () => {}`) over function declarations
- **Testing**: Uses Vitest with `describe`, `it`, `expect` patterns
- **Types**: Prefer TypeScript with strict typing (@tsconfig/strictest)
- **Naming**: Use camelCase for variables/functions, PascalCase for classes/types
- **Database**: Uses Drizzle ORM with SQLite
- **Monorepo**: Uses pnpm workspaces with Turbo for task orchestration
- **Node Version**: Requires Node.js >=24
- **Build Tool**: Uses tsup for CLI builds, standard TypeScript compilation
- **Comments**: Use `biome-ignore` comments for necessary linting exceptions

## Project Architecture
This is **TS Bench** - a TypeScript performance monitoring and repository analysis tool with:

- **CLI Tool** (`apps/cli`): Command-line interface for repository analysis
- **Web Dashboard** (`apps/web`): React Router v7 app for viewing analysis results  
- **Database Package** (`packages/db`): Drizzle ORM schema and utilities
- **Monorepo**: pnpm workspaces with Turbo orchestration

The tool analyzes TypeScript codebases, tracks performance metrics, and provides insights through both CLI and web interfaces. Database file location is configured via `DB_FILE_NAME` environment variable.
