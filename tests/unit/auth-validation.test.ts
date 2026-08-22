import { describe, expect, it } from "vitest";

import {
  emailSchema,
  loginSchema,
  passwordSchema,
  safeRedirectPath,
  signupSchema,
} from "@/lib/validation/auth";

describe("authentication validation", () => {
  it("normalizes an email address", () => {
    expect(emailSchema.parse("  Builder@Example.COM ")).toBe(
      "builder@example.com",
    );
  });

  it("requires passwords with at least eight characters", () => {
    expect(passwordSchema.safeParse("short").success).toBe(false);
    expect(passwordSchema.safeParse("long-enough").success).toBe(true);
  });

  it("requires both login fields", () => {
    expect(loginSchema.safeParse({ email: "", password: "" }).success).toBe(
      false,
    );
  });

  it("trims the signup display name", () => {
    const result = signupSchema.parse({
      displayName: "  Ada Builder  ",
      email: "ada@example.com",
      password: "long-enough",
    });

    expect(result.displayName).toBe("Ada Builder");
  });
});

describe("safeRedirectPath", () => {
  it("allows a local application path", () => {
    expect(safeRedirectPath("/projects/new")).toBe("/projects/new");
  });

  it("rejects absolute and protocol-relative URLs", () => {
    expect(safeRedirectPath("https://example.com/steal")).toBe("/dashboard");
    expect(safeRedirectPath("//example.com/steal")).toBe("/dashboard");
  });
});
