import type { ArticleSection } from "@/types/content";
import { LifecycleTimeline } from "@/components/sections/LifecycleTimeline";
import { Lightbulb, AlertTriangle } from "lucide-react";
import { type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

interface ArticleRendererProps {
  sections: ArticleSection[];
  lang: Locale;
}

export async function ArticleRenderer({ sections, lang }: ArticleRendererProps) {
  const dict = await getDictionary(lang);
  return (
    <div className="article-body space-y-5">
      {sections.map((section, i) => (
        <SectionBlock key={i} section={section} dict={dict} />
      ))}
    </div>
  );
}

function SectionBlock({ section, dict }: { section: ArticleSection; dict: Awaited<ReturnType<typeof getDictionary>> }) {
  switch (section.type) {
    case "paragraph":
      return (
        <p className="leading-relaxed text-ink-soft">
          {section.content}
        </p>
      );

    case "heading":
      return (
        <h2 className="pt-4 font-display text-xl font-semibold text-ink">
          {section.content}
        </h2>
      );

    case "tip":
      return (
        <aside className="flex gap-3 rounded-[var(--radius-card)] border border-pine/20 bg-pine-soft px-4 py-3.5">
          <Lightbulb
            className="mt-0.5 size-4 shrink-0 text-pine"
            strokeWidth={1.8}
            aria-hidden
          />
          <p className="text-sm leading-relaxed text-pine-dark">
            <span className="font-semibold">{dict.articleRenderer.tip}: </span>
            {section.content}
          </p>
        </aside>
      );

    case "warning":
      return (
        <aside className="flex gap-3 rounded-[var(--radius-card)] border border-honey/30 bg-honey-soft px-4 py-3.5">
          <AlertTriangle
            className="mt-0.5 size-4 shrink-0 text-honey-dark"
            strokeWidth={1.8}
            aria-hidden
          />
          <p className="text-sm leading-relaxed text-honey-dark">
            <span className="font-semibold">{dict.articleRenderer.warning}: </span>
            {section.content}
          </p>
        </aside>
      );

    case "image":
      if (!section.src) return null;
      return (
        <figure className="overflow-hidden rounded-[var(--radius-card)] border border-line">
          <img
            src={section.src}
            alt={section.caption ?? ""}
            loading="lazy"
            className="aspect-[16/9] w-full object-cover"
          />
          {section.caption && (
            <figcaption className="bg-canvas-soft px-4 py-2 text-xs text-ink-faint">
              {section.caption}
              {section.credit && (
                <span className="opacity-70"> — {section.credit}</span>
              )}
            </figcaption>
          )}
        </figure>
      );

    case "gallery":
      if (!section.images?.length) return null;
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {section.images.map((img, i) => (
            <figure
              key={i}
              className="overflow-hidden rounded-[var(--radius-card)] border border-line"
            >
              <img
                src={img.src}
                alt={img.caption}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <figcaption className="bg-canvas-soft px-3 py-2 text-xs text-ink-faint">
                {img.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      );

    case "lifecycle":
      if (!section.stages?.length) return null;
      return (
        <div className="rounded-[var(--radius-card)] border border-line bg-canvas-soft p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink-faint">
            {dict.articleRenderer.lifecycle}
          </p>
          <LifecycleTimeline stages={section.stages} />
        </div>
      );

    default:
      return null;
  }
}
