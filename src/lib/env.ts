import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1)
    .refine((key) => !key.startsWith("sb_secret_"), {
      message: "Use a publishable key here, never a secret key.",
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
    supabaseUrl: result.data.NEXT_PUBLIC_SUPABASE_URL,
    supabasePublishableKey:
      result.data.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  };
}

export function getPublicEnv() {
  return readPublicEnv(process.env);
}
