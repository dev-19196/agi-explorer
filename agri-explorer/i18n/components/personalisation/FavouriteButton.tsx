"use client";

import { Heart } from "lucide-react";
import { useUserActivity, type FavouriteItem, type SpeciesKind } from "@/lib/hooks/useUserActivity";
import { cn } from "@/lib/utils";
import { useDictionary } from "@/i18n/use-dictionary";

interface FavouriteButtonProps {
  item: Omit<FavouriteItem, "addedAt">;
  size?: "sm" | "md";
  className?: string;
}

export function FavouriteButton({ item, size = "sm", className }: FavouriteButtonProps) {
  const { isFavourite, toggleFavourite, hydrated } = useUserActivity();
  const dict = useDictionary();
  const active = isFavourite(item.slug, item.kind);

  if (!hydrated) {
    // Placeholder đúng kích thước để tránh layout shift
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full",
          size === "sm" ? "size-7" : "size-9",
          className
        )}
      />
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // tránh trigger Link wrapper
        e.stopPropagation();
        toggleFavourite(item);
      }}
      aria-label={
        active
          ? `${dict.favouriteButton.remove} ${item.name}`
          : `${dict.favouriteButton.add} ${item.name} ${dict.favouriteButton.addSuffix}`
      }
      aria-pressed={active}
      className={cn(
        "inline-flex items-center justify-center rounded-full border transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-1",
        size === "sm" ? "size-7" : "size-9",
        active
          ? "border-red-300 bg-red-50 text-red-500 hover:bg-red-100"
          : "border-line bg-canvas-soft/80 text-ink-faint hover:border-red-200 hover:text-red-400",
        className
      )}
    >
      <Heart
        className={cn(
          "transition-all duration-200",
          size === "sm" ? "size-3.5" : "size-4.5",
          active && "fill-current scale-110"
        )}
      />
    </button>
  );
}
