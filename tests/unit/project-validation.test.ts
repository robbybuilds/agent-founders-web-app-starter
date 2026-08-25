import { describe, expect, it } from "vitest";

import { projectIdSchema, projectSchema } from "@/lib/validation/project";

describe("projectSchema", () => {
  it("normalizes a valid project", () => {
    expect(
      projectSchema.parse({
        name: "  First app  ",
        description: "  A small useful thing.  ",
        status: "building",
      }),
    ).toEqual({
      name: "First app",
      description: "A small useful thing.",
      status: "building",
    });
  });

  it("turns an empty description into null", () => {
    expect(
      projectSchema.parse({ name: "First app", description: "", status: "idea" })
        .description,
    ).toBeNull();
  });

  it("rejects unknown statuses and long names", () => {
    expect(
      projectSchema.safeParse({ name: "x".repeat(101), status: "paused" })
        .success,
    ).toBe(false);
  });
});

describe("projectIdSchema", () => {
  it("accepts a Convex id and rejects a path fragment", () => {
    expect(
      projectIdSchema.safeParse("jd73kvbnq0kz9wmfp1xk2a4qhx7m8t2e").success,
    ).toBe(true);
    expect(projectIdSchema.safeParse("../another-user").success).toBe(false);
  });
});
