FROM node:24-alpine

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

# Set working directory to Github Actions default workspace as mounted volume (shared with host repository)
WORKDIR /github/workspace

CMD git config --global --add safe.directory /github/workspace \
    # Restore the database from the host repository's downloaded artifact to the container if it exists (use true to avoid failure with exit code 1 if it doesn't)
    && test -f /github/workspace/repo.sqlite && echo "reuse db" && cp /github/workspace/repo.sqlite /repo-monitor/sqlite/repo.db || echo "create new db" \
    && npm run --prefix /repo-monitor/packages/database db:migrate:deploy \
      || echo "migraton failed, re-creating database" && rm /repo-monitor/sqlite/repo.db && npm run --prefix /repo-monitor/packages/database db:migrate:deploy \
    && node /repo-monitor/apps/cli analyze > /github/workspace/report.md \
    && cp /repo-monitor/sqlite/repo.db /github/workspace/repo.sqlite

# docker build --progress=plain -t repo-monitor . && docker run --volume .:/target repo-monitor analyze
