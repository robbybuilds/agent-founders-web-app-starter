// @vitest-environment edge-runtime

import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";

import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import schema from "@convex/schema";

// These tests prove the ownership rules that every Convex function must
// enforce itself: one user can never read, change, or delete another
// user's records. They replace the database-level RLS tests the Supabase
// version of this starter had.

const modules = import.meta.glob("../../convex/**/*.ts");

async function setup() {
  const t = convexTest(schema, modules);

  const { ownerId, otherId } = await t.run(async (ctx) => {
    return {
      ownerId: await ctx.db.insert("users", {
        email: "owner@example.com",
        name: "Owner",
      }),
      otherId: await ctx.db.insert("users", {
        email: "other@example.com",
        name: "Other",
      }),
    };
  });

  // Convex Auth encodes the signed-in user as `userId|sessionId`.
  const asOwner = t.withIdentity({ subject: `${ownerId}|session1` });
  const asOther = t.withIdentity({ subject: `${otherId}|session2` });

  return { t, ownerId, otherId, asOwner, asOther };
}

async function createOwnerProject(
  asOwner: Awaited<ReturnType<typeof setup>>["asOwner"],
) {
  return await asOwner.mutation(api.projects.create, {
    name: "Private project",
    description: "Owner only",
    status: "idea",
  });
}

describe("project ownership", () => {
  it("assigns every new project to the signed-in user", async () => {
    const { t, ownerId, asOwner } = await setup();
    const projectId = await createOwnerProject(asOwner);

    const project = await t.run(async (ctx) => await ctx.db.get(projectId));
    expect(project?.userId).toBe(ownerId);
  });

  it("lets the owner read, update, and delete their project", async () => {
    const { asOwner } = await setup();
    const projectId = await createOwnerProject(asOwner);

    expect(await asOwner.query(api.projects.list, {})).toHaveLength(1);

    await asOwner.mutation(api.projects.update, {
      id: projectId,
      name: "Private project",
      description: "Owner only",
      status: "building",
    });

    const project = await asOwner.query(api.projects.get, { id: projectId });
    expect(project?.status).toBe("building");

    await asOwner.mutation(api.projects.remove, { id: projectId });
    expect(await asOwner.query(api.projects.list, {})).toHaveLength(0);
  });

  it("hides the project from another user", async () => {
    const { asOwner, asOther } = await setup();
    const projectId = await createOwnerProject(asOwner);

    expect(await asOther.query(api.projects.list, {})).toHaveLength(0);
    expect(await asOther.query(api.projects.get, { id: projectId })).toBeNull();
  });

  it("blocks another user from updating the project", async () => {
    const { asOwner, asOther } = await setup();
    const projectId = await createOwnerProject(asOwner);

    await expect(
      asOther.mutation(api.projects.update, {
        id: projectId,
        name: "Stolen",
        description: null,
        status: "idea",
      }),
    ).rejects.toThrow();

    const project = await asOwner.query(api.projects.get, { id: projectId });
    expect(project?.name).toBe("Private project");
  });

  it("blocks another user from deleting the project", async () => {
    const { asOwner, asOther } = await setup();
    const projectId = await createOwnerProject(asOwner);

    await expect(
      asOther.mutation(api.projects.remove, { id: projectId }),
    ).rejects.toThrow();

    expect(await asOwner.query(api.projects.list, {})).toHaveLength(1);
  });

  it("rejects a signed-out visitor", async () => {
    const { t, asOwner } = await setup();
    const projectId = await createOwnerProject(asOwner);

    expect(await t.query(api.projects.list, {})).toHaveLength(0);
    expect(await t.query(api.projects.get, { id: projectId })).toBeNull();
    await expect(
      t.mutation(api.projects.create, {
        name: "No account",
        description: null,
        status: "idea",
      }),
    ).rejects.toThrow();
  });
});

describe("profile ownership", () => {
  it("only ever updates the signed-in user's own name", async () => {
    const { t, ownerId, otherId, asOther } = await setup();

    await asOther.mutation(api.users.updateProfile, { name: "New Name" });

    const [owner, other] = await t.run(async (ctx) => [
      await ctx.db.get(ownerId as Id<"users">),
      await ctx.db.get(otherId as Id<"users">),
    ]);

    expect(owner?.name).toBe("Owner");
    expect(other?.name).toBe("New Name");
  });
});
