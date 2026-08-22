# Release Checklist

## Product

- [ ] The release matches `PRODUCT.md`.
- [ ] A first-time user can complete the main outcome.
- [ ] Empty, loading, validation, error, and success states make sense.
- [ ] Mobile and desktop layouts work without overlap or horizontal scrolling.

## Data and Access

- [ ] Every new schema change exists in a committed migration.
- [ ] Every exposed user-owned table has RLS enabled.
- [ ] Cross-user database tests pass.
- [ ] No production seed data will be applied.
- [ ] A backup or recovery plan matches the importance of the data.

## Authentication

- [ ] Site and redirect URLs match production.
- [ ] Sign up, confirmation, sign in, sign out, recovery, and password update work.
- [ ] Protected routes reject signed-out users.
- [ ] Authentication errors do not reveal whether an account exists.

## Code

- [ ] `pnpm install --frozen-lockfile` passes.
- [ ] `pnpm lint` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm test` passes.
- [ ] `pnpm test:db` passes.
- [ ] `pnpm build` passes.
- [ ] No secret or real environment file is committed.

## Production

- [ ] Vercel uses the hosted Supabase URL and publishable key.
- [ ] The production database has all committed migrations.
- [ ] The main path passes in a private browser window.
- [ ] A second test user cannot access the first user's records.
- [ ] `BUILD.md` records the release commit and remaining risks.

