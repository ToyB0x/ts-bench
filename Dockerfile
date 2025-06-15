FROM node:24-alpine

# Install pnpm
RUN corepack enable && corepack use pnpm@10.12.1

# Install git (required for analyzing git repositories and cloning repo-monitor)
RUN apk add --no-cache git

# Install GitHub CLI (required for PR comments)
RUN apk add --no-cache github-cli

# Set working directory
WORKDIR /action

# Clone repo-monitor repository
RUN git clone --depth 1 https://github.com/ToyB0x/repo-monitor.git .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build packages
RUN pnpm turbo build --filter=@repo/cli --filter=@repo/db

RUN pnpm --filter=@repo/db db:migrate:deploy

WORKDIR /github/workspace
CMD git config --global --add safe.directory /github/workspace \
    && node /action/apps/cli/dist/index.js analyze > report.md

# docker build --progress=plain -t repo-monitor . && docker run --volume .:/target repo-monitor analyze
