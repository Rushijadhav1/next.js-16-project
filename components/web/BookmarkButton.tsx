"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Bookmark, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

interface BookmarkButtonProps {
  postId: Id<"posts">;
}

export function BookmarkButton({ postId }: BookmarkButtonProps) {
  const bookmarkData = useQuery(api.bookmarks.isBookmarked, { postId });
  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);

  if (bookmarkData === undefined) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Loader2 className="size-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      variant={bookmarkData.bookmarked ? "default" : "outline"}
      size="sm"
      onClick={() => {
        void toggleBookmark({ postId });
      }}
    >
      <Bookmark
        className={
          bookmarkData.bookmarked ? "size-4 fill-current" : "size-4"
        }
      />
      <span>{bookmarkData.bookmarked ? "Saved" : "Save"}</span>
    </Button>
  );
}
