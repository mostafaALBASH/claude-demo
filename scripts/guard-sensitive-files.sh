#!/usr/bin/env bash
# guard-sensitive-files.sh
# PreToolUse hook — blocks writes to sensitive paths.
# Exit 2 = block the action. Exit 0 = allow it.

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

BLOCKED_PATTERNS=(
  ".env"
  ".env.local"
  ".env.production"
  "package-lock.json"
  "yarn.lock"
  ".git/"
  "data/*.db"
  "*.pem"
  "*.key"
)

for pattern in "${BLOCKED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) BLOCKED $FILE_PATH (pattern: $pattern)" >> .claude/audit.log 2>/dev/null
    echo "BLOCKED: writing to '$FILE_PATH' is not allowed (matches '$pattern')" >&2
    exit 2
  fi
done

exit 0
