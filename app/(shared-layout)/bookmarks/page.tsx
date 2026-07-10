"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark } from "lucide-react";

export default function BookmarksPage() {
  const data = useQuery(api.bookmarks.getBookmarksByUser);

  return (
    <div className="py-12">
      <div className="text-center mb-5">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Saved Posts
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Posts you&apos;ve bookmarked to read later.
        </p>
      </div>

      {data === undefined ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
          <Bookmark className="size-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold">No bookmarks yet</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Bookmark posts while reading and they&apos;ll appear here for easy
            access.
          </p>
          <Link
            href="/blog"
            prefetch={false}
            className={buttonVariants({ size: "lg", className: "mt-6" })}
          >
            Browse Blog
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.map((post) => (
            <Card key={post._id} className="pt-0">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={
                    post.imageUrl ??
                    "https://i.pinimg.com/1200x/17/a3/9b/17a39b21fa1c6bf03aac4dfd17691fa6.jpg"
                  }
                  alt="image"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="eager"
                  priority
                  className="rounded-t-lg object-cover"
                />
              </div>
              <CardContent>
                <Link href={`/blog/${post._id}`}>
                  <h1 className="text-2xl font-bold hover:text-primary">
                    {post.title}
                  </h1>
                </Link>
                <p className="text-muted-foreground line-clamp-3">{post.body}</p>
              </CardContent>
              <CardFooter>
                <Link
                  className={buttonVariants({ className: "w-full" })}
                  href={`/blog/${post._id}`}
                >
                  Read more
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
