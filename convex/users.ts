import {
  getAuthUserId,
  modifyAccountCredentials,
  retrieveAccount,
} from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";

import { internal } from "./_generated/api";
import { action, internalQuery, mutation, query } from "./_generated/server";
import { validatePassword } from "./auth";

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    const user = await ctx.db.get(userId);

    if (user === null) {
      return null;
    }

    return { id: user._id, email: user.email ?? null, name: user.name ?? null };
  },
});

export const viewerEmail = internalQuery({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    const user = await ctx.db.get(userId);
    return user?.email ?? null;
  },
});

export const updateProfile = mutation({
  args: { name: v.union(v.string(), v.null()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new ConvexError("You need to sign in first.");
    }

    const name = args.name?.trim() || undefined;

    if (name && name.length > 80) {
      throw new ConvexError("Use a name of 80 characters or fewer.");
    }

    // Users can only ever update their own record.
    await ctx.db.patch(userId, { name });
  },
});

export const changePassword = action({
  args: { currentPassword: v.string(), newPassword: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new ConvexError("You need to sign in first.");
    }

    const email = await ctx.runQuery(internal.users.viewerEmail, {});

    if (email === null) {
      throw new ConvexError("We could not find your account.");
    }

    validatePassword(args.newPassword);

    try {
      // Throws when the current password does not match.
      await retrieveAccount(ctx, {
        provider: "password",
        account: { id: email, secret: args.currentPassword },
      });
    } catch {
      throw new ConvexError("Your current password did not work.");
    }

    await modifyAccountCredentials(ctx, {
      provider: "password",
      account: { id: email, secret: args.newPassword },
    });
  },
});
