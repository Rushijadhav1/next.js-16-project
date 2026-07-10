import { buttonVariants } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/web/CommentSection";
import { Metadata } from "next";
import { PostPresence } from "@/components/web/PostPresence";
import { getToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { LikeButton } from "@/components/web/LikeButton";
import { BookmarkButton } from "@/components/web/BookmarkButton";


interface PostIdRouteProps {
  params: Promise<{
    postId: Id<"posts">;
  }>;
}

export async function generateMetadata({
  params,
}: PostIdRouteProps): Promise<Metadata> {
  const { postId } = await params;

  const post = await fetchQuery(api.posts.getPostById, { postId: postId });

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.body,
  };
}

export default async function PostIdRoute({ params }: PostIdRouteProps) {
  const { postId } = await params;
  const token = await getToken();

  const [post, preloadedComments, userId] = await Promise.all([
    await fetchQuery(api.posts.getPostById, { postId: postId }),
    await preloadQuery(api.comments.getCommentsByPost, {
      postId: postId,
    }),
    await fetchQuery(api.presence.getUserId, {}, { token }),
  ]);

  if(!userId) {
    return redirect("/auth/login" )
  }

  if (!post) {
    return (
      <div className="text-6xl font-extrabold text-red-500 py-20">
        No post found
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        className={buttonVariants({ variant: "outline", className: "mb-4" })}
        href="/blog"
      >
        <ArrowLeft />
        Back to blog
      </Link>

      <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={
            post.imageUrl ??
            "https://i.pinimg.com/1200x/17/a3/9b/17a39b21fa1c6bf03aac4dfd17691fa6.jpg"
          }
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          loading="eager"
          priority
          className="object-cover"
        />
      </div>
      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-xl text-muted-foreground">
            Posted on:{" "}
            {new Date(post._creationTime).toLocaleDateString("en-US")}
          </p>
          {post.category && (
            <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
              {post.category}
            </span>
          )}
          {userId && <PostPresence roomId={post._id} userId={userId} />}
        </div>
        <div className="flex items-center gap-2">
          <LikeButton postId={post._id} />
          <BookmarkButton postId={post._id} />
        </div>
      </div>

      <Separator className="my-8" />
      <p className="text-lg leading-relaxed text-foreground/80 whitespace-pre">
        {post.body}
      </p>
      <Separator className="my-8" />

      <CommentSection preloadedComments={preloadedComments} />
    </div>
  );
}
