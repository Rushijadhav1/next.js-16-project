
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { getToken } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { unstable_noStore } from "next/cache";
import { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";


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

    const data = await fetchQuery(api.posts.getPosts);

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

    return(
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
         {data?.map((post) =>(
            <Card key={post._id} className="pt-0">
                <div className="relative h-48 w-full overflow-hidden">
                    <Image 
                        src={post.imageUrl ?? "https://i.pinimg.com/1200x/17/a3/9b/17a39b21fa1c6bf03aac4dfd17691fa6.jpg"} alt="image" 
                       fill
                       sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                       loading="eager"
                       priority
                       className="rounded-t-lg object-cover"
                       />
                </div>
                <CardContent>
                    <Link href={`/blog/${post._id}`}>
                      <h1 className="text-2xl font-bold hover:text-primary">{post.title}</h1>
                    </Link>
                    <p className="text-muted-foreground line-clamp-3">{post.body}</p>
                </CardContent>
                <CardFooter>
                    <Link className={buttonVariants({
                        className: "w-full"
                    })} href={`/blog/${post._id}`}>
                       Read more
                    </Link>
                </CardFooter>
            </Card>
         ))}
      </div>
    )
}

function SkeletonLoadingUi(){

    return(
<div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
        {[...Array(2)].map((_, i) => <div className="flex flex-col space-y-3" key={i}>
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2 flex flex-col">
            <Skeleton className="h-6 w-3/4"/>
            <Skeleton className="h-4 w-full"/>
            <Skeleton className="h-4 w-2/"/>
          </div>
        </div>
        )}
       </div>
    )
}