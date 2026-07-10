"use server";

import z from "zod";
import { postSchema, editPostSchema, deletePostSchema } from "./schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "../lib/auth-server";
import { revalidatePath } from "next/cache";
import { Id } from "@/convex/_generated/dataModel";

export async function createBlogAction(values: z.infer<typeof postSchema>) {
    try {
        const parsed = postSchema.safeParse(values);

        if (!parsed.success) {
            throw new Error("something went wrong");
        }

        const token = await getToken();

        const imageUrl = await fetchMutation(
            api.posts.generateImageUploadUrl,
            {},
            { token }
        );

        const uploadResult = await fetch(imageUrl, {
            method: "POST",
            headers: {
                "Content-Type": parsed.data.image.type,
            },
            body: parsed.data.image,
        });

        if (!uploadResult.ok) {
            return {
                error: "Failed to upload image",
            };
        }

        const { storageId } = await uploadResult.json();
        await fetchMutation(
            api.posts.createPost,
            {
                body: parsed.data.content,
                title: parsed.data.title,
                imageStorageId: storageId,
                category: parsed.data.category,
            },
            { token }
        );
    } catch {
        return {
            error: "Failed to create post",
        };
    }
    revalidatePath("/blog");
    return redirect("/blog");
}

export async function updateBlogAction(
    postId: Id<"posts">,
    values: z.infer<typeof editPostSchema>
) {
    try {
        const parsed = editPostSchema.safeParse(values);

        if (!parsed.success) {
            throw new Error("Invalid input");
        }

        const token = await getToken();
        if (!token) {
            return { error: "Not authenticated" };
        }

        let imageStorageId: Id<"_storage"> | undefined;

        if (parsed.data.image) {
            const uploadUrl = await fetchMutation(
                api.posts.generateImageUploadUrl,
                {},
                { token }
            );

            const uploadResult = await fetch(uploadUrl, {
                method: "POST",
                headers: {
                    "Content-Type": parsed.data.image.type,
                },
                body: parsed.data.image,
            });

            if (!uploadResult.ok) {
                return { error: "Failed to upload image" };
            }

            const { storageId } = await uploadResult.json();
            imageStorageId = storageId as Id<"_storage">;
        }

        await fetchMutation(
            api.posts.updatePost,
            {
                postId,
                title: parsed.data.title,
                body: parsed.data.content,
                category: parsed.data.category,
                imageStorageId,
            },
            { token }
        );
    } catch {
        return { error: "Failed to update post" };
    }

    revalidatePath("/blog");
    revalidatePath(`/blog/${postId}`);
    redirect("/blog");
}

export async function deleteBlogAction(values: z.infer<typeof deletePostSchema>) {
    try {
        const parsed = deletePostSchema.safeParse(values);

        if (!parsed.success) {
            throw new Error("Invalid input");
        }

        const token = await getToken();
        if (!token) {
            return { error: "Not authenticated" };
        }

        await fetchMutation(
            api.posts.deletePost,
            { postId: parsed.data.postId },
            { token }
        );
    } catch {
        return { error: "Failed to delete post" };
    }

    revalidatePath("/blog");
    revalidatePath("/dashboard");
    redirect("/dashboard");
}
