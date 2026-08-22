#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const forbiddenDependencies = [
  "@clerk/nextjs",
  "@prisma/client",
  "@reduxjs/toolkit",
  "@trpc/client",
  "@trpc/server",
  "drizzle-orm",
  "next-auth",
  "prisma",
  "redux",
  "styled-components",
  "zustand",
];

const requiredFiles = [
  "AGENTS.md",
  "ARCHITECTURE.md",
  "BUILD.md",
  "PRODUCT.md",
  "README.md",
  ".env.example",
  "docs/01-setup.md",
  "docs/06-troubleshooting.md",
  "supabase/config.toml",
  "supabase/migrations/20260822000000_initial_schema.sql",
  "supabase/tests/projects_rls.test.sql",
];

const textExtensions = new Set([
  ".css",
  ".env",
  ".example",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mdc",
  ".mjs",
  ".mts",
  ".sql",
  ".toml",
  ".ts",
  ".tsx",
  ".yaml",
  ".yml",
]);

export function findForbiddenDependencies(packageJson) {
  const installed = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  return forbiddenDependencies.filter((name) => name in installed);
}

export function findSecretLikeValues(content) {
  const findings = [];

  if (
    /SUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*["']?(?!your-|example|test|placeholder)[^\s"']{12,}/i.test(
      content,
    )
  ) {
    findings.push("assigned service-role key");
  }

  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(content)) {
    findings.push("private key material");
  }

  if (/\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/.test(content)) {
    findings.push("OpenAI-style secret key");
  }

  if (/\bgh[pousr]_[A-Za-z0-9]{20,}\b/.test(content)) {
    findings.push("GitHub token");
  }

  if (/\bsk_live_[A-Za-z0-9]{20,}\b/.test(content)) {
    findings.push("Stripe live secret key");
  }

  return findings;
}

function repositoryFiles(root) {
  return execFileSync("git", ["ls-files", "-co", "--exclude-standard"], {
    cwd: root,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
}

function isTextFile(file) {
  return textExtensions.has(path.extname(file)) || path.basename(file) === ".env.example";
}

export function checkRepository(root = process.cwd()) {
  const failures = [];
  const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

  for (const dependency of findForbiddenDependencies(packageJson)) {
    failures.push(`Forbidden default dependency: ${dependency}`);
  }

  for (const requiredFile of requiredFiles) {
    if (!existsSync(path.join(root, requiredFile))) {
      failures.push(`Required starter file is missing: ${requiredFile}`);
    }
  }

  const files = repositoryFiles(root);
  const committedEnvironmentFiles = execFileSync("git", ["ls-files", ".env*"], {
    cwd: root,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean)
    .filter((file) => file !== ".env.example");

  for (const file of committedEnvironmentFiles) {
    failures.push(`Real environment file is tracked: ${file}`);
  }

  for (const file of files.filter(isTextFile)) {
    const content = readFileSync(path.join(root, file), "utf8");

    for (const finding of findSecretLikeValues(content)) {
      failures.push(`${file}: possible ${finding}`);
    }

    if ((file.startsWith("src/") || file.startsWith("supabase/")) && /\b(?:TODO|FIXME|TBD)\b/.test(content)) {
      failures.push(`${file}: unresolved placeholder marker`);
    }
  }

  return failures;
}

function main() {
  const failures = checkRepository();

  if (failures.length) {
    console.error("Repository policy check failed:\n");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exitCode = 1;
    return;
  }

  console.log("Repository policy check passed.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
