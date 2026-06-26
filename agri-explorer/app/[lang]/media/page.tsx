import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { mediaItems } from "@/lib/data/media";
import { MediaCard } from "@/components/cards/MediaCard";

interface Props {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const d = await getDictionary(lang);
  return { title: d.media.title, description: d.media.description };
}

export default async function MediaPage({ params }: Props) {
  const { lang } = await params;
  const d = await getDictionary(lang);

  const FILTERS = [
    { label: d.media.filterAll, value: "all" },
    { label: d.media.filterPhoto, value: "photo" },
    { label: d.media.filterVideo, value: "video" },
    { label: d.media.filterInfographic, value: "infographic" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-ink">{d.media.title}</h1>
      <p className="mt-2 text-ink-soft">
        {mediaItems.length} {d.media.countLabel}
      </p>

      <div className="mt-6 flex gap-2">
        {FILTERS.map((f, i) => (
          <button
            key={f.value}
            className={`rounded-[var(--radius-pill)] border px-4 py-1.5 text-sm font-medium transition-colors ${
              i === 0
                ? "border-pine bg-pine text-canvas"
                : "border-line text-ink-soft hover:border-pine hover:text-pine"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 [column-gap:1rem] sm:columns-2 lg:columns-3">
        {mediaItems.map((item) => (
          <div key={item.id} className="break-inside-avoid">
            <MediaCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
