"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface LikeButtonProps {
  postId: Id<"posts">;
}

export function LikeButton({ postId }: LikeButtonProps) {
  const likeData = useQuery(api.likes.getLikesByPost, { postId });
  const toggleLike = useMutation(api.likes.toggleLike);

  if (likeData === undefined) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Loader2 className="size-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      variant={likeData.likedByMe ? "default" : "outline"}
      size="sm"
      onClick={() => {
        void toggleLike({ postId }).catch((err: unknown) => {
          const message =
            err instanceof Error ? err.message : "Failed to toggle like";
          toast.error(message);
        });
      }}
    >
      <Heart
        className={
          likeData.likedByMe ? "size-4 fill-current" : "size-4"
        }
      />
      <span>{likeData.count}</span>
    </Button>
  );
}
