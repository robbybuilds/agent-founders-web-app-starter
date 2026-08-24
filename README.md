# Agent Founders Web App Starter

I built this starter so you don't have to make fifty technical decisions before you can build the thing you actually care about.

You get a working Next.js app with Convex authentication, a database, private user data, a real example feature, tests, and a clean path to Vercel. Your coding agent gets a set of rules that keeps it from changing the stack every time you start a new session.

## Start Here

1. Click **Use this template** on GitHub.
2. Choose your account as the owner.
3. Give your app a name and choose **Private**.
4. Open [the setup guide](docs/01-setup.md) and follow it from the top.
5. Come back here when the setup guide says you're done.

When setup is complete, you should be able to create an account, sign in, create a project, and see that project after you refresh the page.

## Build Your App

First, run this once:

```bash
pnpm init:app
```

It resets `BUILD.md` and `CHANGELOG.md` so your build record starts at your day zero instead of the starter's history. Your agent reads `BUILD.md` to know where the project stands, so it should describe your app, not this template.

Then open [PRODUCT.md](PRODUCT.md) and replace the starter product with the app you want to build. Then open [the agent guide](docs/03-build-with-your-agent.md) and use the first prompt with your coding agent.

Or start a fresh session with your coding agent and paste this whole prompt:

```text
You are my coding partner inside this repository. I am a first-time builder, so keep me oriented and explain important decisions in plain language.

Before you edit code, install anything, or change the database:

1. Read AGENTS.md, PRODUCT.md, BUILD.md, and ARCHITECTURE.md in that order.
2. Inspect the repository and the existing Projects feature.
3. Tell me what already works, what stage the build is in, and the next exact task.
4. Tell me what you need from me before you can continue.

If PRODUCT.md still describes Project Desk, help me replace it with my product. Ask me one question at a time about the person I want to help, the problem they have, and the smallest useful result I can ship. Do not start building until I approve the new PRODUCT.md.

Before each feature, show me a small plan. Name the files you expect to change, any database changes, the tests you will write first, and any decision that could affect cost, security, or the product. Wait for my approval before you implement the plan.

Follow the existing stack and patterns. Do not add another database, auth provider, ORM, state library, or paid service unless PRODUCT.md requires it and I approve it. Never expose a secret or deploy key. Enforce ownership inside every Convex function and never trust client arguments for identity. Validate untrusted input on the server. Keep user-owned data protected in the Convex functions, not only in the interface.

Work on one approved task at a time. Run focused tests while you work and run pnpm check before you call a task complete. If the database changes, update convex/schema.ts and the ownership tests together.

Start now by reading the four files and reporting what you found. Do not write code yet.
```

Your agent will read these files before it works:

- [AGENTS.md](AGENTS.md) tells it how to work in this repository.
- [PRODUCT.md](PRODUCT.md) tells it what you're building.
- [BUILD.md](BUILD.md) tells it what has happened and what comes next.
- [ARCHITECTURE.md](ARCHITECTURE.md) records the technical decisions that should stay stable.

You shouldn't have to paste your entire project history into every new conversation. `BUILD.md` carries the important parts forward.

## The Commands You'll Use

`pnpm dev` starts the app on your computer.

`pnpm db:dev` runs `npx convex dev`, which syncs your database schema and functions to your Convex development deployment while you work. Keep it running in a second terminal.

`pnpm check` runs the main code checks before you commit or deploy.

## Guides

- [Set up the starter](docs/01-setup.md)
- [Shape your product](docs/02-shape-your-product.md)
- [Build with your agent](docs/03-build-with-your-agent.md)
- [Understand the included agent skill](docs/agent-skills.md)
- [Change the database](docs/04-change-the-database.md)
- [Deploy to Vercel](docs/05-deploy.md)
- [Add payments when you're ready to charge](docs/07-add-payments.md)
- [Add an AI feature safely](docs/08-add-ai.md)
- [Fix common problems](docs/06-troubleshooting.md)
- [Look up an unfamiliar word](docs/glossary.md)
- [Check a release](docs/release-checklist.md)

If something doesn't work, don't start over. Open [the troubleshooting guide](docs/06-troubleshooting.md), save the exact error, and give that evidence to your agent.
