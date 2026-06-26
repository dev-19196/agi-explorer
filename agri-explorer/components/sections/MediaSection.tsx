"use client";

import { Link } from "@/i18n/Link";
import { mediaItems } from "@/lib/data/media";
import { MediaCard } from "@/components/cards/MediaCard";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { useDictionary } from "@/i18n/use-dictionary";

export function MediaSection() {
  const dict = useDictionary();
  return (
    <section className="bg-canvas-soft py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">
            {dict.mediaSection.title}
          </h2>
          <Button asChild variant="link" size="sm">
            <Link href="/media">{dict.mediaSection.viewAll}</Link>
          </Button>
        </div>

        <ScrollReveal className="mt-8 [column-gap:1rem] sm:columns-2 lg:columns-3">
          {mediaItems.map((item) => (
            <div key={item.id} className="break-inside-avoid">
              <MediaCard item={item} />
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
