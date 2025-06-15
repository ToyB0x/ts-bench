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

RUN pnpm --dir /repo-monitor/packages/database db:migrate:deploy

CMD pnpm --dir /repo-monitor/apps/cli analyze > /github/workspace/report.md \
    && ls /repo-monitor/sqlite \
    && cp /repo-monitor/sqlite/repo.db /github/workspace/repo.db

# docker build --progress=plain -t repo-monitor . && docker run --volume .:/target repo-monitor analyze
