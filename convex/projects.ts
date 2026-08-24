import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { mutation, query, type QueryCtx } from "./_generated/server";

// Every function in this file decides ownership from the signed-in user on
// the server, never from an argument the browser could fake.

const projectFields = {
  name: v.string(),
  description: v.union(v.string(), v.null()),
  status: v.union(
    v.literal("idea"),
    v.literal("building"),
    v.literal("launched"),
  ),
};

function validateProject(fields: { name: string; description: string | null }) {
  if (fields.name.length < 1 || fields.name.length > 100) {
    throw new ConvexError("Use a project name between 1 and 100 characters.");
  }

  if (fields.description !== null && fields.description.length > 1000) {
    throw new ConvexError("Use a description of 1,000 characters or fewer.");
  }
}

async function requireUserId(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);

  if (userId === null) {
    throw new ConvexError("You need to sign in first.");
  }

  return userId;
}

async function findOwnedProject(
  ctx: QueryCtx,
  userId: Id<"users">,
  id: string,
) {
  const projectId = ctx.db.normalizeId("projects", id);

  if (projectId === null) {
    return null;
  }

  const project = await ctx.db.get(projectId);

  // Returning null for someone else's project keeps it indistinguishable
  // from a project that does not exist.
  if (project === null || project.userId !== userId) {
    return null;
  }

  return project;
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return [];
    }

    return await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    return await findOwnedProject(ctx, userId, args.id);
  },
});

export const create = mutation({
  args: projectFields,
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    validateProject(args);

    return await ctx.db.insert("projects", { ...args, userId });
  },
});

export const update = mutation({
  args: { id: v.string(), ...projectFields },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const { id, ...fields } = args;
    validateProject(fields);

    const project = await findOwnedProject(ctx, userId, id);

    if (project === null) {
      throw new ConvexError(
        "That project was not found or does not belong to you.",
      );
    }

    await ctx.db.patch(project._id, fields);
  },
});

export const remove = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const project = await findOwnedProject(ctx, userId, args.id);

    if (project === null) {
      throw new ConvexError(
        "That project was not found or does not belong to you.",
      );
    }

    await ctx.db.delete(project._id);
  },
});
