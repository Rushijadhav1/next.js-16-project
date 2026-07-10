import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const toggleBookmark = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_post", (q) =>
        q.eq("userId", user._id).eq("postId", args.postId)
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { bookmarked: false };
    }

    await ctx.db.insert("bookmarks", {
      postId: args.postId,
      userId: user._id,
    });

    return { bookmarked: true };
  },
});

export const isBookmarked = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      return { bookmarked: false };
    }

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_post", (q) =>
        q.eq("userId", user._id).eq("postId", args.postId)
      )
      .first();

    return { bookmarked: !!existing };
  },
});

export const getBookmarksByUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      return [];
    }

    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    return await Promise.all(
      bookmarks.map(async (bookmark) => {
        const post = await ctx.db.get(bookmark.postId);

        if (!post) {
          return null;
        }

        const resolvedImageUrl =
          post.imageStorageId !== undefined
            ? await ctx.storage.getUrl(post.imageStorageId)
            : null;

        return {
          ...post,
          imageUrl: resolvedImageUrl,
        };
      })
    ).then((results) => results.filter((r) => r !== null));
  },
});
