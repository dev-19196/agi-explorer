"use client";

import { useState } from "react";
import { Search, Leaf, PawPrint, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LuckyButton } from "@/components/personalisation/LuckyButton";
import { useLocaleRouter } from "@/i18n/useLocaleRouter";
import { useDictionary } from "@/i18n/use-dictionary";
import { cn } from "@/lib/utils";

export function HeroSearch() {
  const router = useLocaleRouter();
  const dict = useDictionary();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"plants" | "animals" | "media" | null>(null);

  const SCOPES = [
    { id: "plants" as const, label: dict.hero.scopePlants, icon: Leaf },
    { id: "animals" as const, label: dict.hero.scopeAnimals, icon: PawPrint },
    { id: "media" as const, label: dict.hero.scopeMedia, icon: ImageIcon },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ q: query });
    if (scope) params.set("scope", scope);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="w-full max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-[var(--radius-pill)] bg-canvas/95 p-2 shadow-card backdrop-blur"
      >
        <Search className="ml-3 size-5 shrink-0 text-ink-faint" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.hero.searchPlaceholder}
          className="h-11 border-none bg-transparent px-1 shadow-none focus-visible:border-none"
          aria-label={dict.nav.search}
        />
        <Button type="submit" size="md" className="shrink-0">
          {dict.hero.searchButton}
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {SCOPES.map(({ id, label, icon: Icon }) => {
          const active = scope === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setScope(active ? null : id)}
              aria-pressed={active}
              className={cn(
                "flex items-center gap-1.5 rounded-[var(--radius-pill)] border px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-honey bg-honey text-ink"
                  : "border-canvas/30 text-canvas/90 hover:border-honey hover:text-honey"
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          );
        })}
        <LuckyButton className="border-canvas/30 text-canvas/90 hover:border-honey hover:text-honey bg-transparent" />
      </div>
    </div>
  );
}
