# Changelog

## Unreleased

- Migrated the starter from Supabase to Convex: database, server functions, and authentication now live in the `convex` folder.
- Replaced SQL migrations and Row Level Security with `convex/schema.ts` and ownership checks inside every Convex function.
- Replaced the pgTAP RLS tests with `convex-test` ownership tests that run in `pnpm test` with no database service.
- Moved the display name into the Convex Auth users table and removed the profiles table.
- Rebuilt password reset as an emailed 8-digit code through Resend, optional until `AUTH_RESEND_KEY` is set.
- Simplified CI to one job with no Docker or database steps.
- Rewrote the setup, database, deployment, troubleshooting, and glossary guides plus the agent rules for the Convex golden path.

- Added the private v1 golden-path architecture.
- Added the beginner setup, product, agent, database, deployment, and troubleshooting guides.
- Added Next.js 16, React 19, Tailwind 4, shadcn/ui, and Supabase foundations.
- Added authentication, protected routes, account settings, and Projects CRUD.
- Added SQL migrations, RLS policies, pgTAP tests, unit tests, browser tests, and CI.
- Added a beginner-friendly copy-and-paste agent kickoff prompt.
- Hardened confirmation callbacks, password changes, public key validation, secret detection, database function permissions, and cross-user RLS tests.
- Expanded production security guidance and the release checklist.
- Added `pnpm init:app` so a new copy of the template starts its build record at day zero.
- Added the payments guide and the AI feature guide.
- Moved internal build plans and specs under `docs/maintainers`.
- Added a weekly scheduled production dependency audit.
