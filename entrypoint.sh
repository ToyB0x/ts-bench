#!/bin/sh
set -e

# Run database migration in the action workspace
cd /action/packages/database
pnpm db:migrate:deploy

# Change to the target repository directory for analysis
cd "$GITHUB_WORKSPACE"

# Analyze and generate report (CLI will analyze the current directory)
/action/apps/cli/dist/index.js analyze > report.md

# Create PR comment
gh pr comment "$INPUT_PR_NUMBER" --body-file report.md --edit-last --create-if-none
