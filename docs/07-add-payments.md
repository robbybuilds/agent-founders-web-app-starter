# Add Payments

The starter ships without payment code on purpose. Most first releases should prove that someone wants the product before they can pay for it. When you are ready to charge, this guide gives you and your agent the safe path.

Read this whole page once before you ask your agent to build billing. Payments are the one feature where a quiet mistake costs real money.

## The Shape That Works

Use Stripe Checkout and a webhook. Do not build your own card form.

1. Your app sends the signed-in user to a Stripe Checkout page.
2. Stripe collects the payment and manages the subscription.
3. Stripe calls a webhook route in your app when something changes.
4. The webhook writes the subscription state into your database.
5. Your app reads entitlement from your database, never from the browser.

Stripe stays the source of truth for money. Your database stays the source of truth for what a user is allowed to do right now.

## Before You Build

- Create a Stripe account and stay in **test mode** until the end.
- Create one product with one price. Resist launching with tiers.
- Store `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` on your Convex deployment with `npx convex env set`. They are secrets. They never appear in browser code, never start with `NEXT_PUBLIC_`, and never go in a commit.
- Have the Convex functions that use a key fail loudly with a clear error when it is missing, instead of quietly at checkout.

## The Database Part

Add a `subscriptions` table to `convex/schema.ts` (see [Change the Database](04-change-the-database.md)):

- `userId` typed `v.id("users")`, with an index on it
- `stripeCustomerId` and `stripeSubscriptionId`
- `status` (for example `active`, `past_due`, `canceled`)
- `currentPeriodEnd`

Follow the same ownership pattern as `convex/projects.ts` for reading: a public query returns **only the signed-in user's own row**. Do not write any public mutation for this table — only the webhook, through an `internalMutation` the browser cannot call, may write subscription state. A user who can edit their own subscription row can give themselves a free upgrade.

Add `convex-test` tests that prove a user cannot read or change another user's subscription, the same way `tests/unit/projects-access.test.ts` proves it for projects.

## The Webhook Part

The webhook is a Convex `httpAction` registered in `convex/http.ts`, and it is the only writer. Rules that are not optional:

- Verify the Stripe signature on every request before trusting the payload. An unverified webhook is an open endpoint that edits your billing table.
- Handle the same event arriving twice. Stripe retries. Writes must be safe to repeat.
- Return a success response quickly and keep the handler small.
- Log the event id, never the full payload, so you can debug without storing card metadata you do not need.

## The Checkout Part

Create the Checkout session in a Convex action. Read the signed-in user with `getAuthUserId(ctx)` first, pass that user id in the session metadata so the webhook can find them, and send the user to the URL Stripe returns.

## What to Ask Your Agent

Paste this to start the feature:

```text
Read AGENTS.md, PRODUCT.md, BUILD.md, and docs/07-add-payments.md. I want to add payments following that guide exactly: Stripe Checkout, a signature-verified webhook httpAction, and a subscriptions table where users can only read their own row and only the webhook writes. Show me the plan first — files, schema change, tests, and the entitlement check — before you build anything.
```

## Before You Go Live

- Test the full loop in test mode: subscribe, cancel, and let a payment fail with Stripe's test cards.
- Confirm the webhook works on your deployed URL, not just your laptop.
- Swap in live keys with `npx convex env set` on production, never through a commit.
- Read your country's rules on tax and receipts, or use Stripe Tax. This guide is not legal advice.
