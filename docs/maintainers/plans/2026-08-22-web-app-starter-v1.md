# Agent Founders Web App Starter v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a private, beginner-first Next.js and Supabase template that safely demonstrates the complete path from authentication to deployment.

**Architecture:** Use Next.js App Router and Server Components for reads, Server Actions for writes, and Supabase SSR clients for cookie-based authentication. Keep SQL migrations and RLS policies as the database source of truth, with a small Projects feature demonstrating the canonical pattern.

**Tech Stack:** Next.js, React, TypeScript strict, Tailwind CSS, shadcn/ui, Supabase, Vitest, Playwright, Vercel, pnpm

**Spec:** `docs/maintainers/specs/2026-08-22-web-app-starter-v1-design.md`

## Global Constraints

- Node.js 20.9 or newer.
- Use the current stable `create-next-app` packages and commit the pnpm lockfile.
- Use Server Components by default and keep Client Components small.
- Use Supabase Auth and RLS for user-owned data.
- Use migrations as the only schema source of truth.
- Do not introduce an ORM, second auth service, global state library, or second API layer.
- Keep all secrets out of Git and browser bundles.
- Make the beginner path visible from the repository root.

---

### Task 1: Scaffold the Verified Application Foundation

**Files:**
- Create: framework files produced by `create-next-app`
- Create: `.nvmrc`
- Create: `.env.example`
- Modify: `package.json`
- Modify: `next.config.ts`
- Test: `tests/unit/env.test.ts`

**Interfaces:**
- Produces `getPublicEnv()` and `getServerEnv()` for validated configuration.
- Produces scripts used by every later task: `lint`, `typecheck`, `test`, `test:e2e`, and `build`.

- [ ] Scaffold with TypeScript, App Router, Tailwind, ESLint, `src/`, and pnpm.
- [ ] Add only the dependencies required for Supabase, validation, UI, and tests.
- [ ] Write failing environment validation tests for missing and valid variables.
- [ ] Implement typed environment readers with actionable error messages.
- [ ] Configure security headers and image defaults.
- [ ] Run lint, typecheck, unit tests, and build.
- [ ] Commit the verified foundation.

### Task 2: Establish Agent Rules and Beginner Documentation

**Files:**
- Create: `AGENTS.md`
- Create: `CLAUDE.md`
- Create: `.cursor/rules/agent-founders.mdc`
- Create: `.github/copilot-instructions.md`
- Create: `README.md`
- Create: `ARCHITECTURE.md`
- Create: `PRODUCT.md`
- Create: `BUILD.md`
- Create: `docs/01-setup.md`
- Create: `docs/02-shape-your-product.md`
- Create: `docs/03-build-with-your-agent.md`
- Create: `docs/04-change-the-database.md`
- Create: `docs/05-deploy.md`
- Create: `docs/06-troubleshooting.md`
- Create: `docs/glossary.md`
- Create: `docs/release-checklist.md`

**Interfaces:**
- Produces the canonical rules and living product records every agent session consumes.
- Produces the exact setup and deployment path members follow.

- [ ] Write the canonical architectural and workflow rules in `AGENTS.md`.
- [ ] Make tool-specific files point to `AGENTS.md` without duplicating policy.
- [ ] Write a root README that starts with one numbered path.
- [ ] Write stable architecture decisions and product/build templates.
- [ ] Write the setup, product, agent, database, deployment, troubleshooting, glossary, and release guides in plain language.
- [ ] Run a link, placeholder, and readability check.
- [ ] Commit the documentation system.

### Task 3: Add Supabase Schema, Generated Types, and RLS Tests

**Files:**
- Create: `supabase/config.toml`
- Create: `supabase/migrations/20260822000000_initial_schema.sql`
- Create: `supabase/seed.sql`
- Create: `supabase/tests/projects_rls.test.sql`
- Create: `types/database.ts`
- Modify: `package.json`

**Interfaces:**
- Produces `public.profiles` and `public.projects`.
- Produces the `Database` TypeScript type consumed by Supabase clients.
- Produces reproducible `db:start`, `db:reset`, `db:types`, and `test:db` commands.

- [ ] Initialize Supabase local configuration.
- [ ] Write the initial migration with tables, constraints, indexes, timestamp triggers, grants, RLS, and four project policies.
- [ ] Write pgTAP tests proving same-user CRUD and cross-user denial.
- [ ] Add development-only seed guidance without production credentials.
- [ ] Generate and commit database types.
- [ ] Start local Supabase, reset from migrations, and run database tests.
- [ ] Commit the verified database contract.

