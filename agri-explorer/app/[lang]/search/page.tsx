"use client";

import { useEffect, useMemo, useRef, useState, useTransition, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Link } from "@/i18n/Link";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import { search, highlight, type SearchResult } from "@/lib/search";
import { PlantCard } from "@/components/cards/PlantCard";
import { AnimalCard } from "@/components/cards/AnimalCard";
import { MediaCard } from "@/components/cards/MediaCard";
import { ArticleCard } from "@/components/knowledge/ArticleCard";
import { LuckyButton } from "@/components/personalisation/LuckyButton";
import { BIOMES } from "@/types/content";
import { useLocale, useDictionary } from "@/i18n/use-dictionary";
import { cn } from "@/lib/utils";

type Scope = "all" | "plants" | "animals" | "media" | "articles";

// ─── Highlight span ────────────────────────────────────────────────────────────

function HighlightText({ text, query }: { text: string; query: string }) {
  const parts = highlight(text, query);
  return (
    <>
      {parts.map((p, i) =>
        p.highlight ? (
          <mark key={i} className="bg-honey-soft text-honey-dark rounded px-0.5 not-italic">
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}

// ─── Quick result row ─────────────────────────────────────────────────────────

function QuickRow({
  result,
  query,
  onClick,
  tagPlant,
  tagAnimal,
  tagMedia,
}: {
  result: SearchResult;
  query: string;
  onClick: () => void;
  tagPlant: string;
  tagAnimal: string;
  tagMedia: string;
}) {
  const biome = BIOMES.find((b) => b.id === result.biome);
  const href =
    result.kind === "plant"
      ? `/plants/${result.slug}`
      : result.kind === "animal"
      ? `/animals/${result.slug}`
      : `/media`;

  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-pine-soft transition-colors"
    >
      {biome && (
        <span
          className="size-2 shrink-0 rounded-full"
          style={{ background: biome.colorVar }}
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">
          <HighlightText text={result.title} query={query} />
        </p>
        <p className="truncate font-display text-xs italic text-ink-faint">{result.subtitle}</p>
      </div>
      <span className="shrink-0 rounded-full bg-canvas-deep px-2 py-0.5 text-[10px] text-ink-faint">
        {result.kind === "plant" ? tagPlant : result.kind === "animal" ? tagAnimal : tagMedia}
      </span>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SearchPage() {
  const lang = useLocale();
  const d = useDictionary();
  const sd = d.search;

  const TABS: { value: Scope; label: string }[] = [
    { value: "all", label: sd.tabAll },
    { value: "plants", label: sd.tabPlants },
    { value: "animals", label: sd.tabAnimals },
    { value: "articles", label: sd.tabArticles },
    { value: "media", label: sd.tabMedia },
  ];

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const initialQ = searchParams.get("q") ?? "";
  const initialScope = (searchParams.get("scope") as Scope) ?? "all";

  const [query, setQuery] = useState(initialQ);
  const [scope, setScope] = useState<Scope>(initialScope);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // `results` là giá trị suy ra trực tiếp từ query/scope (không có external
  // system nào để "đồng bộ") nên tính trong render qua useMemo, không cần effect.
  const results = useMemo<SearchResult[]>(
    () => (query.trim() ? search(query, { scope, limit: 60 }) : []),
    [query, scope]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (scope !== "all") params.set("scope", scope);
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 300);
    return () => clearTimeout(t);
  }, [query, scope]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current !== e.target
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const clearQuery = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  }, []);

  const plantResults = results.filter((r) => r.kind === "plant");
  const animalResults = results.filter((r) => r.kind === "animal");
  const mediaResults = results.filter((r) => r.kind === "media");
  const articleResults = results.filter((r) => r.kind === "article");
  const dropdownResults = results.slice(0, 6);

  const hasResults = results.length > 0;
  const hasQuery = query.trim().length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-ink">{sd.title}</h1>
        <LuckyButton />
      </div>

      {/* Search bar */}
      <div className="relative mt-6 max-w-xl">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-faint pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(e.target.value.trim().length > 0);
          }}
          onFocus={() => query.trim() && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={sd.placeholder}
          autoComplete="off"
          className="h-11 w-full rounded-[var(--radius-card)] border border-line bg-canvas-soft pl-9 pr-10 text-sm text-ink placeholder:text-ink-faint focus:border-pine focus:outline-none focus:ring-1 focus:ring-pine"
          aria-label={sd.ariaLabel}
          aria-expanded={showDropdown}
          aria-autocomplete="list"
        />
        {isPending && (
          <Loader2 className="absolute right-9 top-1/2 size-3.5 -translate-y-1/2 animate-spin text-ink-faint" />
        )}
        {hasQuery && (
          <button
            onClick={clearQuery}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-ink-faint hover:text-ink"
            aria-label={sd.ariaClear}
          >
            <X className="size-3.5" />
          </button>
        )}

        {/* Dropdown */}
        {showDropdown && dropdownResults.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-[var(--radius-card)] border border-line bg-canvas shadow-[0_8px_30px_rgba(22,38,31,0.12)] overflow-hidden"
            role="listbox"
          >
            <div className="max-h-72 overflow-y-auto py-1.5 px-1.5">
              {dropdownResults.map((r) => (
                <QuickRow
                  key={`${r.kind}:${r.slug}`}
                  result={r}
                  query={query}
                  onClick={() => setShowDropdown(false)}
                  tagPlant={sd.tagPlant}
                  tagAnimal={sd.tagAnimal}
                  tagMedia={sd.tagMedia}
                />
              ))}
            </div>
            {results.length > 6 && (
              <div className="border-t border-line px-3 py-2">
                <p className="text-xs text-ink-faint">
                  {sd.moreResults.replace("{count}", String(results.length - 6))}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scope tabs */}
      <nav className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label={sd.ariaFilter}>
        {TABS.map((tab) => {
          const count =
            tab.value === "all"
              ? results.length
              : tab.value === "plants"
              ? plantResults.length
              : tab.value === "animals"
              ? animalResults.length
              : tab.value === "articles"
              ? articleResults.length
              : mediaResults.length;

          return (
            <button
              key={tab.value}
              onClick={() => setScope(tab.value)}
              className={cn(
                "shrink-0 rounded-[var(--radius-pill)] border px-4 py-1.5 text-sm font-medium transition-colors",
                scope === tab.value
                  ? "border-pine bg-pine text-canvas"
                  : "border-line text-ink-soft hover:border-pine hover:text-pine"
              )}
            >
              {tab.label}
              {hasQuery && count > 0 && (
                <span
                  className={cn(
                    "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    scope === tab.value ? "bg-white/20 text-white" : "bg-canvas-deep text-ink-faint"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Status line */}
      <p className="mt-4 text-sm text-ink-faint" aria-live="polite">
        {hasQuery ? (
          hasResults ? (
            <>{sd.statusResults.replace("{count}", String(results.length))} &ldquo;{query}&rdquo;</>
          ) : (
            <>{sd.statusNoResults} &ldquo;{query}&rdquo; {sd.statusNoResultsHint}</>
          )
        ) : (
          <>{sd.statusEmpty}</>
        )}
      </p>

      {/* Results */}
      {hasResults && (
        <div className="mt-8 space-y-12">
          {(scope === "all" || scope === "plants") && plantResults.length > 0 && (
            <section aria-labelledby="plants-heading">
              {scope === "all" && (
                <h2 id="plants-heading" className="mb-4 font-display text-xl text-ink">
                  {sd.headingPlants}
                  <span className="ml-2 text-base font-normal text-ink-faint">({plantResults.length})</span>
                </h2>
              )}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {plantResults.map((r) => r.plant && <PlantCard key={r.slug} plant={r.plant} lang={lang} />)}
              </div>
            </section>
          )}

          {(scope === "all" || scope === "animals") && animalResults.length > 0 && (
            <section aria-labelledby="animals-heading">
              {scope === "all" && (
                <h2 id="animals-heading" className="mb-4 font-display text-xl text-ink">
                  {sd.headingAnimals}
                  <span className="ml-2 text-base font-normal text-ink-faint">({animalResults.length})</span>
                </h2>
              )}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {animalResults.map((r) => r.animal && <AnimalCard key={r.slug} animal={r.animal} lang={lang} />)}
              </div>
            </section>
          )}

          {(scope === "all" || scope === "articles") && articleResults.length > 0 && (
            <section aria-labelledby="articles-heading">
              {scope === "all" && (
                <h2 id="articles-heading" className="mb-4 font-display text-xl text-ink">
                  {sd.headingArticles}
                  <span className="ml-2 text-base font-normal text-ink-faint">({articleResults.length})</span>
                </h2>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {articleResults.map((r) => r.article && <ArticleCard key={r.slug} article={r.article} />)}
              </div>
            </section>
          )}

          {(scope === "all" || scope === "media") && mediaResults.length > 0 && (
            <section aria-labelledby="media-heading">
              {scope === "all" && (
                <h2 id="media-heading" className="mb-4 font-display text-xl text-ink">
                  {sd.headingMedia}
                  <span className="ml-2 text-base font-normal text-ink-faint">({mediaResults.length})</span>
                </h2>
              )}
              <div className="[column-gap:1rem] sm:columns-2 lg:columns-3">
                {mediaResults.map((r) => r.media && (
                  <div key={r.slug} className="break-inside-avoid">
                    <MediaCard item={r.media} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Empty state */}
      {hasQuery && !hasResults && (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-canvas-deep">
            <SearchIcon className="size-6 text-ink-faint" strokeWidth={1.6} />
          </div>
          <p className="font-display text-lg text-ink">{sd.emptyTitle}</p>
          <p className="max-w-xs text-sm text-ink-soft">{sd.emptyHint}</p>
          <LuckyButton />
        </div>
      )}

      {/* Search suggestions */}
      {!hasQuery && (
        <div className="mt-12">
          <p className="text-sm font-medium text-ink-soft">{sd.suggestionsLabel}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(sd.suggestions as string[]).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setQuery(s);
                  setShowDropdown(false);
                }}
                className="rounded-[var(--radius-pill)] border border-line px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-pine hover:text-pine"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center">
            <LuckyButton variant="default" />
          </div>
        </div>
      )}
    </div>
  );
}
