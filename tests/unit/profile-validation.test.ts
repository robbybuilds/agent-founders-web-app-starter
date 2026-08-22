import { describe, expect, it } from "vitest";

import { profileSchema } from "@/lib/validation/profile";

describe("profileSchema", () => {
  it("trims a display name", () => {
    expect(profileSchema.parse({ displayName: "  Rob Builder  " })).toEqual({
      displayName: "Rob Builder",
    });
  });

  it("allows a user to clear a display name", () => {
    expect(profileSchema.parse({ displayName: "   " })).toEqual({
      displayName: null,
    });
  });

  it("rejects display names longer than eighty characters", () => {
    expect(
      profileSchema.safeParse({ displayName: "x".repeat(81) }).success,
    ).toBe(false);
  });
});
