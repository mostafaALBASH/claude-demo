#!/usr/bin/env bash
# pr-summary.sh — Lesson 14 exercise
#
# Generates a PR description from recent git commits using
# Claude Code in print mode.
#
# Usage: bash scripts/pr-summary.sh [number-of-commits]

set -euo pipefail

COMMITS=${1:-5}

if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
  echo "Set ANTHROPIC_API_KEY first."
  exit 1
fi

echo "Generating PR summary from last $COMMITS commits..."
echo ""

git log --oneline -"$COMMITS" | claude -p \
  "Based on these git commit messages, write a concise PR description
   with a summary paragraph and a bullet list of changes. Keep it
   professional and under 200 words."
