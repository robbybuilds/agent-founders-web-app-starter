# Build Record

## Current Stage

Starter v1 on `main`, cloud CI verified and pending hosted release verification

## Current Product

Project Desk, the canonical example described in `PRODUCT.md`.

## Decisions in Force

- Use the stack and rules in `AGENTS.md` and `ARCHITECTURE.md`.
- Keep Supabase migrations as the database source of truth.
- Use the Projects feature as the pattern for future user-owned features.
- Keep the repository beginner-first and private during v1.

## Completed

- The architecture specification and implementation plan are committed.
- The private GitHub repository exists under `robbybuilds`.
- The current stable Next.js application is scaffolded.
- Environment validation has unit coverage.
- Lint, strict TypeScript, unit tests, and production build pass for the foundation.
- The Supabase migration defines profiles, projects, constraints, indexes, triggers, grants, and RLS policies.
- Authentication covers sign up, confirmation, sign in, sign out, recovery, and password updates.
- Protected dashboard, Projects CRUD, and account settings are implemented.
- The local agent skill, member guides, access process, release process, license, CI, and Dependabot configuration are present.
- The README includes one copy-and-paste prompt that orients a new coding agent, protects the approved product direction, and requires a plan before implementation.
- The auth callback accepts only the PKCE code flow, account password changes require the current password, and browser-visible configuration rejects Supabase secret keys.
- The repository policy gate scans text files for common committed credential formats without relying on a small extension list.
- Database tests cover profile isolation, project isolation, rejected foreign ownership, and blocked ownership reassignment.
- Production guidance covers secure password changes, custom SMTP, rate limits, CAPTCHA decisions, Security Advisor, owner MFA, backups, and second-account access checks.
- Public and login screens pass desktop and mobile browser checks.
- Pull request 1 is merged, so the complete starter is now on the default `main` branch.
- GitHub recognizes the private repository as a template.
- GitHub Actions passes both the application and database/RLS jobs on `main`.
- The internal v1 plans and specs moved under `docs/maintainers`, keeping the member docs tree clean.
- `pnpm init:app` resets `BUILD.md` and `CHANGELOG.md` to day zero for a new copy of the template, and refuses to run against the starter repository itself.
- Member guides cover adding payments (Stripe Checkout, verified webhook, RLS-protected subscriptions) and adding an AI feature (server-only Claude API call with validated input).
- A weekly scheduled workflow audits production dependencies for high-severity vulnerabilities, so problems surface between pushes too. GitHub's dependency-review action was evaluated and rejected: it requires Advanced Security on private repositories, so it would fail in every member's copy.

## In Progress

Prepare hosted Supabase and Vercel release verification.

## Next Exact Task

Connect hosted Supabase and Vercel, apply the committed migration, and run the complete production release checklist with two test accounts.

## Evidence

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm test:e2e` with 8 passing browser tests
- `python3 .../quick_validate.py .agents/skills/build-next-feature`
- The migration applied cleanly to temporary PostgreSQL 16.14.
- A local SQL harness proved owner CRUD, cross-user read isolation, blocked cross-user insert, and no-op cross-user update and delete.
- `pnpm audit --prod --audit-level=high` reported no known vulnerabilities.
- A standard security scan reviewed the authentication, authorization, database, secret handling, and deployment surfaces. Its four findings were fixed before this release candidate.
- A new clone of the GitHub repository completed `pnpm install --frozen-lockfile` and `pnpm check` at commit `d5765f6` without relying on local generated files.
- GitHub Actions run `32598235941` passed the application checks, browser tests, clean migration rebuild, and database/RLS tests.

## Known Limits

- The repository has not been transferred to an Agent Founders Club organization.
- Supabase and Vercel production projects have not been connected.
- The local database suite could not run because this Mac has no Docker-compatible runtime.
- Authenticated CRUD browser tests still require local or hosted Supabase test credentials.
