# Change the Database

The file `convex/schema.ts` is the official record of your database. The functions in the `convex` folder are the only way the app reads and writes it.

## Add a Change

Open `convex/schema.ts`. Add the table, field, or index there. Follow the `projects` table as the pattern: user-owned tables get a `userId` field and an index that starts with `userId`.

If `npx convex dev` is running, it applies the schema to your development deployment as soon as you save. If it is not running, start it:

```bash
pnpm db:dev
```

Convex checks your existing data against the new schema. If the two disagree, the terminal tells you exactly which document does not fit. Fix the schema or the data; do not loosen a field type just to silence the error.

## Add the Ownership Rules

A schema change usually comes with new or changed functions. Every function that touches user-owned data must:

1. Read the signed-in user with `getAuthUserId(ctx)`.
2. Refuse to read, change, or delete a record whose `userId` does not match.
3. Validate lengths and allowed values before writing.

`convex/projects.ts` shows the complete pattern.

## Prove It With Tests

Add or update the ownership tests in `tests/unit/projects-access.test.ts`, or a new test file next to it for a new table. The tests must prove:

- the owner can complete every allowed operation
- another user reads nothing
- another user changes nothing
- another user deletes nothing

Then run:

```bash
pnpm test
pnpm check
```

Commit the schema, the functions, and the tests together.

## Send a Change to Production

Production gets your schema and functions when you deploy. The deploy command in [the deployment guide](05-deploy.md) runs `npx convex deploy`, which uploads the `convex` folder to your production deployment.

There is no separate migration step. If a change needs existing production data reshaped, ask your agent to write a one-time [Convex migration function](https://docs.convex.dev/database/advanced/schema-philosophy) and review the plan before running it.
