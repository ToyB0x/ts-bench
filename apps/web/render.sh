#!/usr/bin/env bash

WEB_OUT_DIR="${PWD}/web"

# Handle both absolute and relative paths for DB_FILE_NAME
if [[ "${DB_FILE_NAME:-}" =~ ^/ ]]; then
  # DB_FILE_NAME is already an absolute path
  DB_FILE_ABSOLUTE_PATH="${DB_FILE_NAME}"
else
  # DB_FILE_NAME is relative or not set, make it absolute
  DB_FILE_ABSOLUTE_PATH="${PWD}/${DB_FILE_NAME:-default_db_file_name}"
fi

SCRIPT_PATH="${BASH_SOURCE[0]}"
SCRIPT_DIR="$(dirname "$(readlink -f "$SCRIPT_PATH")")"

export DB_FILE_NAME="${DB_FILE_ABSOLUTE_PATH}"

echo "Starting rendering process..."
cd "${SCRIPT_DIR}" || exit 1

if ! npm run build:prerender; then
  echo "Build failed"
  exit 1
fi

cp -r "${SCRIPT_DIR}/build" "${WEB_OUT_DIR}"
echo "Rendering completed successfully. Output directory: ${WEB_OUT_DIR}"
