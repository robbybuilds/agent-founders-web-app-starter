# Build Record

## Current Stage

Convex migration on the `convex-migration` branch, verified locally and waiting on Robby's Convex account for the live smoke test

## Current Product

Project Desk, the canonical example described in `PRODUCT.md`.

## Decisions in Force

- Use the stack and rules in `AGENTS.md` and `ARCHITECTURE.md`.
- Keep `convex/schema.ts` as the database source of truth.
- Use the Projects feature as the pattern for future user-owned features.
- Keep the repository beginner-first.

## 2026-08-24 — Migrated from Supabase to Convex

What changed:

- Convex replaces Supabase for the database, server functions, and authentication. The `supabase` folder, the Supabase clients, and the generated database types are gone.
- `convex/schema.ts` defines the `projects` table with the same fields, limits, and ownership intent as the old SQL migration. The display name moved into the Convex Auth `users` table, so there is no separate profiles table.
- Convex Auth's Password provider handles sign up, sign in, sign out, password reset by emailed code, and password change from settings. The reset email needs `AUTH_RESEND_KEY` on the deployment; setup marks it optional.
- Ownership checks moved from Row Level Security into every function in `convex/projects.ts` and `convex/users.ts`: each one reads the signed-in user from `ctx.auth` and refuses to touch anyone else's records.
- The old pgTAP RLS tests became `convex-test` ownership tests in `tests/unit/projects-access.test.ts`.
- Docs, agent rules, CI, and the policy script now describe the Convex golden path. CI no longer needs Docker or a database job.

Evidence that passed locally (no Convex account needed):

- `pnpm policy`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test` with 33 passing unit tests, including 7 cross-user ownership tests
- `pnpm build` with `NEXT_PUBLIC_CONVEX_URL` set to a placeholder

Follow-up ideas, not started on purpose:

- Magic-link or OTP sign-in through Resend is straightforward with `@convex-dev/auth` if the product ever wants passwordless login.
- Live-updating pages with `preloadQuery` and `usePreloadedQuery` once a screen actually needs realtime.

## Needs Robby Before Merge

- [ ] Run `npx convex dev` once in the repository and create the Convex project.
- [ ] Run `npx @convex-dev/auth` once to set the auth keys on the dev deployment.
- [ ] Confirm `.env.local` received `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`.
- [ ] Manual smoke test: sign up, create a project, refresh, sign out, sign back in.
- [ ] Second-account isolation test: a second user cannot open, edit, or delete the first user's project.
- [ ] Optional: set `AUTH_RESEND_KEY` and test the password reset code flow.
- [ ] Set the Vercel build command and `CONVEX_DEPLOY_KEY` per `docs/05-deploy.md` when deploying.
- [ ] Run `pnpm test:e2e` locally, confirm CI is green on the branch, then merge.

## Completed

- The architecture specification and implementation plan are committed.
- The private GitHub repository exists under `robbybuilds`.
- The current stable Next.js application is scaffolded.
- Environment validation has unit coverage.
- Lint, strict TypeScript, unit tests, and production build pass for the foundation.
- Authentication covers sign up, sign in, sign out, recovery, and password updates.
- Protected dashboard, Projects CRUD, and account settings are implemented.
- The local agent skill, member guides, access process, release process, license, CI, and Dependabot configuration are present.
- The README includes one copy-and-paste prompt that orients a new coding agent, protects the approved product direction, and requires a plan before implementation.
- The repository policy gate scans text files for common committed credential formats without relying on a small extension list.
- Ownership tests cover owner CRUD, cross-user read isolation, blocked cross-user writes and deletes, and signed-out rejection.
- Production guidance covers deploy keys, reset email domains, MFA, backups, and second-account access checks.
- Public and login screens pass desktop and mobile browser checks.
- GitHub recognizes the private repository as a template.
- `pnpm init:app` resets `BUILD.md` and `CHANGELOG.md` to day zero for a new copy of the template, and refuses to run against the starter repository itself.
- Member guides cover adding payments (Stripe Checkout, verified webhook, ownership-protected subscriptions) and adding an AI feature (server-only Claude API call with validated input).
- A weekly scheduled workflow audits production dependencies for high-severity vulnerabilities.

## In Progress

The Convex migration is code-complete and waiting on the "Needs Robby Before Merge" checklist above.

## Next Exact Task

Work through the "Needs Robby Before Merge" checklist, then merge `convex-migration` into `main`.

## Known Limits

- Nothing in this branch has run against a real Convex deployment yet. The smoke test above is the proof that closes that gap.
- The Playwright suite covers public pages only; authenticated CRUD browser tests still need a real deployment and test credentials.
- Password reset emails do not send until `AUTH_RESEND_KEY` is set on the deployment.
