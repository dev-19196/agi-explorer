import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/Link";
import { Clock, Calendar, ArrowLeft, Tag } from "lucide-react";
import { articles } from "@/lib/data/articles";
import { plants } from "@/lib/data/plants";
import { animals } from "@/lib/data/animals";
import { ArticleRenderer } from "@/components/knowledge/ArticleRenderer";
import { ArticleCard } from "@/components/knowledge/ArticleCard";
import { SpecimenPlate } from "@/components/cards/SpecimenPlate";
import type { Biome } from "@/types/content";
import { ARTICLE_CATEGORY_LABELS } from "@/types/content";
import { Separator } from "@/components/ui/separator";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { VietnameseOnlyNote } from "@/i18n/VietnameseOnlyNote";

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const dict = await getDictionary(lang);

  const categoryLabel = ARTICLE_CATEGORY_LABELS[article.category] ?? article.category;
  const date = new Date(article.publishedAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Related articles — cùng category, khác slug
  const relatedArticles = articles
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 2);

  // Related species từ relatedSlugs
  type RelatedSpecies = { kind: "plant" | "animal"; slug: string; name: string; scientificName: string; biome: Biome };
  const relatedSpecies: RelatedSpecies[] = (article.relatedSlugs ?? []).flatMap((s): RelatedSpecies[] => {
    const plant = plants.find((p) => p.slug === s);
    if (plant) return [{ kind: "plant", slug: plant.slug, name: plant.name, scientificName: plant.scientificName, biome: plant.biome as Biome }];
    const animal = animals.find((a) => a.slug === s);
    if (animal) return [{ kind: "animal", slug: animal.slug, name: animal.name, scientificName: animal.scientificName, biome: animal.biome as Biome }];
    return [];
  });

  return (
    <article>
      {/* Hero */}
      <div className="relative h-[40vh] min-h-[280px] max-h-[480px] overflow-hidden bg-canvas-deep">
        <img
          src={article.coverImage}
          alt={article.coverCaption ?? article.title}
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-3xl px-4 pb-8 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-canvas/80">
            <span className="rounded-full bg-pine/80 px-2.5 py-0.5 font-medium text-canvas backdrop-blur-sm">
              {categoryLabel}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {article.readingTimeMin} {dict.knowledge.readingTime}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {date}
            </span>
          </div>
          <h1 className="mt-3 font-display text-2xl leading-snug text-canvas sm:text-3xl">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Back link */}
        <Link
          href="/knowledge"
          className="mb-6 flex items-center gap-1.5 text-sm text-ink-faint hover:text-pine transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          {dict.knowledge.backToAll}
        </Link>

        {/* Lead */}
        <p className="mb-8 text-base font-medium leading-relaxed text-ink">
          {article.description}
        </p>

        {lang === "en" && <VietnameseOnlyNote text={dict.vietnameseOnlyNote} />}

        <Separator className="mb-8" />

        {/* Article content */}
        <ArticleRenderer sections={article.sections} lang={lang} />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <Tag className="size-3.5 text-ink-faint" />
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line px-3 py-1 text-xs text-ink-faint"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Related species */}
      {relatedSpecies.length > 0 && (
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink-faint">
            {dict.knowledge.relatedSpecies}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedSpecies.map((s) => (
              <Link
                key={`${s.kind}:${s.slug}`}
                href={`/${s.kind === "plant" ? "plants" : "animals"}/${s.slug}`}
                className="flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-canvas-soft p-3 transition-colors hover:border-pine group"
              >
                <SpecimenPlate
                  biome={s.biome}
                  icon={s.kind === "plant" ? "plant" : "animal"}
                  className="size-14 shrink-0"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink group-hover:text-pine transition-colors">
                    {s.name}
                  </p>
                  <p className="truncate text-xs italic text-ink-faint">{s.scientificName}</p>
                  <p className="mt-0.5 text-[10px] text-ink-faint capitalize">
                    {s.kind === "plant" ? dict.knowledge.kindPlant : dict.knowledge.kindAnimal} →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <>
          <Separator />
          <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink-faint">
              {dict.knowledge.relatedArticles}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </>
      )}
    </article>
  );
}
