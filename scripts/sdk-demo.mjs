#!/usr/bin/env node

/**
 * sdk-demo.mjs — Lesson 14: The Claude Code SDK
 *
 * This script shows how to drive Claude Code programmatically
 * from your own Node scripts. You can pipe its output into CI,
 * cron jobs, or any automation pipeline.
 *
 * Usage:
 *   export ANTHROPIC_API_KEY=sk-ant-api03-...
 *   node scripts/sdk-demo.mjs
 *
 * What it does:
 *   1. Spawns a Claude Code session via the SDK
 *   2. Asks Claude to audit src/routes/tasks.js
 *   3. Collects the response and prints a summary
 */

import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

// ── quick pre-flight checks ──────────────────────
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Set ANTHROPIC_API_KEY before running this script.");
  console.error("  export ANTHROPIC_API_KEY=sk-ant-api03-...");
  process.exit(1);
}

const targetFile = "src/routes/tasks.js";
if (!existsSync(targetFile)) {
  console.error(`Can't find ${targetFile} — run this from the project root.`);
  process.exit(1);
}

// ── run Claude Code in non-interactive mode ──────
const prompt = `
Read ${targetFile} and give me a short bullet-point list of:
- any input-validation gaps
- potential SQL-injection vectors
- missing error handling
Keep it under 200 words.
`.trim();

console.log("Running Claude Code SDK audit...\n");

try {
  // The -p flag runs Claude Code in print (non-interactive) mode.
  // --output-format json gives us structured output we can parse.
  const raw = execSync(
    `claude -p --output-format json "${prompt.replace(/"/g, '\\"')}"`,
    {
      encoding: "utf-8",
      timeout: 60_000,
      env: { ...process.env },
    }
  );

  const result = JSON.parse(raw);

  console.log("═══ Audit Results ═══\n");
  console.log(result.result || result.text || raw);
  console.log("\n═══ Session Info ═══");
  console.log("  Model:       ", result.model || "unknown");
  console.log("  Input tokens:", result.usage?.input_tokens ?? "n/a");
  console.log("  Output tokens:", result.usage?.output_tokens ?? "n/a");
  console.log("  Cost est.:   ", result.cost_usd ? `$${result.cost_usd}` : "n/a");
} catch (err) {
  if (err.status) {
    console.error("Claude Code exited with status", err.status);
    console.error(err.stderr?.toString());
  } else {
    console.error("Failed to run Claude Code:", err.message);
    console.error("Make sure `claude` is installed: npm i -g @anthropic-ai/claude-code");
  }
  process.exit(1);
}
