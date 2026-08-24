# User-Owned Data Check

Use this check when a feature stores records that belong to one signed-in user.

## Schema

- Add the table to `convex/schema.ts` with a `userId` field typed `v.id("users")`.
- Add an index that begins with `userId` for common user-scoped queries.
- Use `v.union` of `v.literal` values for fields with a fixed set of allowed values.

## Function Rules

Ownership is enforced inside every Convex function, not in the schema. Never trust client arguments for identity.

- Read the signed-in user with `getAuthUserId(ctx)` at the top of every function.
- Queries filter with the `userId` index and return nothing for other users' records. Return `null` for a single record that does not exist or belongs to someone else, so both cases look identical.
- Creates take no `userId` argument. The function assigns the signed-in user as the owner.
- Updates and deletes load the record first and refuse when its `userId` does not match the signed-in user.
- Validate lengths and allowed values inside the mutation before writing.
- Keep functions the browser must not call in `internalQuery`, `internalMutation`, or `internalAction`.

`convex/projects.ts` is the canonical example of all of this.

## Evidence

Add `convex-test` coverage in `tests/unit/` proving:

- the owner can complete every allowed operation
- another user reads nothing
- another user changes nothing
- another user deletes nothing

`tests/unit/projects-access.test.ts` is the pattern. Then run `pnpm test` and `pnpm check`.
