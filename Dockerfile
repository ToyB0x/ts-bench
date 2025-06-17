FROM node:24.2.0-alpine

# Install pnpm
RUN corepack enable && corepack use pnpm@10.12.1

# Install git (required for analyzing git repositories and cloning repo-monitor)
RUN apk add --no-cache git

# Install GitHub CLI (required for PR comments)
RUN apk add --no-cache github-cli

# Clone repo-monitor repository
RUN git clone --depth 1 https://github.com/ToyB0x/repo-monitor.git

WORKDIR ./repo-monitor

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build packages
RUN pnpm turbo build --filter=@repo/cli --filter=@repo/db

# Copy the example environment file to .env (workaround for missing .env under GitHub Actions until release npm package)
RUN cp .env.example .env

# Set working directory to Github Actions default workspace as mounted volume (shared with host repository)
WORKDIR /github/workspace
CMD set -e \
    # Configure git for the workspace
    && git config --global --add safe.directory /github/workspace \
    # Try to restore existing database if available
    && if test -f /github/workspace/repo.sqlite; then \
         echo "Reusing existing database" \
         && cp /github/workspace/repo.sqlite /repo-monitor/sqlite/repo.db \
         # Try to apply migrations to existing database if needed
         && npm run --prefix /repo-monitor/packages/database db:migrate:deploy || { \
           echo "Migration failed on existing database, recreating" \
           && rm -f /repo-monitor/sqlite/repo.db \
           && npm run --prefix /repo-monitor/packages/database db:migrate:deploy; \
         }; \
       else \
         echo "Setting up new database" \
         && npm run --prefix /repo-monitor/packages/database db:migrate:deploy || { \
           echo "Migration failed, recreating database" \
           && rm -f /repo-monitor/sqlite/repo.db \
           && npm run --prefix /repo-monitor/packages/database db:migrate:deploy; \
         }; \
       fi \
    # Run analysis and save the database
    && node /repo-monitor/apps/cli analyze > /github/workspace/report.md \
    && cp /repo-monitor/sqlite/repo.db /github/workspace/repo.sqlite