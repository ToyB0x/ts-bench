# CLAUDE.md - Development Guidelines

## Build/Test Commands
- `pnpm dev` - Start development servers
- `pnpm build` - Build all packages
- `pnpm test` - Run all tests across packages
- `pnpm typecheck` - Type check all packages
- `pnpm lint` - Check code formatting and linting
- `pnpm lint:fix` - Fix code formatting and linting issues
- `pnpm generate` - Generate Prisma client
- Single test: `pnpm --filter <package> test` (e.g., `pnpm --filter cli test`)
- Database: `pnpm --filter database db:migrate:dev` (dev migrations)
- Database: `pnpm --filter database db:seed` (seed data)

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
- **Database**: Uses Prisma ORM with SQLite
- **Monorepo**: Uses pnpm workspaces with Turbo for task orchestration
- **Node Version**: Requires Node.js >=24
- **Build Tool**: Uses tsup for CLI builds, standard TypeScript compilation
- **Comments**: Use `biome-ignore` comments for necessary linting exceptions
