# CLAUDE.md - Development Guidelines

## Build/Test Commands
- `pnpm dev` - Start development servers
- `pnpm build` - Build all packages
- `pnpm typecheck` - Type check all packages
- `pnpm lint` - Check code formatting and linting
- `pnpm lint:fix` - Fix code formatting and linting issues
- `pnpm generate` - Generate Prisma client
- Database: `pnpm --filter database db:migrate:dev` (dev migrations)
- Database: `pnpm --filter database db:seed` (seed data)

## Code Style Guidelines
- **Formatter**: Uses Biome with double quotes (`"`) and space indentation
- **Imports**: Use `import * as moduleName` for Node.js modules (e.g., `import * as process`)
- **Imports**: Organize imports automatically via Biome
- **Error Handling**: Use try-catch blocks with `console.error` and `process.exit(1)`
- **Types**: Prefer TypeScript with strict typing
- **Naming**: Use camelCase for variables/functions, PascalCase for classes/types
- **Database**: Uses Prisma ORM with SQLite
- **Monorepo**: Uses pnpm workspaces with Turbo for task orchestration
- **Node Version**: Requires Node.js >=24
- **Comments**: Use `biome-ignore` comments for necessary linting exceptions
