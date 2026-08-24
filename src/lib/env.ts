import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_CONVEX_URL: z
    .url("Use your deployment URL, like https://your-deployment.convex.cloud.")
    .refine((value) => !value.includes("|"), {
      message: "This looks like a deploy key. Use the deployment URL here.",
    }),
});

type Environment = Record<string, string | undefined>;

export function readPublicEnv(environment: Environment) {
  const result = publicEnvSchema.safeParse(environment);

  if (!result.success) {
    const variableNames = result.error.issues
      .map((issue) => issue.path.join("."))
      .filter(Boolean)
      .join(", ");

    throw new Error(
      `Your environment setup is incomplete. Check ${variableNames} in .env.local. See docs/01-setup.md for help.`,
    );
  }

  return {
    convexUrl: result.data.NEXT_PUBLIC_CONVEX_URL,
  };
}

export function getPublicEnv() {
  // List each variable by name so Next.js can inline it for the browser.
  return readPublicEnv({
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
  });
}
