import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const existing = await ctx.db
      .query("likes")
      .withIndex("by_user_post", (q) =>
        q.eq("userId", user._id).eq("postId", args.postId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { liked: false };
    }

    await ctx.db.insert("likes", {
      postId: args.postId,
      userId: user._id,
    });

    return { liked: true };
  },
});

export const getLikesByPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    const user = await authComponent.safeGetAuthUser(ctx);

    const likedByMe = user
      ? likes.some((like) => like.userId === user._id)
      : false;

    return {
      count: likes.length,
      likedByMe,
    };
  },
});

export const getLikeCounts = query({
  args: { postIds: v.array(v.id("posts")) },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    const results: Record<string, { count: number; likedByMe: boolean }> = {};

    for (const postId of args.postIds) {
      const likes = await ctx.db
        .query("likes")
        .withIndex("by_post", (q) => q.eq("postId", postId))
        .collect();

      const likedByMe = user
        ? likes.some((like) => like.userId === user._id)
        : false;

      results[postId] = {
        count: likes.length,
        likedByMe,
      };
    }

    return results;
  },
});
