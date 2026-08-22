<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next.js code. Follow deprecation notices.

This block is written and re-added by `next dev`. Keep it committed so the working tree stays clean.

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
- Supabase for Postgres, Auth, Storage, and Realtime
- SQL migrations in `supabase/migrations`
- Vercel
- pnpm

## Architecture Rules

- Read data in Server Components unless the browser needs a live subscription.
- Write data through Server Actions or Route Handlers.
- Keep Client Components small and close to the interaction that needs them.
- Use Supabase Auth unless `PRODUCT.md` documents a requirement it cannot meet.
- Use Supabase directly. Do not add an ORM by default.
- Use Tailwind and existing shadcn primitives before adding another styling system.
- Do not add global state management until local state and server data are insufficient.
- Do not add a second database, backend, auth service, or API abstraction without recording the reason in `ARCHITECTURE.md`.
- Keep dependencies minimal. Explain every new production dependency in the implementation plan.

## Database Rules

- Treat committed migrations as the database source of truth.
- Never make an unrecorded production schema change.
- Enable RLS on every table exposed through the Supabase Data API.
- Add explicit select, insert, update, and delete policies for user-owned tables.
- Use `with check` for insert and update ownership rules.
- Add database constraints for facts the database can enforce.
- Regenerate `src/types/database.ts` after schema changes.
- Run `pnpm db:reset` and `pnpm test:db` before calling a database change complete.
- Never run `supabase db reset --linked` against production.

## Security Rules

- Never commit secrets or real `.env` files.
- Never use a secret or service-role key in browser code.
- Never trust authorization performed only in the browser.
- Verify the signed-in user on the server for protected operations.
- Treat form fields, URL parameters, uploaded files, and external responses as untrusted input.
- Validate mutation input on the server.
- Do not render unsanitized user HTML.
- Use neutral authentication errors that do not reveal whether an account exists.
- Do not weaken an RLS policy to make a failing query pass.

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
- access control is enforced at the database when data is user-owned
- focused tests pass
- `pnpm lint` passes
- `pnpm typecheck` passes
- `pnpm test` passes
- `pnpm build` passes
- `BUILD.md` records what changed and what comes next

Do not claim success from code inspection alone. Report the commands you ran and any check you could not run.
