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

## The App Says an Environment Variable Is Missing

Run `npx convex dev` once. It writes `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` into `.env.local` for you.

If the file exists, confirm that it is named `.env.local`, not `.env.local.txt`. Compare its variable names with `.env.example`.

Restart `pnpm dev` after you change an environment file.

## Sign Up or Sign In Fails Immediately

Confirm that `npx convex dev` is running in another terminal. The app cannot reach your functions when it is not.

If it is running, you probably skipped the authentication keys. Run:

```bash
npx @convex-dev/auth
```

Then try again. The Convex dashboard logs show the exact server error either way.

## Sign In Returns to the Login Page

Check the terminal running Next.js and the logs on the Convex dashboard. Confirm that `NEXT_PUBLIC_CONVEX_URL` in `.env.local` matches your development deployment.

Do not fix this by removing the protected route check.

## A Query Returns Nothing

Confirm that the user is signed in. Then look at the function in the `convex` folder and the record's `userId` on the Convex dashboard. A record that belongs to a different user is supposed to come back empty.

Do not remove the ownership check to make the query work. Add a test in `tests/unit` that reproduces the expected access before changing the function.

## The Schema Push Fails

Read the error in the `npx convex dev` terminal. It names the exact document that does not fit the new schema. Fix the schema or that data on the dashboard. Do not loosen a field type just to silence the error.

## No Password Reset Email Arrives

Sending email needs `AUTH_RESEND_KEY` on your Convex deployment. The optional section at the end of [the setup guide](01-setup.md) shows how to set it.

With a key set, remember that Resend's test sender only delivers to your own address until you verify a domain.

## The Production Build Fails

Run `pnpm build` on your computer. Fix the first error in the output, then run it again. Later errors can be side effects of the first one.
