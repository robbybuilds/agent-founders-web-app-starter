# Fix Common Problems

Do not start over when a command fails. Save the evidence first.

Give your agent:

- the command you ran
- the complete error message
- what you expected
- what happened instead
- the last change that worked

## `pnpm` Is Missing

Run:

```bash
corepack enable pnpm
```

Then close and reopen the terminal.

## Supabase Will Not Start

Open Docker and wait until it finishes starting. Then run `pnpm db:start` again.

If the port is already in use, run `pnpm db:stop` and then `pnpm db:start`.

## The App Says an Environment Variable Is Missing

Confirm that the file is named `.env.local`, not `.env.local.txt`. Compare its variable names with `.env.example`.

Restart `pnpm dev` after you change an environment file.

## Sign In Returns to the Login Page

Check the terminal running Next.js and the Supabase Auth logs. Confirm that your site URL and redirect URLs match the address in your browser.

Do not fix this by removing the protected route check.

## A Database Query Returns No Rows

Confirm that the user is signed in. Then inspect the RLS policy and the row's `user_id`.

Do not disable RLS to make the query work. Add a database test that reproduces the expected access before changing the policy.

## The Production Build Fails

Run `pnpm build` on your computer. Fix the first error in the output, then run it again. Later errors can be side effects of the first one.

