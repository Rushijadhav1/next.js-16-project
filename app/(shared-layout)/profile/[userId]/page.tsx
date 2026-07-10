import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface ProfileRouteProps {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({
  params,
}: ProfileRouteProps): Promise<Metadata> {
  const { userId } = await params;
  const profile = await fetchQuery(api.profile.getUserProfile, { userId });

  if (!profile) {
    return { title: "Profile not found" };
  }

  return {
    title: `${profile.name}'s Profile`,
  };
}

export default async function ProfileRoute({ params }: ProfileRouteProps) {
  const { userId } = await params;

  const profile = await fetchQuery(api.profile.getUserProfile, { userId });

  if (!profile) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">User not found</h2>
        <p className="mt-2 text-muted-foreground">
          This profile doesn&apos;t exist or has been removed.
        </p>
      </div>
    );
  }

  const posts = await fetchQuery(api.posts.getPostsByAuthor, {
    authorId: userId,
  });

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-20 shrink-0">
              <AvatarImage
                src={`https://avatar.vercel.sh/${profile.name}`}
                alt={profile.name.slice(0, 2).toUpperCase()}
              />
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <p className="text-muted-foreground">{profile.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {profile.postCount} {profile.postCount === 1 ? "post" : "posts"}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold tracking-tight">Posts</h2>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
          <h3 className="text-xl font-bold">No posts yet</h3>
          <p className="mt-2 max-w-md text-muted-foreground">
            This user hasn&apos;t published any posts.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
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
                {post.category && (
                  <span className="inline-block mb-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {post.category}
                  </span>
                )}
                <Link href={`/blog/${post._id}`}>
                  <h1 className="text-2xl font-bold hover:text-primary">
                    {post.title}
                  </h1>
                </Link>
                <p className="text-muted-foreground line-clamp-3">{post.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
