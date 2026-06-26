"use client";

import type { MediaItem } from "@/types/content";
import { SpecimenPlate } from "./SpecimenPlate";
import { Badge } from "@/components/ui/badge";
import { useDictionary } from "@/i18n/use-dictionary";

const ASPECT: Record<MediaItem["aspect"], string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
};

export function MediaCard({ item }: { item: MediaItem }) {
  const dict = useDictionary();
  const TYPE_LABEL: Record<MediaItem["type"], string> = {
    photo: dict.media.filterPhoto,
    video: dict.media.filterVideo,
    infographic: dict.media.filterInfographic,
  };

  return (
    <div className="group relative mb-4 w-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-canvas-soft shadow-card">
      <SpecimenPlate
        biome={item.biome}
        icon="media"
        mediaType={item.type}
        className={`w-full ${ASPECT[item.aspect]}`}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-ink/70 to-transparent p-3 pt-8">
        <p className="line-clamp-1 text-sm font-medium text-white">{item.title}</p>
        <Badge variant="honey" className="shrink-0">
          {TYPE_LABEL[item.type]}
        </Badge>
      </div>
    </div>
  );
}
