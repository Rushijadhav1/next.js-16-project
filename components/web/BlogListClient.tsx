"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CategoryFilter } from "./CategoryFilter";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

interface PostItem {
  _id: string;
  title: string;
  body: string;
  category?: string;
  imageUrl: string | null;
  _creationTime: number;
}

interface BlogListClientProps {
  posts: PostItem[];
  categories: Array<{ category: string; count: number }>;
}

export function BlogListClient({ posts, categories }: BlogListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return posts;
    return posts.filter((post) => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  if (filteredPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
        <h2 className="text-2xl font-bold">No posts in this category</h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          Try selecting a different category or create a new post.
        </p>
        <Link
          href="/create"
          prefetch={false}
          className={buttonVariants({ size: "lg", className: "mt-6" })}
        >
          Create a Post
        </Link>
      </div>
    );
  }

  return (
    <>
      <CategoryFilter
        categories={categories}
        onFilterChange={setSelectedCategory}
      />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
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
              <div className="flex items-center gap-2 mb-2">
                {post.category && (
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {post.category}
                  </span>
                )}
              </div>
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
    </>
  );
}
