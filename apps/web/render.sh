#!/usr/bin/env bash

WEB_OUT_DIR="${PWD}/web"
DB_FILE_ABSOLUTE_PATH="${PWD}/${DB_FILE_NAME:-default_db_file_name}"
SCRIPT_PATH="${BASH_SOURCE[0]}"
SCRIPT_DIR="$(dirname "$(readlink -f "$SCRIPT_PATH")")" # or SCRIPT_DIR=$(cd $(dirname $0); pwd)

export DB_FILE_NAME="${DB_FILE_ABSOLUTE_PATH}"

echo "Starting rendering process..."
cd ${SCRIPT_DIR} && npm run build:prerender

if [ $? -ne 0 ]; then
  echo "Build failed"
  exit 1
fi

cp -r ${SCRIPT_DIR}/build ${WEB_OUT_DIR}
echo "Rendering completed successfully. Output directory: ${WEB_OUT_DIR}"
