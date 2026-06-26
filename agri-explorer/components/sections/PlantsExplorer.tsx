"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { plants } from "@/lib/data/plants";
import { PlantCard } from "@/components/cards/PlantCard";
import { Input } from "@/components/ui/input";
import { BIOMES, type Biome } from "@/types/content";
import type { PlantCategory } from "@/types/content";
import { useLocale, useDictionary } from "@/i18n/use-dictionary";
import { getBiomeMeta } from "@/i18n/biome-labels";

export function PlantsExplorer() {
  const lang = useLocale();
  const dict = useDictionary();

  const PLANT_GROUPS: { label: string; value: PlantCategory }[] = [
    { label: dict.plantsExplorer.groups.fruit, value: "fruit" },
    { label: dict.plantsExplorer.groups.vegetable, value: "vegetable" },
    { label: dict.plantsExplorer.groups.herbal, value: "herbal" },
    { label: dict.plantsExplorer.groups.industrial, value: "industrial" },
  ];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<PlantCategory | "all">("all");
  const [biome, setBiome] = useState<Biome | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return plants.filter((p) => {
      const matchesQuery =
        q.length === 0 ||
        p.name.toLowerCase().includes(q) ||
        p.scientificName.toLowerCase().includes(q);
      const matchesCategory = category === "all" || p.category === category;
      const matchesBiome = biome === "all" || p.biome === biome;
      return matchesQuery && matchesCategory && matchesBiome;
    });
  }, [query, category, biome]);

  const hasActiveFilters = category !== "all" || biome !== "all" || query.length > 0;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-8">
        <div>
          <h2 className="font-display text-sm text-ink-faint">{dict.plantsExplorer.categoryHeading}</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <button
                onClick={() => setCategory("all")}
                className={`text-sm transition-colors ${
                  category === "all" ? "font-medium text-pine" : "text-ink-soft hover:text-pine"
                }`}
              >
                {dict.common.all}
              </button>
            </li>
            {PLANT_GROUPS.map((g) => (
              <li key={g.value}>
                <button
                  onClick={() => setCategory(g.value)}
                  className={`text-sm transition-colors ${
                    category === g.value ? "font-medium text-pine" : "text-ink-soft hover:text-pine"
                  }`}
                >
                  {g.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm text-ink-faint">{dict.plantsExplorer.biomeHeading}</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <button
                onClick={() => setBiome("all")}
                className={`text-sm transition-colors ${
                  biome === "all" ? "font-medium text-pine" : "text-ink-soft hover:text-pine"
                }`}
              >
                {dict.common.all}
              </button>
            </li>
            {BIOMES.map((b) => (
              <li key={b.id}>
                <button
                  onClick={() => setBiome(b.id)}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    biome === b.id ? "font-medium text-pine" : "text-ink-soft hover:text-pine"
                  }`}
                >
                  <span className="size-1.5 rounded-full" style={{ background: b.colorVar }} />
                  {getBiomeMeta(b, lang).name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-48 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={dict.plantsExplorer.searchPlaceholder}
              className="pl-9"
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setQuery("");
                setCategory("all");
                setBiome("all");
              }}
              className="text-sm text-ink-faint underline hover:text-pine"
            >
              {dict.common.clearFilters}
            </button>
          )}
          <p className="text-sm text-ink-faint">{filtered.length} {dict.common.resultsCount}</p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((plant) => (
              <PlantCard key={plant.slug} plant={plant} lang={lang} />
            ))}
          </div>
        ) : (
          <p className="rounded-[var(--radius-card)] border border-dashed border-line p-8 text-center text-sm text-ink-faint">
            {dict.plantsExplorer.noResults}
          </p>
        )}
      </div>
    </div>
  );
}