### Task 4: Implement Supabase SSR Authentication

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/proxy.ts`
- Create: `lib/auth/user.ts`
- Create: `proxy.ts`
- Create: `app/(auth)/actions.ts`
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/signup/page.tsx`
- Create: `app/(auth)/forgot-password/page.tsx`
- Create: `app/(auth)/update-password/page.tsx`
- Create: `app/auth/confirm/route.ts`
- Test: `tests/unit/auth-actions.test.ts`

**Interfaces:**
- Produces browser and server `createClient()` helpers.
- Produces `requireUser()` for protected routes.
- Produces sign-up, sign-in, sign-out, recovery, and password update actions.

- [ ] Write failing tests for auth form validation and safe redirect handling.
- [ ] Implement cookie-aware clients using `@supabase/ssr`.
- [ ] Implement token refresh in Next.js Proxy using verified claims.
- [ ] Implement the complete email/password lifecycle with neutral error messages.
- [ ] Verify protected routes redirect signed-out users.
- [ ] Run unit tests, typecheck, lint, and build.
- [ ] Commit working authentication.

### Task 5: Build the Application Shell and Projects Example

**Files:**
- Create: `components/ui/*` selected shadcn primitives
- Create: `components/app/app-header.tsx`
- Create: `components/app/empty-state.tsx`
- Create: `components/app/submit-button.tsx`
- Create: `lib/validation/project.ts`
- Create: `app/(app)/layout.tsx`
- Create: `app/(app)/dashboard/page.tsx`
- Create: `app/(app)/projects/actions.ts`
- Create: `app/(app)/projects/page.tsx`
- Create: `app/(app)/projects/new/page.tsx`
- Create: `app/(app)/projects/[id]/page.tsx`
- Create: route-level `loading.tsx`, `error.tsx`, and `not-found.tsx` files where needed
- Test: `tests/unit/project-validation.test.ts`

**Interfaces:**
- Produces canonical authenticated CRUD using Server Components, Server Actions, validation, and RLS.
- Produces reusable shell and form patterns future features imitate.

- [ ] Add only the shadcn primitives used by the starter.
- [ ] Write failing tests for project names, descriptions, statuses, and IDs.
- [ ] Build the responsive application shell.
- [ ] Implement project list, create, detail, update, and delete operations.
- [ ] Implement empty, loading, validation, not-found, and unexpected error states.
- [ ] Confirm every query is typed and scoped through the authenticated Supabase client.
- [ ] Run unit tests, typecheck, lint, and build.
- [ ] Commit the canonical feature.

### Task 6: Add Account Settings and Public Entry Page

**Files:**
- Create: `app/(app)/settings/actions.ts`
- Create: `app/(app)/settings/page.tsx`
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Test: `tests/unit/profile-validation.test.ts`

**Interfaces:**
- Produces profile and password update flows.
- Produces the complete unauthenticated entry experience.

- [ ] Write failing profile validation tests.
- [ ] Implement profile updates and password changes.
- [ ] Build a restrained, responsive entry page that demonstrates the starter without marketing clutter.
- [ ] Add metadata, accessible focus states, and useful empty copy.
- [ ] Run unit tests, typecheck, lint, and build.
- [ ] Commit the complete user journey.

### Task 7: Add CI, Dependency Maintenance, and Release Checks

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/dependabot.yml`
- Create: `.github/pull_request_template.md`
- Create: `scripts/check-repository.mjs`
- Modify: `package.json`
- Test: `tests/unit/repository-check.test.ts`

**Interfaces:**
- Produces `pnpm check` as the local and CI definition of done.
- Produces automated dependency update configuration.

- [ ] Write failing tests for secret-pattern, placeholder, and forbidden-dependency detection.
- [ ] Implement the repository policy checker.
- [ ] Configure CI for install, policy check, lint, types, unit tests, database tests, and build.
- [ ] Configure conservative weekly dependency updates.
- [ ] Add a pull request checklist matching the release definition of done.
- [ ] Run the entire local check suite.
- [ ] Commit the quality gates.

### Task 8: Verify the Beginner Journey and Publish the Template

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/public-flow.spec.ts`
- Create: `docs/maintainers/release-process.md`
- Modify: `BUILD.md`
- Modify: `README.md`

**Interfaces:**
- Produces browser evidence at desktop and mobile widths.
- Produces the maintainer process for versioning and member distribution.

- [ ] Write Playwright tests for the entry, login, signup, and protected-route redirect flows.
- [ ] Run browser tests at desktop and mobile widths and inspect screenshots.
- [ ] Follow setup instructions from a clean clone and correct every gap.
- [ ] Run database reset and cross-user RLS tests.
- [ ] Run `pnpm check` and `pnpm build` from clean dependencies.
- [ ] Write the maintainer release and member access process.
- [ ] Mark the GitHub repository as a template after all checks pass.
- [ ] Push the final verified v1 and record the release commit in `BUILD.md`.

