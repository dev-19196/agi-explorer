import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { BookOpen } from "lucide-react";
import { articles } from "@/lib/data/articles";
import { ArticleCard } from "@/components/knowledge/ArticleCard";
import { ARTICLE_CATEGORY_LABELS, type ArticleCategory } from "@/types/content";
import { Link } from "@/i18n/Link";

interface Props {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const d = await getDictionary(lang);
  return { title: d.knowledge.title, description: d.knowledge.description };
}

const ALL_CATEGORIES = Object.keys(ARTICLE_CATEGORY_LABELS) as ArticleCategory[];

export default async function KnowledgePage({ params, searchParams }: Props) {
  const { lang } = await params;
  const { category: rawCat } = await searchParams;
  const d = await getDictionary(lang);

  const activeCategory = ALL_CATEGORIES.includes(rawCat as ArticleCategory)
    ? (rawCat as ArticleCategory)
    : null;

  const filtered = activeCategory
    ? articles.filter((a) => a.category === activeCategory)
    : articles;

  const [featured, ...rest] = filtered;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-honey-soft">
          <BookOpen className="size-5 text-honey-dark" strokeWidth={1.8} />
        </div>
        <div>
          <h1 className="font-display text-3xl text-ink">{d.knowledge.title}</h1>
          <p className="mt-0.5 text-sm text-ink-soft">{d.knowledge.subtitle}</p>
        </div>
      </div>

      {/* Category filter */}
      <nav className="mt-7 flex flex-wrap gap-2" aria-label={d.knowledge.filterAriaLabel}>
        <Link
          href="/knowledge"
          className={`rounded-[var(--radius-pill)] border px-4 py-1.5 text-sm font-medium transition-colors ${
            !activeCategory
              ? "border-pine bg-pine text-canvas"
              : "border-line text-ink-soft hover:border-pine hover:text-pine"
          }`}
        >
          {d.knowledge.filterAll} ({articles.length})
        </Link>
        {ALL_CATEGORIES.map((cat) => {
          const count = articles.filter((a) => a.category === cat).length;
          if (count === 0) return null;
          return (
            <Link
              key={cat}
              href={`/knowledge?category=${cat}`}
              className={`rounded-[var(--radius-pill)] border px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "border-pine bg-pine text-canvas"
                  : "border-line text-ink-soft hover:border-pine hover:text-pine"
              }`}
            >
              {ARTICLE_CATEGORY_LABELS[cat]} ({count})
            </Link>
          );
        })}
      </nav>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-ink-soft">{d.knowledge.emptyCategory}</p>
      ) : (
        <div className="mt-8 space-y-10">
          {/* Featured article */}
          {featured && (
            <section>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">
                {d.knowledge.featuredLabel}
              </p>
              <ArticleCard article={featured} featured />
            </section>
          )}

          {/* Rest of articles */}
          {rest.length > 0 && (
            <section>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink-faint">
                {d.knowledge.moreLabel}
              </p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
