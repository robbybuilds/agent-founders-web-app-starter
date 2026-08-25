# Set Up the Starter

You only need to do this once for each new app.

## What You Need

- a GitHub account
- Node.js 20.9 or newer
- pnpm
- a free [Convex](https://convex.dev) account

Convex hosts your database and authentication. It gives every app a free development deployment in the cloud, so there is nothing to install or run on your computer beyond the app itself.

## 1. Create Your Repository

Open the starter on GitHub. Click **Use this template**, choose your account, name the app, and select **Private**.

Clone the new repository to your computer. GitHub Desktop is fine if you do not want to use the terminal.

## 2. Install the App

Open a terminal in the repository and run:

```bash
pnpm install
```

If your computer says `pnpm` does not exist, run:

```bash
corepack enable pnpm
```

Then run `pnpm install` again.

## 3. Connect Convex

Run:

```bash
npx convex dev
```

The first run opens your browser so you can sign in to Convex and create a project. Say yes to creating a new project and give it your app's name.

The command then does three things for you:

- creates a development deployment in your Convex account
- writes `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` into `.env.local`
- uploads the database schema and functions from the `convex` folder

Leave this command running. It watches the `convex` folder and re-uploads your changes while you work.

Do not commit `.env.local`. Git ignores it on purpose.

## 4. Set Up Authentication Keys

Open a second terminal in the repository and run this once:

```bash
npx @convex-dev/auth
```

It generates the signing keys that Convex Auth uses for sessions and stores them on your development deployment. If it asks about files that already exist, keep the existing files.

## 5. Start the App

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Create an account and then create a project.

## 6. Check the Setup

Open another terminal in the repository and run:

```bash
pnpm check
```

You are ready when the command passes and your project still appears after a browser refresh.

If a command fails, save the full command and error. Then open [the troubleshooting guide](06-troubleshooting.md).

## Optional: Password Reset Emails

The "Forgot password?" flow emails an 8-digit code. Sending email needs a free [Resend](https://resend.com) account. You can skip this until you have real users.

When you are ready, create a Resend API key and store it on your Convex deployment:

```bash
npx convex env set AUTH_RESEND_KEY your-resend-api-key
```

Resend's built-in test address only emails you. Before other people can reset passwords, verify a domain in Resend and set the sender:

```bash
npx convex env set AUTH_EMAIL "Your App <hello@yourdomain.com>"
```
