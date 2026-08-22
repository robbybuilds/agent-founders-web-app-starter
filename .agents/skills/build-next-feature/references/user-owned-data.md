# User-Owned Data Check

Use this check when a feature stores records that belong to one signed-in user.

## Migration

- Add a non-null `user_id` that references `auth.users(id)` with the intended delete behavior.
- Default `user_id` to `auth.uid()` when that matches the write path.
- Add database constraints for allowed values and length limits.
- Add an index that begins with `user_id` for common user-scoped queries.
- Enable RLS before granting access to authenticated users.

## Policies

Create separate policies for select, insert, update, and delete.

- Select uses `auth.uid() = user_id`.
- Insert uses `with check`.
- Update uses both `using` and `with check`.
- Delete uses `using`.
- Scope policies to the `authenticated` role.

Use `(select auth.uid())` in policies so Postgres can evaluate the identity once per statement.

## Evidence

Add pgTAP coverage proving:

- the owner can complete every allowed operation
- another user reads zero rows
- another user changes zero rows
- another user deletes zero rows

Regenerate `src/types/database.ts`, then run `pnpm db:reset`, `pnpm test:db`, and `pnpm check`.

