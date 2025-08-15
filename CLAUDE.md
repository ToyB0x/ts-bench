# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TS Bench is an AI-powered TypeScript performance monitoring and optimization platform consisting of:
- **CLI tool** (`@ts-bench/cli`): Analyzes TypeScript compilation performance
- **Web app** (`@ts-bench/web`): Visualizes performance metrics with graphs and AI insights
- **MCP tool** (`@ts-bench/mcp`): Model Context Protocol integration for Claude
- **Database** (`@ts-bench/db`): Shared SQLite database layer using Drizzle ORM

## Common Commands

### Development
```bash
# Run development servers (uses turbo)
pnpm dev

# Run specific app in dev mode
pnpm --filter cli dev
pnpm --filter web dev
pnpm --filter mcp dev
```

### Build & Test
```bash
# Build all packages
pnpm build

# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter cli test
pnpm --filter utils test

# Type checking
pnpm typecheck

# Linting (uses Biome)
pnpm lint
pnpm lint:fix

# Complete check (lint + typecheck + build + test)
pnpm check
```

### Database
```bash
# Generate Drizzle schema
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed
```

### Web App Specific
```bash
# Prerender static site
pnpm build

# Start static server
pnpm --filter web start
```

### CLI Tool Usage
```bash
# Run CLI locally
pnpm --filter cli execute
pnpm --filter cli analyze

# Test via npx
npx @ts-bench/cli
```

## Architecture

### Monorepo Structure
- Uses **pnpm workspaces** with Turbo for task orchestration
- **Node 24.6.0** and **pnpm 10.14.0** (managed via Volta)
- TypeScript 5.9.2 with strict configuration

### Key Dependencies
- **Turbo**: Build system with caching and task dependencies
- **Biome**: Linting and formatting (replaces ESLint/Prettier)
- **Drizzle ORM**: Database abstraction with SQLite/LibSQL
- **React Router v7**: SPA mode for web app
- **Vitest**: Testing framework
- **tsup**: Build tool for library packages

### Database Architecture
- SQLite database with Drizzle ORM
- Schema defined in `packages/db/src/schema/`
- Migrations in `packages/db/drizzle/`
- Supports both local SQLite and remote LibSQL connections
- Environment variable `DB_FILE_NAME` controls database location

### Web App Architecture
- React Router v7 in SPA mode (SSR disabled)
- Tailwind CSS for styling with shadcn/ui components
- Recharts for data visualization
- Can work with WASM SQLite for browser-based database access

### CLI Architecture
- Commander.js for CLI commands
- Analyzes TypeScript performance using `@typescript/analyze-trace`
- Saves results to SQLite database
- Supports AI-powered insights via Google Gemini API

### MCP Integration
- Provides tools for TypeScript performance analysis
- Includes prompts for optimization suggestions
- Integrates with Claude for AI-assisted development

## Testing

Tests use Vitest and are located alongside source files as `*.test.ts`. Run tests with:
```bash
pnpm test                    # All tests
pnpm --filter cli test      # CLI tests only
pnpm --filter utils test    # Utils tests only
```

## Important Notes

- Database operations are not cached in Turbo due to state changes
- Use `pnpm check` on task check-point and before committing to ensure code quality
