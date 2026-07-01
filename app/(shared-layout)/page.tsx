import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, BookOpen, PenLine, Zap, Users } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextPro - Share Your Ideas",
  description:
    "A modern blog platform to read stories, share your thoughts, and connect with other writers.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 py-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/5 to-background px-6 py-20 text-center sm:px-12 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary)_0%,transparent_40%)] opacity-20" />
        <div className="relative mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Share Your Ideas With the World
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground sm:text-xl">
            NextPro is a modern blog platform where you can read stories, share
            your thoughts, and connect with other writers.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
            <Link
              href="/blog"
              className={buttonVariants({ size: "lg" })}
            >
              Explore Blogs
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/create"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Write a Post
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why NextPro?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Everything you need to read, write, and grow your audience in one
            place.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <BookOpen className="size-8 text-primary" />
              <CardTitle>Read Stories</CardTitle>
              <CardDescription>
                Browse a growing collection of articles from creative writers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/blog"
                className={buttonVariants({ variant: "link" })}
              >
                Go to Blog
                <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <PenLine className="size-8 text-primary" />
              <CardTitle>Write Posts</CardTitle>
              <CardDescription>
                Publish your own articles with a clean and simple editor.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/create"
                className={buttonVariants({ variant: "link" })}
              >
                Start Writing
                <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="size-8 text-primary" />
              <CardTitle>Connect</CardTitle>
              <CardDescription>
                Engage with readers through comments and real-time presence.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/blog"
                className={buttonVariants({ variant: "link" })}
              >
                Join the Community
                <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-muted/50 px-6 py-12 text-center sm:px-12">
        <div className="mx-auto max-w-2xl space-y-4">
          <Zap className="mx-auto size-10 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to start writing?
          </h2>
          <p className="text-muted-foreground">
            Create an account, log in, and publish your first post in seconds.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Link href="/auth/sign-up" className={buttonVariants({ size: "lg" })}>
              Get Started
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/auth/login"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Log In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
