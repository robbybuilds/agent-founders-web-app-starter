# Agent Founders Web App Starter v1 Design

## Purpose

Build a private, beginner-first GitHub template that gives an AI agent a dependable environment for launching a real web application. The repository must reduce architectural drift, teach good habits through one complete example, and make unsafe defaults difficult.

This is a golden path, not a pile of installed packages. A member should be able to create a private repository from the template, follow one setup path, describe a product, and ask an agent to build inside clear boundaries.

## Audience

The primary user is a first-time builder who:

- can follow short terminal instructions but may not understand the commands yet
- uses Codex, Claude Code, Cursor, or another coding agent
- needs the agent to preserve context between sessions
- cannot reliably judge architecture or security decisions
- wants to launch a small SaaS or web app, not study framework internals

## Outcome

After setup, the member has:

- a working local application
- email and password authentication
- protected application routes
- a dashboard and account settings
- a complete Projects CRUD example
- a Supabase database recreated from committed migrations
- row-level security that isolates each user's records
- tests that demonstrate application and database expectations
- a repeatable agent workflow from product definition through deployment
- a Vercel-ready production build

## Distribution

Version one lives in a private repository under `robbybuilds` and will later transfer to an Agent Founders Club GitHub organization. The organization repository will be marked as a template. Members receive read access and create a private repository in their own account.

Access controls distribution but does not act as DRM. A member retains repositories and local copies they create. The repository must therefore contain no secrets or sensitive operational data.

## Approved Stack

- Next.js App Router using the current stable `create-next-app` release
- React and React Server Components by default
- TypeScript with strict mode enabled
- Tailwind CSS
- shadcn/ui components stored in the repository
- Supabase Postgres, Auth, Storage, and Realtime only when the product needs them
- Supabase SSR clients with cookie-based sessions
- Supabase SQL migrations as the database source of truth
- Vercel as the default hosting platform
- pnpm with a committed lockfile
- Node.js 20.9 or newer

## Explicit Non-Defaults

Do not add these without a written product requirement and architectural justification:

- Prisma or Drizzle
- Clerk or another auth provider
- Redux, Zustand, or another global state library
- tRPC or a second API abstraction
- styled-components or CSS modules
- a second database or backend platform

## Application Architecture

### Routes

- `/` is a restrained product landing page with sign-in and create-account actions.
- `/login`, `/signup`, `/forgot-password`, and `/update-password` implement the auth lifecycle.
- `/auth/confirm` exchanges email confirmation tokens.
- `/dashboard` is the protected application home.
- `/projects` lists the signed-in user's projects.
- `/projects/new` creates a project.
- `/projects/[id]` shows and edits one owned project.
- `/settings` updates the member's profile and password.

### Rendering and Data Flow

- Server Components read data.
- Server Actions handle authenticated writes.
- Client Components are limited to interactive controls that require browser state.
- Every protected page verifies the current identity on the server.
- Database authorization is enforced by RLS, even when the application already checked identity.
- Expected form failures return friendly field or form messages. Unexpected failures are logged without exposing secrets to the user.

### Source Organization

- `app/` owns routes, route layouts, and route-specific actions.
- `components/ui/` contains shadcn primitives.
- `components/app/` contains reusable product components.
- `lib/supabase/` contains browser, server, and session-refresh clients.
- `lib/auth/` contains server-side identity helpers.
- `lib/validation/` contains shared input schemas.
- `lib/utils/` contains small framework-independent helpers.
- `supabase/migrations/` is the only source of database schema changes.
- `types/database.ts` is generated from the Supabase schema.
- `tests/` contains application tests.
- `supabase/tests/` contains database and RLS tests.

## Example Domain

The canonical example is `projects` because it is easy to understand and exercises the complete pattern without imposing a business model.

A project has:

- `id`
- `user_id`
- `name`
- optional `description`
- `status` with `idea`, `building`, or `launched`
- `created_at`
- `updated_at`

The example must include create, list, read, update, and delete flows; validation; empty, loading, success, and error states; ownership indexes; and RLS policies for every operation.

## Database Rules

- Every schema change is a timestamped SQL migration.
- Every user-owned table has a non-null `user_id` referencing `auth.users`.
- RLS is enabled before application access is granted.
- Policies separately cover select, insert, update, and delete.
- Insert and update policies use `with check` as well as ownership predicates.
- Foreign keys, check constraints, and useful indexes are defined in SQL.
- Generated TypeScript types are committed.
- Seed data is development-only and never pushed to production by default.
- RLS tests prove that one user cannot read or change another user's data.

## Security Baseline

- Never commit `.env*` files except `.env.example`.
- Never expose a Supabase secret or service-role key to browser code.
- Use the Supabase publishable key in browser-safe configuration.
- Verify identity with current Supabase server guidance, not an unvalidated session object.
- Treat all form and URL input as untrusted.
- Validate mutation input on the server.
- Do not render raw HTML from user content.
- Add conservative security headers that do not break Next.js or Supabase.
- Keep dependencies minimal and use Dependabot for npm and GitHub Actions updates.
- CI fails on lint, type errors, tests, database tests, or production build errors.
- A release checklist covers environment variables, RLS, redirects, email settings, and production smoke tests.

## Agent Continuity

`AGENTS.md` is the canonical operating agreement for coding agents. `CLAUDE.md`, Cursor rules, and Copilot instructions only direct tools to the canonical rules instead of restating them.

The repository includes:

- `PRODUCT.md` for the product being built
- `BUILD.md` as the living baton between sessions
- `ARCHITECTURE.md` for stable technical decisions
- a small number of focused agent skills with progressive detail

Every work session must read `AGENTS.md`, `PRODUCT.md`, and `BUILD.md`. Every completed task updates `BUILD.md` with decisions, evidence, and the next exact task.

## Beginner Documentation

The first screen of the repository must answer four questions:

1. What is this?
2. What do I do first?
3. What should work when I finish setup?
4. Where do I go when something fails?

Documentation uses short steps, defines technical terms before using them, explains destructive commands, and separates required setup from optional capability.

Required guides:

- `README.md` as the start page
- `docs/01-setup.md`
- `docs/02-shape-your-product.md`
- `docs/03-build-with-your-agent.md`
- `docs/04-change-the-database.md`
- `docs/05-deploy.md`
- `docs/06-troubleshooting.md`
- `docs/glossary.md`
- `docs/release-checklist.md`

## Quality Bar

The template is ready only when:

- a clean clone can install with `pnpm install --frozen-lockfile`
- required environment variables are documented and checked
- `pnpm lint` passes
- `pnpm typecheck` passes
- `pnpm test` passes
- `pnpm test:db` passes against local Supabase
- `pnpm build` passes
- Playwright verifies the unauthenticated path at desktop and mobile widths
- authenticated CRUD and cross-user RLS behavior are verified
- setup instructions are followed from a clean directory
- no secret, service-role credential, placeholder, dead link, or unexplained command remains

## V1 Boundaries

Version one does not include billing, teams, organizations, admin impersonation, AI model integrations, background jobs, analytics vendors, realtime subscriptions, or file uploads. Those are product-specific capabilities and should be added only when the product requires them.

