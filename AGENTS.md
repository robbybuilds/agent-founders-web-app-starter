<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Founders Starter Rules

## Read First

Before you plan or edit code, read these files in order:

1. `PRODUCT.md`
2. `BUILD.md`
3. `ARCHITECTURE.md`

Use `BUILD.md` as the baton between sessions. Do not infer project state from memory when the file gives you an answer.

## Default Stack

- Next.js App Router
- React Server Components by default
- TypeScript in strict mode
- Tailwind CSS
- shadcn/ui primitives
- Convex for the database, server functions, and authentication
- Convex Auth with the Password provider
- The schema in `convex/schema.ts`
- Vercel
- pnpm

## Architecture Rules

- Read data in Server Components with `fetchQuery` unless the browser needs a live subscription. Use `preloadQuery` plus `usePreloadedQuery` when a component needs live updates.
- Write data through Server Actions that call Convex mutations with `fetchMutation` and the auth token.
- Keep Client Components small and close to the interaction that needs them.
- Use Convex Auth unless `PRODUCT.md` documents a requirement it cannot meet.
- Use Convex directly. Do not add an ORM by default.
- Use Tailwind and existing shadcn primitives before adding another styling system.
- Do not add global state management until local state and server data are insufficient.
- Do not add a second database, backend, auth service, or API abstraction without recording the reason in `ARCHITECTURE.md`.
- Keep dependencies minimal. Explain every new production dependency in the implementation plan.

## Database Rules

- Treat `convex/schema.ts` as the database source of truth. `npx convex dev` applies it to your development deployment while it runs.
- Never make an unrecorded production schema change.
- Enforce ownership inside every Convex function. Read the signed-in user with `getAuthUserId(ctx)` and never trust client arguments for identity.
- Give user-owned tables a `userId` field typed `v.id("users")` and an index that begins with `userId`.
- On every read, return nothing when the record does not belong to the signed-in user. On every write, load the record first and refuse when the owner does not match.
- Validate lengths and allowed values inside the mutation, the way `convex/projects.ts` does.
- Never write to `convex/_generated/`. Convex regenerates it.
- Add `convex-test` coverage in `tests/unit/` proving one user cannot touch another user's records, and run `pnpm test` before calling a database change complete.

## Security Rules

- Never commit secrets or real `.env` files.
- Never use a deploy key or other secret in browser code. Only `NEXT_PUBLIC_CONVEX_URL` is browser-safe.
- Never trust authorization performed only in the browser.
- Never trust a client-supplied user id, email, or role. Identity comes from `ctx.auth` via `getAuthUserId(ctx)` inside the Convex function.
- Verify the signed-in user inside every Convex function that touches user-owned data.
- Treat form fields, URL parameters, uploaded files, and external responses as untrusted input.
- Validate mutation input on the server.
- Do not render unsanitized user HTML.
- Keep privileged work in `internalQuery`, `internalMutation`, and `internalAction` functions that the browser cannot call.
- Use neutral authentication errors that do not reveal whether an account exists.
- Do not remove an ownership check to make a failing query pass.

## Work Process

For each feature:

1. Confirm the requested outcome in `PRODUCT.md`.
2. Read the current task and known decisions in `BUILD.md`.
3. Inspect the existing canonical pattern before inventing a new one.
4. Write or update the implementation plan before a multi-file change.
5. Write a failing test for new behavior.
6. Implement the smallest change that passes.
7. Run focused tests, then `pnpm check`.
8. Update `BUILD.md` with decisions, evidence, and the next exact task.

Stop and ask for a decision when a request conflicts with `PRODUCT.md`, requires a non-default service, changes data ownership, handles payments or sensitive data, or cannot be verified safely.

## Definition of Done

A task is not complete until:

- the user-facing path works
- expected empty, loading, validation, and error states exist
- ownership is enforced inside every Convex function that touches user-owned data
- focused tests pass
- `pnpm lint` passes
- `pnpm typecheck` passes
- `pnpm test` passes
- `pnpm build` passes
- `BUILD.md` records what changed and what comes next

Do not claim success from code inspection alone. Report the commands you ran and any check you could not run.
