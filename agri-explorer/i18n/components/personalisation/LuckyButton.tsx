"use client";

import { Shuffle } from "lucide-react";
import { getRandomSpecies } from "@/lib/search";
import { useState } from "react";
import { useLocaleRouter } from "@/i18n/useLocaleRouter";
import { useDictionary } from "@/i18n/use-dictionary";
import { cn } from "@/lib/utils";

interface LuckyButtonProps {
  className?: string;
  variant?: "default" | "ghost";
}

export function LuckyButton({ className, variant = "default" }: LuckyButtonProps) {
  const router = useLocaleRouter();
  const dict = useDictionary();
  const [spinning, setSpinning] = useState(false);

  const handleClick = () => {
    if (spinning) return;
    setSpinning(true);

    // Hiệu ứng ngắn rồi navigate
    setTimeout(() => {
      const species = getRandomSpecies();
      const href =
        species.kind === "plant"
          ? `/plants/${species.slug}`
          : `/animals/${species.slug}`;
      router.push(href);
      setSpinning(false);
    }, 400);
  };

  return (
    <button
      onClick={handleClick}
      disabled={spinning}
      aria-label={dict.hero.luckyButtonAria}
      className={cn(
        "group flex items-center gap-2 rounded-[var(--radius-pill)] px-4 py-2 text-sm font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine focus-visible:ring-offset-2",
        variant === "default"
          ? "border border-line bg-canvas-soft text-ink-soft hover:border-pine hover:text-pine"
          : "text-ink-faint hover:text-pine",
        spinning && "opacity-60",
        className
      )}
    >
      <Shuffle
        className={cn(
          "size-4 transition-transform duration-300",
          spinning ? "animate-spin" : "group-hover:rotate-180"
        )}
      />
      {spinning ? dict.hero.luckyButtonLoading : dict.hero.luckyButton}
    </button>
  );
}
