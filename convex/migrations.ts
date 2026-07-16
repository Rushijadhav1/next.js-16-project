import { internalMutation } from "./_generated/server";

export const renameCommentAuthorField = internalMutation({
  args: {},
  handler: async (ctx) => {
    const comments = await ctx.db.query("comments").collect();
    let migrated = 0;

    for (const comment of comments) {
      const doc = comment as unknown as {
        autherName?: string;
        authorName?: string;
      };

      if (typeof doc.autherName === "string") {
        const patch: Record<string, string | undefined> = {};
        if (typeof doc.authorName !== "string") {
          patch.authorName = doc.autherName;
        }
        patch.autherName = undefined;
        await ctx.db.patch(comment._id, patch as never);
        migrated++;
      }
    }

    return { total: comments.length, migrated };
  },
});

export const getCommentStats = internalMutation({
  args: {},
  handler: async (ctx) => {
    const comments = await ctx.db.query("comments").collect();
    let withOldField = 0;
    let withNewField = 0;

    for (const comment of comments) {
      const doc = comment as unknown as {
        autherName?: string;
        authorName?: string;
      };
      if (typeof doc.autherName === "string") withOldField++;
      if (typeof doc.authorName === "string") withNewField++;
    }

    return {
      total: comments.length,
      withOldAutherNameField: withOldField,
      withNewAuthorNameField: withNewField,
    };
  },
});
