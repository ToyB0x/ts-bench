#!/bin/bash

SCRIPT_PATH="${BASH_SOURCE[0]}"
echo "BASH_SOURCE[0] を使用: ${SCRIPT_PATH}"

# 絶対パスに変換
SCRIPT_DIR="$(dirname "$(readlink -f "$SCRIPT_PATH")")"
echo "スクリプトのディレクトリ (絶対パス): ${SCRIPT_DIR}"

export DB_FILE_NAME="ts-bench.sqlite"

# drizzle-kit migrate を実行し、失敗した場合は repo.sqlite を削除して再実行する
echo "Running drizzle-kit migrate..."
npx drizzle-kit migrate --config "${SCRIPT_DIR}/drizzle.config.ts"
if [ $? -ne 0 ]; then
  echo "migrate failed, removing ${DB_FILE_NAME} and retrying..."
  rm -f ${DB_FILE_NAME}
  npx drizzle-kit migrate --config "${SCRIPT_DIR}/drizzle.config.ts"
fi
