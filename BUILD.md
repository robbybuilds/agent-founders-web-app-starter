# Build Record

## Current Stage

Starter v1 implementation

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
- Public and login screens pass desktop and mobile browser checks.

## In Progress

Run the database and RLS suite on GitHub's Docker-backed Linux runner.

## Next Exact Task

Push `codex/starter-v1`, inspect both CI jobs, and fix any database test failure before merging.

## Evidence

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm test:e2e` with 8 passing browser tests
- `python3 .../quick_validate.py .agents/skills/build-next-feature`

## Known Limits

- The repository has not been transferred to an Agent Founders Club organization.
- Supabase and Vercel production projects have not been connected.
- The local database suite could not run because this Mac has no Docker-compatible runtime.
- Authenticated CRUD browser tests still require local or hosted Supabase test credentials.
