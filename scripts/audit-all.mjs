#!/usr/bin/env node

/**
 * audit-all.mjs — Lesson 14 exercise
 *
 * Loops over every .js file in src/ and asks Claude Code
 * to do a quick security check on each one.
 *
 * Usage:
 *   export ANTHROPIC_API_KEY=sk-ant-api03-...
 *   node scripts/audit-all.mjs
 */

import { execSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walk(full));
    } else if (full.endsWith(".js")) {
      files.push(full);
    }
  }
  return files;
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Set ANTHROPIC_API_KEY first.");
  process.exit(1);
}

const files = walk("src");
console.log(`Auditing ${files.length} files...\n`);

for (const file of files) {
  console.log(`── ${file} ──`);
  try {
    const result = execSync(
      `claude -p "Check ${file} for security issues. Be brief — 3 bullets max."`,
      { encoding: "utf-8", timeout: 45_000 }
    );
    console.log(result.trim());
  } catch (err) {
    console.log("  (skipped — error or timeout)");
  }
  console.log();
}

console.log("Done.");
