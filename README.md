# Agent Founders Web App Starter

I built this starter so you don't have to make fifty technical decisions before you can build the thing you actually care about.

You get a working Next.js app with Supabase authentication, a database, private user data, a real example feature, tests, and a clean path to Vercel. Your coding agent gets a set of rules that keeps it from changing the stack every time you start a new session.

## Start Here

1. Click **Use this template** on GitHub.
2. Choose your account as the owner.
3. Give your app a name and choose **Private**.
4. Open [the setup guide](docs/01-setup.md) and follow it from the top.
5. Come back here when the setup guide says you're done.

When setup is complete, you should be able to create an account, sign in, create a project, and see that project after you refresh the page.

## Build Your App

Open [PRODUCT.md](PRODUCT.md) and replace the starter product with the app you want to build. Then open [the agent guide](docs/03-build-with-your-agent.md) and use the first prompt with your coding agent.

Your agent will read these files before it works:

- [AGENTS.md](AGENTS.md) tells it how to work in this repository.
- [PRODUCT.md](PRODUCT.md) tells it what you're building.
- [BUILD.md](BUILD.md) tells it what has happened and what comes next.
- [ARCHITECTURE.md](ARCHITECTURE.md) records the technical decisions that should stay stable.

You shouldn't have to paste your entire project history into every new conversation. `BUILD.md` carries the important parts forward.

## The Commands You'll Use

`pnpm dev` starts the app on your computer.

`pnpm check` runs the main code checks before you commit or deploy.

`pnpm db:reset` deletes and rebuilds your local development database from the committed migrations. This command destroys local data. It does not touch production unless you change the command.

## Guides

- [Set up the starter](docs/01-setup.md)
- [Shape your product](docs/02-shape-your-product.md)
- [Build with your agent](docs/03-build-with-your-agent.md)
- [Understand the included agent skill](docs/agent-skills.md)
- [Change the database](docs/04-change-the-database.md)
- [Deploy to Vercel](docs/05-deploy.md)
- [Fix common problems](docs/06-troubleshooting.md)
- [Look up an unfamiliar word](docs/glossary.md)
- [Check a release](docs/release-checklist.md)

If something doesn't work, don't start over. Open [the troubleshooting guide](docs/06-troubleshooting.md), save the exact error, and give that evidence to your agent.
