import { Id } from "@/convex/_generated/dataModel";
import z from 'zod'

export const postSchema = z.object({
    title: z.string().min(3).max(50),
    content: z.string().min(10),
    image: z.instanceof(File),
    category: z.string().optional(),
});

export const editPostSchema = z.object({
    title: z.string().min(3).max(50),
    content: z.string().min(10),
    image: z.instanceof(File).optional(),
    category: z.string().optional(),
});

export const deletePostSchema = z.object({
    postId: z.custom<Id<'posts'>>(),
});

export const CATEGORIES = [
    "Technology",
    "Lifestyle",
    "Travel",
    "Food",
    "Business",
] as const;

export type Category = typeof CATEGORIES[number];
