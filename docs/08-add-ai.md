# Add an AI Feature

The starter ships without AI code on purpose, for the same reason it ships without payments: the pattern matters more than the boilerplate, and the wrong pattern leaks your API key or your users' data.

When your product needs an AI feature — summarize a note, draft a reply, extract fields from pasted text — this is the safe shape.

## The Rules That Keep You Safe

- The AI call happens **on the server**, in a Server Action or Route Handler. Never in browser code.
- The API key lives in `.env.local` as `ANTHROPIC_API_KEY`. It is a secret. It never starts with `NEXT_PUBLIC_` and never appears in a Client Component.
- User text going into a prompt is untrusted input. Validate it on the server with zod like every other mutation in this starter, and set a length limit.
- Model output is also untrusted. Render it as text. Do not execute it, do not render it as HTML, and do not let it decide what data to fetch.
- Verify the signed-in user before running the call, exactly like the Projects actions do. AI calls cost money per request — an unauthenticated AI route is a free API key for strangers.

## Setup

Install the official SDK:

```bash
pnpm add @anthropic-ai/sdk
```

Add `ANTHROPIC_API_KEY` to `.env.local`, add a placeholder line to `.env.example`, and extend the server environment validation in `src/lib/env.ts` so a missing key fails at startup.

## The Server Action Shape

This mirrors the existing Projects actions: verify the user, validate input, do the work, return typed state.

```ts
"use server";

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const inputSchema = z.object({
  text: z.string().min(1).max(8000),
});

export async function summarizeText(formData: FormData) {
  // 1. Verify the signed-in user, the same way projects/actions.ts does.
  // 2. Validate the input.
  const parsed = inputSchema.safeParse({ text: formData.get("text") });
  if (!parsed.success) {
    return { error: "Paste some text first (8,000 characters max)." };
  }

  // 3. Call Claude on the server. The client reads ANTHROPIC_API_KEY itself.
  const client = new Anthropic();
  const response = await client.messages.create({
    model: "claude-opus-5",
    max_tokens: 1024,
    system: "Summarize the user's text in three plain sentences.",
    messages: [{ role: "user", content: parsed.data.text }],
  });

  // 4. Read text blocks only. Never assume the shape of the response.
  const summary = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  return { summary };
}
```

Wrap the API call in a try/catch and return a plain failure message the user can act on. Rate-limit errors and timeouts are normal events, not emergencies.

## Costs

Every call costs money and the bill scales with your users. Before you ship an AI feature:

- Set a spending limit in the Claude Console so a bug cannot surprise you.
- Keep `max_tokens` as small as the feature allows.
- Decide who pays: if the feature is expensive and your app is free, you are the one funding it.

## What to Ask Your Agent

```text
Read AGENTS.md, PRODUCT.md, BUILD.md, and docs/08-add-ai.md. I want to add an AI feature following that guide exactly: a Server Action that verifies the user, validates input with zod, calls the Claude API with the official SDK, and treats the output as untrusted text. Show me the plan and the tests before you build.
```

## What Not to Do

- Do not stream the raw API response through an unauthenticated route.
- Do not put the key in a Client Component "just to test."
- Do not let the model's output flow into a database query, a shell command, or `dangerouslySetInnerHTML`.
- Do not add an AI framework or wrapper library by default. The official SDK and a Server Action cover the first ten features you will build.
