#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const starterRepository = "agent-founders-web-app-starter";

const buildRecordTemplate = `# Build Record

## Current Stage

Fresh start from the Agent Founders Web App Starter

## Current Product

Not chosen yet. \`PRODUCT.md\` still describes Project Desk, the starter's example.

## Decisions in Force

- Use the stack and rules in \`AGENTS.md\` and \`ARCHITECTURE.md\`.
- Keep \`convex/schema.ts\` as the database source of truth.
- Use the Projects feature as the pattern for future user-owned features.

## Completed

- The starter baseline is in place: authentication, the Projects example feature, the Convex schema, ownership checks, tests, and CI.

## In Progress

Nothing yet.

## Next Exact Task

Rewrite \`PRODUCT.md\` so it describes your product, then ask your agent for a plan for the first feature.

## Evidence

- Record the commands you and your agent run here as the build progresses.

## Known Limits

- None recorded yet.
`;

const changelogTemplate = `# Changelog

## Unreleased

- Started this app from the Agent Founders Web App Starter.
`;

function isStarterRepository(root) {
  try {
    const remote = execFileSync("git", ["remote", "get-url", "origin"], {
      cwd: root,
      encoding: "utf8",
    }).trim();

    return remote.includes(starterRepository);
  } catch {
    return false;
  }
}

export function initializeApp(root = process.cwd(), { force = false } = {}) {
  if (isStarterRepository(root) && !force) {
    return {
      reset: false,
      reason:
        "This looks like the starter template itself, not your copy of it. " +
        "Run this inside the repository you created from the template, or pass --force.",
    };
  }

  writeFileSync(path.join(root, "BUILD.md"), buildRecordTemplate);
  writeFileSync(path.join(root, "CHANGELOG.md"), changelogTemplate);

  return { reset: true };
}

function main() {
  const result = initializeApp(process.cwd(), {
    force: process.argv.includes("--force"),
  });

  if (!result.reset) {
    console.error(result.reason);
    process.exitCode = 1;
    return;
  }

  console.log("BUILD.md and CHANGELOG.md now start from day zero.");
  console.log("Next: rewrite PRODUCT.md, then use the kickoff prompt in README.md.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
