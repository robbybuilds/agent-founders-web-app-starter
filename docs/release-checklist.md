# Release Checklist

## Product

- [ ] The release matches `PRODUCT.md`.
- [ ] A first-time user can complete the main outcome.
- [ ] Empty, loading, validation, error, and success states make sense.
- [ ] Mobile and desktop layouts work without overlap or horizontal scrolling.

## Data and Access

- [ ] Every schema change is committed in `convex/schema.ts`.
- [ ] Every Convex function that touches user-owned data enforces ownership from `ctx.auth`.
- [ ] Cross-user ownership tests pass in `pnpm test`.
- [ ] No production seed data will be applied.
- [ ] A backup or recovery plan matches the importance of the data.

## Authentication

- [ ] `SITE_URL` on production Convex matches the deployed site.
- [ ] Sign up, sign in, sign out, password reset, and password update work.
- [ ] Protected routes reject signed-out users.
- [ ] Authentication errors do not reveal whether an account exists.
- [ ] Password reset email uses a verified Resend domain, or you accept that reset is unavailable at launch.

## Code

- [ ] `pnpm install --frozen-lockfile` passes.
- [ ] `pnpm policy` passes.
- [ ] `pnpm lint` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm test` passes.
- [ ] `pnpm build` passes.
- [ ] `pnpm audit --prod --audit-level=high` reports no known high-severity production vulnerabilities.
- [ ] No secret or real environment file is committed.

## Production

- [ ] Vercel builds with `npx convex deploy --cmd 'pnpm build'` and a production deploy key.
- [ ] GitHub, Convex, and Vercel owner accounts use MFA.
- [ ] The production deployment has the committed schema and functions.
- [ ] The main path passes in a private browser window.
- [ ] A second test user cannot access the first user's records.
- [ ] `BUILD.md` records the release commit and remaining risks.
