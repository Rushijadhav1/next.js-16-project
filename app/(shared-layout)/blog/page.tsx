import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { getToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { unstable_noStore } from "next/cache";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BlogListClient } from "@/components/web/BlogListClient";

export const metadata: Metadata = {
  title: 'My Blog',
  description: 'Read over latest articales and insights',
  category: 'Web devlopment',
  authors:  [{name: 'Rushikesh jadhav'}]
}

export default async function BlogPage() {
  unstable_noStore();
  const token = await getToken();
  if (!token) {
    redirect("/auth/login");
  }
  return (
    <div className="py-12">  
      <div className="text-center  mb-5">
         <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Our Blog</h1>
         <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">Insights, thoughts, and trends from our team.</p>
      </div>

      <Suspense fallback={<SkeletonLoadingUi />}>
        <LoadBlogList />
      </Suspense> 
    </div>
  );
}


async function LoadBlogList(){
    const [data, categories] = await Promise.all([
      fetchQuery(api.posts.getPosts),
      fetchQuery(api.posts.getCategories),
    ]);

    if (!data || data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
          <h2 className="text-2xl font-bold">No posts yet</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Be the first to share your thoughts! Create a post and it will show up here.
          </p>
          <Link
            href="/create"
            prefetch={false}
            className={buttonVariants({ size: "lg", className: "mt-6" })}
          >
            Create Your First Post
          </Link>
        </div>
      );
    }

    return <BlogListClient posts={data} categories={categories} />
}

function SkeletonLoadingUi(){
    return(
<div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
        {[...Array(2)].map((_, i) => (
          <div className="flex flex-col space-y-3" key={i}>
            <Skeleton className="h-48 w-full rounded-xl" />
            <div className="space-y-2 flex flex-col">
              <Skeleton className="h-6 w-3/4"/>
              <Skeleton className="h-4 w-full"/>
              <Skeleton className="h-4 w-2/3"/>
            </div>
          </div>
        ))}
       </div>
    )
}
