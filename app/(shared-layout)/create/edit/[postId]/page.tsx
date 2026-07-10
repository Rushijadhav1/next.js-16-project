import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { getToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { unstable_noStore } from "next/cache";
import CreateBlogForm from "../../CreateBlogForm";
import { Metadata } from "next";

interface EditPostRouteProps {
  params: Promise<{
    postId: Id<"posts">;
  }>;
}

export async function generateMetadata({
  params,
}: EditPostRouteProps): Promise<Metadata> {
  const { postId } = await params;
  const post = await fetchQuery(api.posts.getPostById, { postId });

  if (!post) {
    return { title: "Post not found" };
  }

  return {
    title: `Edit: ${post.title}`,
  };
}

export default async function EditPostRoute({ params }: EditPostRouteProps) {
  unstable_noStore();
  const { postId } = await params;
  const token = await getToken();

  if (!token) {
    redirect("/auth/login");
  }

  const post = await fetchQuery(api.posts.getPostById, { postId }, { token });

  if (!post) {
    return (
      <div className="text-6xl font-extrabold text-red-500 py-20">
        No post found
      </div>
    );
  }

  const currentUser = await fetchQuery(api.presence.getUserId, {}, { token });

  if (!currentUser || currentUser !== post.authorId) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">You can&apos;t edit this post</h2>
        <p className="mt-2 text-muted-foreground">
          You don&apos;t have permission to edit someone else&apos;s post.
        </p>
      </div>
    );
  }

  return <CreateBlogForm mode="edit" initialData={post} />;
}
