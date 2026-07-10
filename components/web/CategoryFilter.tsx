"use client";

import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/app/schemas/blog";
import { useState } from "react";

interface CategoryFilterProps {
  categories: Array<{ category: string; count: number }>;
  onFilterChange?: (category: string | null) => void;
}

export function CategoryFilter({
  categories,
  onFilterChange,
}: CategoryFilterProps) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleClick(category: string | null) {
    setSelected(category);
    onFilterChange?.(category);
  }

  const availableCategories = CATEGORIES.filter((cat) =>
    categories.some((c) => c.category === cat)
  );

  if (availableCategories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8 justify-center">
      <button
        onClick={() => handleClick(null)}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          selected === null
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
      >
        All
      </button>
      {availableCategories.map((cat) => {
        const catData = categories.find((c) => c.category === cat);
        return (
          <button
            key={cat}
            onClick={() => handleClick(cat)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              selected === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {cat}
            {catData && (
              <span className="ml-1 text-xs opacity-70">({catData.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
