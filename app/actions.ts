"use server";

import z from "zod";
import { postSchema } from "./schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "../lib/auth-server";
export async function createBlogAction(values: z.infer<typeof postSchema>) {
 
    const parsed = postSchema.safeParse(values);

    if (!parsed.success){
        throw new Error("something went wrong")
    }

    const token = await getToken();

    await fetchMutation(api.posts.createPost,{
      body:parsed.data.content,
      title: parsed.data.title,
    },{token});

    return redirect('/');
}
