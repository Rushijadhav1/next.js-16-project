"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Edit2, ExternalLink, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { deleteBlogAction } from "@/app/actions";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function DashboardPage() {
  const posts = useQuery(api.posts.getCurrentUserPosts);
  const [isPending, startTransition] = useTransition();

  function handleDelete(postId: Id<"posts">) {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteBlogAction({ postId });
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Post deleted");
      }
    });
  }

  if (posts === undefined) {
    return (
      <div className="py-12 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="text-center mb-5">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Dashboard
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Manage your posts.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
          <h2 className="text-2xl font-bold">No posts yet</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Start writing your first post and share it with the world.
          </p>
          <Link
            href="/create"
            prefetch={false}
            className={buttonVariants({ size: "lg", className: "mt-6" })}
          >
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {posts.map((post) => (
            <Card key={post._id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg">
                      <Link
                        href={`/blog/${post._id}`}
                        className="hover:text-primary"
                      >
                        {post.title}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(post._creationTime).toLocaleDateString("en-US")}
                      {post.category && (
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {post.category}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/blog/${post._id}`}
                      prefetch={false}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "icon-sm",
                      })}
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                    <Link
                      href={`/create/edit/${post._id}`}
                      prefetch={false}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "icon-sm",
                      })}
                    >
                      <Edit2 className="size-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      disabled={isPending}
                      className="inline-flex items-center justify-center size-7 rounded-lg text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
