"use client";

import { useMemo, useState } from "react";
import { Link } from "@/i18n/Link";
import { plants } from "@/lib/data/plants";
import { animals } from "@/lib/data/animals";
import { BIOMES, type Biome } from "@/types/content";
import { COUNTRY_COORDS } from "@/lib/geo";
import { WorldGlobe } from "@/components/map/WorldGlobe";
import type { MapMarker } from "@/components/map/WorldMap";
import { useLocale, useDictionary } from "@/i18n/use-dictionary";
import { translateSpecies } from "@/i18n/species-translations";
import { getBiomeMeta } from "@/i18n/biome-labels";
import type { Locale } from "@/i18n/config";

type Point = {
  key: string;
  href: string;
  name: string;
  scientificName: string;
  country: string;
  biome: Biome;
  lat: number;
  lon: number;
};

function buildPoints(lang: Locale): Point[] {
  return [
    ...plants.map((p) => {
      const t = translateSpecies(p, lang);
      return {
        key: `plant:${p.slug}`,
        href: `/plants/${p.slug}`,
        name: t.name,
        scientificName: p.scientificName,
        country: t.country,
        biome: p.biome,
        ...(COUNTRY_COORDS[p.country] ?? { lat: 0, lon: 0 }),
      };
    }),
    ...animals.map((a) => {
      const t = translateSpecies(a, lang);
      return {
        key: `animal:${a.slug}`,
        href: `/animals/${a.slug}`,
        name: t.name,
        scientificName: a.scientificName,
        country: t.country,
        biome: a.biome,
        ...(COUNTRY_COORDS[a.country] ?? { lat: 0, lon: 0 }),
      };
    }),
  ];
}

export default function MapPage() {
  const lang = useLocale();
  const d = useDictionary();
  const md = d.map;

  const ALL_POINTS = useMemo(() => buildPoints(lang), [lang]);
  const [activeBiome, setActiveBiome] = useState<Biome | "all">("all");
  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const points = useMemo(
    () => ALL_POINTS.filter((p) => activeBiome === "all" || p.biome === activeBiome),
    [ALL_POINTS, activeBiome]
  );

  const markers: MapMarker[] = points.map((p) => {
    const biome = BIOMES.find((b) => b.id === p.biome)!;
    return {
      lat: p.lat,
      lon: p.lon,
      label: `${p.name} — ${p.country}`,
      color: biome.colorVar,
      href: `/${lang}${p.href}`,
      active: hoverKey === p.key,
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-ink">{md.title}</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">{md.subtitle}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveBiome("all")}
          className={`rounded-[var(--radius-pill)] border px-3 py-1.5 text-sm transition-colors ${
            activeBiome === "all"
              ? "border-pine bg-pine text-white"
              : "border-line text-ink-soft hover:border-pine"
          }`}
        >
          {md.filterAll} ({ALL_POINTS.length})
        </button>
        {BIOMES.map((b) => {
          const count = ALL_POINTS.filter((p) => p.biome === b.id).length;
          return (
            <button
              key={b.id}
              onClick={() => setActiveBiome(b.id)}
              className={`rounded-[var(--radius-pill)] border px-3 py-1.5 text-sm transition-colors ${
                activeBiome === b.id
                  ? "border-pine bg-pine text-white"
                  : "border-line text-ink-soft hover:border-pine"
              }`}
            >
              {getBiomeMeta(b, lang).name} ({count})
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-line">
          <WorldGlobe markers={markers} className="aspect-[2/1] w-full" />
        </div>

        <div className="max-h-[480px] space-y-1.5 overflow-y-auto rounded-[var(--radius-card)] border border-line p-2">
          {points.map((p) => {
            const biome = BIOMES.find((b) => b.id === p.biome)!;
            return (
              <Link
                key={p.key}
                href={p.href}
                onMouseEnter={() => setHoverKey(p.key)}
                onMouseLeave={() => setHoverKey(null)}
                className="flex items-center gap-2 rounded-[var(--radius-card)] px-3 py-2 text-sm hover:bg-canvas-soft"
              >
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: biome.colorVar }}
                />
                <span className="flex-1 truncate text-ink">{p.name}</span>
                <span className="shrink-0 text-xs text-ink-faint">{p.country}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
