# Set Up the Starter

You only need to do this once for each new app.

## What You Need

- a GitHub account
- Node.js 20.9 or newer
- pnpm
- Docker Desktop or another Docker-compatible runtime
- a free Supabase account

Docker runs a private development version of Supabase on your computer. You can skip local Supabase and connect a hosted project, but the local path gives your agent a safer place to test database changes.

## 1. Create Your Repository

Open the private starter on GitHub. Click **Use this template**, choose your account, name the app, and select **Private**.

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

## 3. Start Local Supabase

Make sure Docker is open. Then run:

```bash
pnpm db:start
```

The command prints a local API URL and keys. Keep that terminal output private.

## 4. Add Your Local Environment

Copy `.env.example` to a new file named `.env.local`.

Use the local API URL for `NEXT_PUBLIC_SUPABASE_URL`. Use the local publishable key for `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

The file should look like this with your real local values:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-local-publishable-key
```

Do not commit `.env.local`. Git ignores it on purpose.

## 5. Rebuild the Database

```bash
pnpm db:reset
```

This deletes local development data and rebuilds the database from the migration files. It does not touch a hosted project.

## 6. Start the App

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Create an account and then create a project.

## 7. Check the Setup

Open another terminal in the repository and run:

```bash
pnpm check
pnpm test:db
```

You are ready when both commands pass and your project still appears after a browser refresh.

If a command fails, save the full command and error. Then open [the troubleshooting guide](06-troubleshooting.md).

