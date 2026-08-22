# Deploy to Vercel

Deploy after the app works locally and the release checklist passes.

## 1. Create Hosted Supabase

Create a Supabase project. Save its project URL and publishable key.

Link your local repository to the project. Preview and push your migrations using the commands in [the database guide](04-change-the-database.md).

In Supabase Auth settings, add your production site URL. Add `http://localhost:3000` as a local redirect URL.

## 2. Import the Repository in Vercel

Open Vercel and import your private GitHub repository. Vercel should detect Next.js and pnpm.

Add these environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Use the hosted Supabase values, not the local values.

## 3. Deploy and Test

Deploy the app. Open the production URL in a private browser window.

Create a new account, confirm the email if confirmation is enabled, create a project, sign out, and sign back in. Confirm that the same project appears.

Run the complete [release checklist](release-checklist.md) before you give the link to a user.

