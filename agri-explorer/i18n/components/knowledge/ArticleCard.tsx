"use client";

import { Link } from "@/i18n/Link";
import type { Article } from "@/types/content";
import { ARTICLE_CATEGORY_LABELS } from "@/types/content";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useDictionary } from "@/i18n/use-dictionary";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const lang = useLocale();
  const dict = useDictionary();
  const categoryLabel = ARTICLE_CATEGORY_LABELS[article.category] ?? article.category;
  const date = new Date(article.publishedAt).toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Link
      href={`/knowledge/${article.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-canvas-soft shadow-card transition-transform duration-200 hover:-translate-y-0.5",
        featured && "sm:flex-row"
      )}
    >
      {/* Cover image */}
      <div
        className={cn(
          "overflow-hidden",
          featured ? "sm:w-2/5 sm:shrink-0" : "w-full"
        )}
      >
        <img
          src={article.coverImage}
          alt={article.title}
          loading="lazy"
          className={cn(
            "w-full object-cover transition-transform duration-500 group-hover:scale-105",
            featured ? "aspect-[4/3] sm:h-full sm:aspect-auto" : "aspect-[16/9]"
          )}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        {/* Meta row */}
        <div className="flex items-center gap-2 text-xs text-ink-faint">
          <span className="rounded-full bg-pine-soft px-2.5 py-0.5 font-medium text-pine">
            {categoryLabel}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {article.readingTimeMin} {dict.knowledge.readingTime}
          </span>
        </div>

        {/* Title */}
        <h2
          className={cn(
            "font-display leading-snug text-ink group-hover:text-pine transition-colors",
            featured ? "text-xl" : "text-base"
          )}
        >
          {article.title}
        </h2>

        {/* Description */}
        <p
          className={cn(
            "line-clamp-2 text-sm text-ink-soft",
            featured && "line-clamp-3"
          )}
        >
          {article.description}
        </p>

        {/* Tags + date */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line px-2 py-0.5 text-[10px] text-ink-faint"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="shrink-0 text-[10px] text-ink-faint">{date}</span>
        </div>
      </div>
    </Link>
  );
}
