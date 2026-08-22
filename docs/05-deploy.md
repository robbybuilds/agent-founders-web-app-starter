# Deploy to Vercel

Deploy after the app works locally and the release checklist passes.

## 1. Create Hosted Supabase

Create a Supabase project. Save its project URL and publishable key.

Link your local repository to the project. Preview and push your migrations using the commands in [the database guide](04-change-the-database.md).

In Supabase Auth settings, keep email confirmations on and enable secure password changes. Add your production site URL. Add `http://localhost:3000` as a local redirect URL.

Before real users sign up:

1. Configure custom SMTP for authentication emails. Supabase's built-in sender is for testing and has strict delivery limits. Keep the SMTP password in Supabase, not in this repository.
2. Review **Authentication**, then **Rate Limits**. Choose limits that fit your launch.
3. Decide whether public signup needs CAPTCHA. If you enable it, have your agent add and test the matching CAPTCHA field in the signup, login, and reset forms.
4. Open Supabase's Security Advisor and resolve every warning you understand. Ask for help before applying a suggested change you do not understand.
5. Turn on MFA for your Supabase and GitHub owner accounts.
6. Choose a backup plan that matches the harm you would face if the data disappeared.

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

Use a second account to confirm it cannot open, update, or delete the first account's project.

Run the complete [release checklist](release-checklist.md) before you give the link to a user.
