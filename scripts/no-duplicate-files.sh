#!/usr/bin/env bash
# no-duplicate-files.sh
# PreToolUse hook — blocks Write if the file already exists.
# Forces Claude to use Edit instead, which is usually safer.

set -euo pipefail

INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ "$TOOL" = "Write" ] && [ -f "$FILE_PATH" ]; then
  echo "File '$FILE_PATH' already exists. Use Edit instead of Write to modify it." >&2
  exit 2
fi

exit 0
