import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// `authTables` includes the `users` table. The user's display name lives
// there as `name`, so this app does not need a separate profiles table.
export default defineSchema({
  ...authTables,
  projects: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.union(v.string(), v.null()),
    status: v.union(
      v.literal("idea"),
      v.literal("building"),
      v.literal("launched"),
    ),
  }).index("by_user", ["userId"]),
});
