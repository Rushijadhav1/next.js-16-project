"use client";

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
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const editProfileSchema = z.object({
  name: z.string().min(3).max(30),
});

interface ProfileEditFormProps {
  initialName: string;
}

export function ProfileEditForm({ initialName }: ProfileEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: initialName,
    },
  });

  function onSubmit(values: z.infer<typeof editProfileSchema>) {
    startTransition(async () => {
      try {
        const { error } = await authClient.updateUser({
          name: values.name,
        });

        if (error) {
          throw new Error(error.message);
        }

        toast.success("Profile updated");
        router.push("/dashboard");
        router.refresh();
      } catch {
        toast.error("Failed to update profile");
      }
    });
  }

  return (
    <div className="py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Edit Profile
        </h1>
        <p className="text-xl text-muted-foreground pt-4">
          Update your display name
        </p>
      </div>
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Your Profile</CardTitle>
          <CardDescription>Change your display name</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    <input
                      aria-invalid={fieldState.invalid}
                      placeholder="Your name"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
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
                  <span>Save Changes</span>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
