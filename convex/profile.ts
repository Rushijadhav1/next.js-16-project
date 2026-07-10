import { v } from "convex/values";
import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const getUserProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.getAnyUserById(ctx, args.userId);

    if (!user) {
      return null;
    }

    const postCount = await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", args.userId))
      .collect();

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      postCount: postCount.length,
    };
  },
});

export const getCurrentUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      return null;
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  },
});

export const getCurrentUserId = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    return user?._id ?? null;
  },
});
