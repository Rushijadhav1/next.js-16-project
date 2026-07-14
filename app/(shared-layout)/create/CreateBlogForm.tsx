"use client";
import { createBlogAction, updateBlogAction } from "@/app/actions";
import { postSchema, editPostSchema, CATEGORIES } from "@/app/schemas/blog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@base-ui/react/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Id } from "@/convex/_generated/dataModel";

interface InitialPostData {
  _id: Id<"posts">;
  title: string;
  body: string;
  category?: string;
}

interface CreateBlogFormProps {
  mode?: "create" | "edit";
  initialData?: InitialPostData;
}

export default function CreateBlogForm({
  mode = "create",
  initialData,
}: CreateBlogFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isEditMode = mode === "edit" && initialData;

  const form = useForm({
    resolver: zodResolver(isEditMode ? editPostSchema : postSchema),
    defaultValues: {
      content: initialData?.body ?? "",
      title: initialData?.title ?? "",
      image: undefined,
      category: initialData?.category ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof editPostSchema>) {
    startTransition(async () => {
      if (isEditMode) {
        const result = await updateBlogAction(initialData!._id, values);
        if (result?.error) {
          return;
        }
      } else {
        const result = await createBlogAction(
          values as z.infer<typeof postSchema>
        );
        if (result?.error) {
          return;
        }
        router.push("/blog");
      }
    });
  }

  return (
    <div className="py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {isEditMode ? "Edit Post" : "Create Post"}
        </h1>
        <p className="text-xl text-muted-foreground pt-4">
          {isEditMode ? "Update Your Thoughts" : "Share Your Thoughts With The Big World"}
        </p>
      </div>
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditMode ? "Edit Blog Article" : "Create Blog Article"}</CardTitle>
          <CardDescription>
            {isEditMode ? "Update your blog article" : "Create a new blog article"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-4">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <input
                      aria-invalid={fieldState.invalid}
                      placeholder="super cool title"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error ?? undefined]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea
                      aria-invalid={fieldState.invalid}
                      placeholder="super cool blog content"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error ?? undefined]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Category</FieldLabel>
                    <select
                      aria-invalid={fieldState.invalid}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || undefined)}
                    >
                      <option value="">Select a category (optional)</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error ?? undefined]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>
                      {isEditMode
                        ? "New Image (leave empty to keep current)"
                        : "Image"}
                    </FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="super cool blog content"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        field.onChange(file);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error ?? undefined]} />
                    )}
                  </Field>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>{isEditMode ? "Update Post" : "Create Post"}</span>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
