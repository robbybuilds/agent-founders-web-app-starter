# Change the Database

The migration files are the official record of your database.

## Add a Change

Create a migration:

```bash
pnpm supabase migration new describe_the_change
```

Open the new SQL file in `supabase/migrations`. Add the table, column, constraint, index, and RLS policy changes there.

Rebuild the local database:

```bash
pnpm db:reset
```

This command deletes local data. Read the command before you approve an agent running it.

Run the database tests:

```bash
pnpm test:db
```

Regenerate the TypeScript database types:

```bash
pnpm db:types
```

Then run `pnpm check` and commit the migration, tests, and generated types together.

## Send a Change to Hosted Supabase

Link the repository to the correct Supabase project once:

```bash
pnpm supabase link --project-ref YOUR_PROJECT_REF
```

Preview pending migrations:

```bash
pnpm supabase db push --dry-run
```

Read the output. If it matches the migration you intended, apply it:

```bash
pnpm supabase db push
```

Never run a linked reset against production. A linked reset deletes production data.

