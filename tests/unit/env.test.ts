import { describe, expect, it } from "vitest";

import { readPublicEnv } from "@/lib/env";

describe("readPublicEnv", () => {
  it("returns the browser-safe Supabase configuration", () => {
    expect(
      readPublicEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://demo.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_demo",
      }),
    ).toEqual({
      supabaseUrl: "https://demo.supabase.co",
      supabasePublishableKey: "sb_publishable_demo",
    });
  });

  it("explains which variable is missing", () => {
    expect(() =>
      readPublicEnv({
        NEXT_PUBLIC_SUPABASE_URL: "https://demo.supabase.co",
      }),
    ).toThrow("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  });

  it("rejects an invalid Supabase URL", () => {
    expect(() =>
      readPublicEnv({
        NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_demo",
      }),
    ).toThrow("NEXT_PUBLIC_SUPABASE_URL");
  });
});
