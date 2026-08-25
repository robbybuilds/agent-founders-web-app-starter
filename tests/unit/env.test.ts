import { describe, expect, it } from "vitest";

import { readPublicEnv } from "@/lib/env";

describe("readPublicEnv", () => {
  it("returns the browser-safe Convex configuration", () => {
    expect(
      readPublicEnv({
        NEXT_PUBLIC_CONVEX_URL: "https://demo.convex.cloud",
      }),
    ).toEqual({
      convexUrl: "https://demo.convex.cloud",
    });
  });

  it("explains which variable is missing", () => {
    expect(() => readPublicEnv({})).toThrow("NEXT_PUBLIC_CONVEX_URL");
  });

  it("rejects an invalid Convex URL", () => {
    expect(() =>
      readPublicEnv({
        NEXT_PUBLIC_CONVEX_URL: "not-a-url",
      }),
    ).toThrow("NEXT_PUBLIC_CONVEX_URL");
  });

  it("rejects a deploy key in browser-visible configuration", () => {
    expect(() =>
      readPublicEnv({
        NEXT_PUBLIC_CONVEX_URL: "https://demo.convex.cloud|do-not-expose-this",
      }),
    ).toThrow("NEXT_PUBLIC_CONVEX_URL");
  });
});
