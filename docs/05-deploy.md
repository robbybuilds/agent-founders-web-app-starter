# Deploy to Vercel

Deploy after the app works locally and the release checklist passes.

## 1. Prepare Production Convex

Your Convex project has two deployments: the development one that `npx convex dev` uses, and a production one that starts empty. Set up authentication keys on the production deployment once:

```bash
npx @convex-dev/auth --prod
```

Then create a deploy key for Vercel:

1. Open your project on the [Convex dashboard](https://dashboard.convex.dev).
2. Open **Settings**, then **Deploy Keys**, on the production deployment.
3. Generate a deploy key and copy it.

Treat the deploy key like a password. It never goes in code, in `.env.example`, or in browser variables.

## 2. Import the Repository in Vercel

Open Vercel and import your private GitHub repository. Vercel should detect Next.js and pnpm.

Override the **Build Command** with:

```text
npx convex deploy --cmd 'pnpm build'
```

This uploads your schema and functions to production Convex, points the build at the production deployment URL, and then builds the app.

Add one environment variable:

```text
CONVEX_DEPLOY_KEY
```

Paste the deploy key as its value. You do not need to set `NEXT_PUBLIC_CONVEX_URL` in Vercel; the deploy command fills it in during the build.

## 3. Point Convex at Your Site

After the first deploy, tell your production deployment where the app lives:

```bash
npx convex env set SITE_URL https://your-app.vercel.app --prod
```

If you set up password reset emails, also set `AUTH_RESEND_KEY` and `AUTH_EMAIL` on production the same way, with `--prod` at the end.

## 4. Deploy and Test

Open the production URL in a private browser window.

Create a new account, create a project, sign out, and sign back in. Confirm that the same project appears.

Use a second account to confirm it cannot open, update, or delete the first account's project.

Before real users sign up:

1. Verify a sending domain in Resend and set `AUTH_EMAIL`, so password reset emails reach people who are not you.
2. Open the Convex dashboard and read the production logs after your test run. Errors show up there.
3. Turn on MFA for your Convex, GitHub, and Vercel owner accounts.
4. Choose a backup plan that matches the harm you would face if the data disappeared. Convex supports scheduled backups from the dashboard.

Run the complete [release checklist](release-checklist.md) before you give the link to a user.
