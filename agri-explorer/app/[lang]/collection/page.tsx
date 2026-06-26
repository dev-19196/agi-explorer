"use client";

import { Link } from "@/i18n/Link";
import { Heart, Clock, Sparkles, BookMarked } from "lucide-react";
import { useUserActivity } from "@/lib/hooks/useUserActivity";
import { plants } from "@/lib/data/plants";
import { animals } from "@/lib/data/animals";
import { BIOMES, type Biome } from "@/types/content";
import { SpecimenPlate } from "@/components/cards/SpecimenPlate";
import { FavouriteButton } from "@/components/personalisation/FavouriteButton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { useDictionary } from "@/i18n/use-dictionary";

// ─── Mini card ────────────────────────────────────────────────────────────────

function MiniCard({
  slug,
  kind,
  name,
  scientificName,
  biome,
  category,
  label,
}: {
  slug: string;
  kind: "plant" | "animal";
  name: string;
  scientificName: string;
  biome: string;
  category?: string;
  label?: string;
}) {
  const biomeMeta = BIOMES.find((b) => b.id === biome);
  const href = `/${kind === "plant" ? "plants" : "animals"}/${slug}`;

  const cover =
    kind === "plant"
      ? plants.find((p) => p.slug === slug)?.detail?.gallery.find((g) => g.kind === "image")?.url
      : animals.find((a) => a.slug === slug)?.detail?.gallery.find((g) => g.kind === "image")?.url;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-canvas-soft shadow-card transition-transform duration-200 hover:-translate-y-0.5">
      <Link href={href} className="block">
        {cover ? (
          <img src={cover} alt={name} loading="lazy" className="aspect-[4/3] w-full object-cover" />
        ) : (
          <SpecimenPlate
            biome={biome as Biome}
            icon={kind === "plant" ? "plant" : "animal"}
            className="aspect-[4/3] w-full"
          />
        )}
        <div className="flex flex-col gap-1.5 p-3">
          {biomeMeta && (
            <Badge variant="biome" dotColor={biomeMeta.colorVar} className="self-start text-[10px]">
              {biomeMeta.name}
            </Badge>
          )}
          <p className="font-display text-sm leading-snug text-ink">{name}</p>
          <p className="font-display text-xs italic text-ink-faint">{scientificName}</p>
          {label && <p className="text-[10px] text-ink-faint">{label}</p>}
        </div>
      </Link>
      <div className="absolute right-2 top-2">
        <FavouriteButton item={{ slug, kind, name, scientificName, biome }} size="sm" />
      </div>
    </div>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  count,
  children,
  empty,
}: {
  icon: React.ElementType;
  title: string;
  count?: number;
  children: React.ReactNode;
  empty?: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-2">
        <Icon className="size-5 text-pine" strokeWidth={1.8} />
        <h2 className="font-display text-xl text-ink">{title}</h2>
        {count !== undefined && count > 0 && (
          <span className="rounded-full bg-pine-soft px-2 py-0.5 text-xs font-medium text-pine">
            {count}
          </span>
        )}
      </div>
      <div className="mt-4">{children || empty}</div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CollectionPage() {
  const d = useDictionary();
  const cd = d.collection;
  const { activity, hydrated, activity: { favourites, history, quiz } } = useUserActivity();
  const [activeTab, setActiveTab] = useState<"favourites" | "history" | "suggestions">("favourites");

  const suggestions = useMemo(() => {
    if (!hydrated) return [];
    const biomeFreq: Record<string, number> = {};
    for (const h of history) {
      biomeFreq[h.biome] = (biomeFreq[h.biome] ?? 0) + 1;
    }
    const topBiomes = Object.entries(biomeFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([b]) => b);

    const viewedSlugs = new Set(history.map((h) => `${h.kind}:${h.slug}`));
    const favSlugs = new Set(favourites.map((f) => `${f.kind}:${f.slug}`));

    const candidates = [
      ...plants
        .filter(
          (p) =>
            topBiomes.includes(p.biome) &&
            !viewedSlugs.has(`plant:${p.slug}`) &&
            !favSlugs.has(`plant:${p.slug}`)
        )
        .map((p) => ({ ...p, kind: "plant" as const })),
      ...animals
        .filter(
          (a) =>
            topBiomes.includes(a.biome) &&
            !viewedSlugs.has(`animal:${a.slug}`) &&
            !favSlugs.has(`animal:${a.slug}`)
        )
        .map((a) => ({ ...a, kind: "animal" as const })),
    ];

    return candidates.sort(() => Math.random() - 0.5).slice(0, 8);
  }, [history, favourites, hydrated]);

  const tabs = [
    { id: "favourites" as const, label: cd.tabFavourites, icon: Heart, count: favourites.length },
    { id: "history" as const, label: cd.tabHistory, icon: Clock, count: history.length },
    { id: "suggestions" as const, label: cd.tabSuggestions, icon: Sparkles, count: suggestions.length },
  ];

  const badgeLabels: Record<string, string> = cd.badges as Record<string, string>;
  const timeAgoT = cd.timeAgo;

  function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return timeAgoT.justNow;
    if (mins < 60) return `${mins} ${timeAgoT.minutesAgo}`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ${timeAgoT.hoursAgo}`;
    return `${Math.floor(hours / 24)} ${timeAgoT.daysAgo}`;
  }

  function EmptyState({
    icon: Icon,
    title,
    description,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
  }) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-canvas-deep">
          <Icon className="size-6 text-ink-faint" strokeWidth={1.6} />
        </div>
        <p className="font-display text-lg text-ink">{title}</p>
        <p className="max-w-xs text-sm text-ink-soft">{description}</p>
        <Link
          href="/plants"
          className="mt-2 rounded-[var(--radius-pill)] bg-pine px-5 py-2 text-sm font-medium text-canvas hover:opacity-90 transition-opacity"
        >
          {cd.exploreNow}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BookMarked className="size-6 text-pine" strokeWidth={1.6} />
            <h1 className="font-display text-3xl text-ink">{cd.title}</h1>
          </div>
        </div>
      </div>

      {/* Quiz Stats mini-banner */}
      {hydrated && quiz.totalPlayed > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[var(--radius-card)] border border-honey/30 bg-honey-soft px-5 py-3">
          <span className="text-sm font-medium text-honey-dark">
            🏆 Quiz: {quiz.totalPlayed} · {d.quiz.highScore}: {quiz.highScore}
          </span>
          {quiz.badges.map((b) => (
            <Badge key={b} className="bg-honey text-white text-[10px]">
              {badgeLabels[b] ?? b}
            </Badge>
          ))}
        </div>
      )}

      {/* Tabs */}
      <nav className="mt-8 flex gap-2 border-b border-line">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-pine text-pine"
                : "border-transparent text-ink-soft hover:text-ink"
            )}
          >
            <tab.icon className="size-4" />
            {tab.label}
            {tab.count > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  activeTab === tab.id ? "bg-pine text-canvas" : "bg-canvas-deep text-ink-faint"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <div className="mt-6">
        {!hydrated ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-[var(--radius-card)] bg-canvas-deep"
              />
            ))}
          </div>
        ) : activeTab === "favourites" ? (
          favourites.length === 0 ? (
            <EmptyState
              icon={Heart}
              title={cd.emptyFavouritesTitle}
              description={cd.emptyFavouritesDesc}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {favourites.map((f) => (
                <MiniCard
                  key={`${f.kind}:${f.slug}`}
                  {...f}
                  label={`${cd.savedAgo} ${timeAgo(f.addedAt)}`}
                />
              ))}
            </div>
          )
        ) : activeTab === "history" ? (
          history.length === 0 ? (
            <EmptyState
              icon={Clock}
              title={cd.emptyHistoryTitle}
              description={cd.emptyHistoryDesc}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {history.map((h) => (
                <MiniCard
                  key={`${h.kind}:${h.slug}`}
                  {...h}
                  label={`${cd.viewedAgo} ${timeAgo(h.viewedAt)}`}
                />
              ))}
            </div>
          )
        ) : (
          suggestions.length === 0 ? (
            <EmptyState
              icon={Sparkles}
              title={cd.emptySuggestionsTitle}
              description={cd.emptySuggestionsDesc}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {suggestions.map((s) => (
                <MiniCard
                  key={`${s.kind}:${s.slug}`}
                  slug={s.slug}
                  kind={s.kind}
                  name={s.name}
                  scientificName={s.scientificName}
                  biome={s.biome}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
