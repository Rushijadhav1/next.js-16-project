"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

export default function SearchInput() {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useQuery(
    api.posts.searchPosts,
    term.length >= 2 ? { limit: 5, term } : "skip"
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTerm(e.target.value);
    setOpen(true);
  }

  function handleResultClick() {
    setTerm("");
    setOpen(false);
  }

  const showResults = open && term.length >= 2;

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          placeholder="Search posts..."
          className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          value={term}
          onChange={handleInputChange}
          onFocus={() => term.length >= 2 && setOpen(true)}
          aria-label="Search posts"
        />
      </div>

      {showResults && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          {results === undefined ? (
            <div className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Searching...
            </div>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground text-center">
              No results found
            </p>
          ) : (
            <div className="flex flex-col">
              {results.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post._id}`}
                  onClick={handleResultClick}
                  className="rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <p className="font-medium truncate">{post.title}</p>
                  <p className="line-clamp-1 text-xs text-muted-foreground pt-1">
                    {post.body.substring(0, 60)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
