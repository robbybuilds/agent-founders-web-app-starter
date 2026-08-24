#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const forbiddenDependencies = [
  "@clerk/nextjs",
  "@supabase/ssr",
  "@supabase/supabase-js",
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
  "convex/schema.ts",
  "convex/auth.ts",
  "tests/unit/projects-access.test.ts",
];

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
    /CONVEX_DEPLOY_KEY\s*[:=]\s*["']?(?!your-|example|test|placeholder)[^\s"']{12,}/i.test(
      content,
    )
  ) {
    findings.push("assigned deploy key");
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

  if (/\b(?:prod|dev|preview):[A-Za-z0-9-]+\|[A-Za-z0-9+/=_-]{20,}/.test(content)) {
    findings.push("Convex deploy key");
  }

  if (/\bAKIA[A-Z0-9]{16}\b/.test(content)) {
    findings.push("AWS access key");
  }

  const assignedCredentialPatterns = [
    /\b([A-Z][A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD))\s*=\s*["']?([A-Za-z0-9_./+=-]{16,})/g,
    /\b([A-Za-z][A-Za-z0-9_-]*(?:Key|Token|Secret|Password))\s*[:=]\s*["']([A-Za-z0-9_./+=-]{16,})["']/g,
  ];

  for (const pattern of assignedCredentialPatterns) {
    for (const match of content.matchAll(pattern)) {
      const name = match[1];
      const value = match[2];
      const isBrowserKey = /(?:NEXT_PUBLIC|PUBLISHABLE|ANON)/i.test(name);
      const isPlaceholder = /^(?:your|example|test|placeholder|fake|dummy|redacted|changeme|x{4,})/i.test(
        value,
      );
      const hasDedicatedCheck =
        /CONVEX_DEPLOY_KEY/i.test(name) ||
        /^(?:sk-(?:proj-)?|gh[pousr]_|sk_live_|AKIA)/.test(value) ||
        /^(?:prod|dev|preview):/.test(value);

      if (!isBrowserKey && !isPlaceholder && !hasDedicatedCheck) {
        findings.push("assigned credential");
        return findings;
      }
    }
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

export function isProbablyText(content) {
  return !content.subarray(0, 8192).includes(0);
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

  for (const file of files) {
    const bytes = readFileSync(path.join(root, file));

    if (!isProbablyText(bytes)) {
      continue;
    }

    const content = bytes.toString("utf8");

    for (const finding of findSecretLikeValues(content)) {
      failures.push(`${file}: possible ${finding}`);
    }

    if ((file.startsWith("src/") || file.startsWith("convex/")) && /\b(?:TODO|FIXME|TBD)\b/.test(content)) {
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
