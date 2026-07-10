import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema( {
  posts: defineTable({
    title: v.string(),
    body: v.string(),
    authorId: v.string(),
    category: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
  })
    .searchIndex("search_title", { searchField: "title" })
    .searchIndex("search_body", { searchField: "body" })
    .index("by_author", ["authorId"])
    .index("by_category", ["category"]),
  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.string(),
    autherName: v.string(),
    body: v.string(),
  }),
  likes: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
  })
    .index("by_post", ["postId"])
    .index("by_user_post", ["userId", "postId"]),
  bookmarks: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_post", ["userId", "postId"]),
});
