import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";
import { Doc, Id } from "./_generated/dataModel";

// Create a new task with the given text
export const createPost = mutation({
  args: {
    title: v.string(),
    body: v.string(),
    imageStorageId: v.id("_storage"),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if(!user) {
        throw new ConvexError('Not authenticated')
    }

    const blogArticale = await ctx.db.insert("posts", { 
        body: args.body,
        title: args.title,
        authorId: user._id,
        imageStorageId: args.imageStorageId,
        category: args.category,
     });
    
     return blogArticale;
  },
});

export const getPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();

    return await Promise.all(
      posts.map(async (post) => {
        const resolvedImageUrl =
          post.imageStorageId !== undefined
            ? await ctx.storage.getUrl(post.imageStorageId)
            : null;

        return {
          ...post,
          imageUrl: resolvedImageUrl,
        };
      })
    );
  },
});

export const getPostsByAuthor = query({
  args: { authorId: v.string() },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .order("desc")
      .collect();

    return await Promise.all(
      posts.map(async (post) => {
        const resolvedImageUrl =
          post.imageStorageId !== undefined
            ? await ctx.storage.getUrl(post.imageStorageId)
            : null;

        return {
          ...post,
          imageUrl: resolvedImageUrl,
        };
      })
    );
  },
});

export const getCurrentUserPosts = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      return [];
    }

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", user._id))
      .order("desc")
      .collect();

    return await Promise.all(
      posts.map(async (post) => {
        const resolvedImageUrl =
          post.imageStorageId !== undefined
            ? await ctx.storage.getUrl(post.imageStorageId)
            : null;

        return {
          ...post,
          imageUrl: resolvedImageUrl,
        };
      })
    );
  },
});

export const getPostsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .collect();

    return await Promise.all(
      posts.map(async (post) => {
        const resolvedImageUrl =
          post.imageStorageId !== undefined
            ? await ctx.storage.getUrl(post.imageStorageId)
            : null;

        return {
          ...post,
          imageUrl: resolvedImageUrl,
        };
      })
    );
  },
});

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").collect();
    const categoryMap = new Map<string, number>();

    for (const post of posts) {
      if (post.category) {
        categoryMap.set(post.category, (categoryMap.get(post.category) ?? 0) + 1);
      }
    }

    return Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
    }));
  },
});

export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if(!user) {
        throw new ConvexError('Not authenticated')
    }

    return await ctx.storage.generateUploadUrl();
  }
})

// function async(post: any): (value: { _id: import("convex/values").GenericId<"posts">; _creationTime: number; imageStorageId?: import("convex/values").GenericId<"_storage"> | undefined; title: string; body: string; authorId: string; }, index: number, array: { _id: import("convex/values").GenericId<"posts">; _creationTime: number; imageStorageId?: import("convex/values").GenericId<"_storage"> | undefined; title: string; body: string; authorId: string; }[]) => unknown {
//   throw new Error("Function not implemented.");
// }

 export const getPostById = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async(ctx, args) => {
    const post = await ctx.db.get(args.postId);

     if(!post){
         return null;
     }

    const resolvedImageUrl = 
        post?.imageStorageId !== undefined
         ? await ctx.storage.getUrl(post.imageStorageId)
         : null;

         return {
          ...post,
          imageUrl: resolvedImageUrl,
          
         }
  }
 })

interface SearchResultType {
  _id: Id<"posts">;
  title: string;
  body: string;
}
export const searchPosts = query({
  args: {
    term: v.string(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const { limit } = args;

    const results: Array<SearchResultType> = [];
    const seen = new Set<Id<"posts">>();

    const pushDocs = (docs: Array<Doc<"posts">>) => {
      for (const doc of docs) {
        if (seen.has(doc._id)) continue;

        seen.add(doc._id);
        results.push({
          _id: doc._id,
          title: doc.title,
          body: doc.body,
        });
        if (results.length >= limit) break;
      }
    };
    const titleMatchs = await ctx.db.query("posts").withSearchIndex('search_title', (q) => q.search("title", args.term))
    .take(limit);


    await pushDocs(titleMatchs);

    if (results.length < limit) {
      const bodyMatches = await ctx.db.query("posts").withSearchIndex('search_body', (q) => q.search("body", args.term))
      .take(limit);

      await pushDocs(bodyMatches);
    }

    return results;
  },
 })

export const updatePost = mutation({
  args: {
    postId: v.id("posts"),
    title: v.string(),
    body: v.string(),
    category: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new ConvexError("Post not found");
    }

    if (post.authorId !== user._id) {
      throw new ConvexError("You do not have permission to edit this post");
    }

    const updates: { title: string; body: string; category?: string; imageStorageId?: Id<"_storage"> } = {
      title: args.title,
      body: args.body,
      category: args.category,
    };

    if (args.imageStorageId !== undefined) {
      if (post.imageStorageId !== undefined) {
        await ctx.storage.delete(post.imageStorageId);
      }
      updates.imageStorageId = args.imageStorageId;
    }

    await ctx.db.patch(args.postId, updates);
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      throw new ConvexError("Not authenticated");
    }

    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new ConvexError("Post not found");
    }

    if (post.authorId !== user._id) {
      throw new ConvexError("You do not have permission to delete this post");
    }

    const comments = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .collect();

    await Promise.all(comments.map((comment) => ctx.db.delete(comment._id)));

    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    await Promise.all(likes.map((like) => ctx.db.delete(like._id)));

    const bookmarks = await ctx.db
      .query("bookmarks")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .collect();

    await Promise.all(bookmarks.map((bookmark) => ctx.db.delete(bookmark._id)));

    if (post.imageStorageId !== undefined) {
      await ctx.storage.delete(post.imageStorageId);
    }

    await ctx.db.delete(args.postId);
  },
});