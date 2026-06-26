import { Link } from "@/i18n/Link";
import Image from "next/image";
import type { Plant } from "@/types/content";
import { BIOMES } from "@/types/content";
import { SpecimenPlate } from "./SpecimenPlate";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { FavouriteButton } from "@/components/personalisation/FavouriteButton";
import type { Locale } from "@/i18n/config";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { translateSpecies } from "@/i18n/species-translations";
import { getBiomeMeta } from "@/i18n/biome-labels";

export function PlantCard({ plant, lang = DEFAULT_LOCALE }: { plant: Plant; lang?: Locale }) {
  const biome = getBiomeMeta(BIOMES.find((b) => b.id === plant.biome)!, lang);
  const cover = plant.detail?.gallery.find((g) => g.kind === "image");
  const t = translateSpecies(plant, lang);

  return (
    <Link
      href={`/plants/${plant.slug}`}
      className="group relative flex w-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-canvas-soft shadow-card transition-transform duration-300 hover:-translate-y-1"
    >
      {cover ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={cover.url}
            alt={t.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <SpecimenPlate biome={plant.biome} icon="plant" className="aspect-[4/3] w-full" />
      )}
      {/* Favourite button overlay */}
      <div className="absolute right-3 top-3">
        <FavouriteButton
          item={{
            slug: plant.slug,
            kind: "plant",
            name: plant.name,
            scientificName: plant.scientificName,
            biome: plant.biome,
          }}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Badge variant="biome" dotColor={biome.colorVar} className="self-start">
          {biome.name}
        </Badge>
        <h3 className="font-display text-lg leading-snug text-ink">{t.name}</h3>
        <p className="-mt-1 font-display text-sm italic text-ink-faint">
          {plant.scientificName}
        </p>
        <p className="line-clamp-2 text-sm text-ink-soft">{t.tagline}</p>
        <div className="mt-auto flex items-center gap-1 pt-2 text-xs text-ink-faint">
          <MapPin className="size-3.5" />
          {t.country}
        </div>
      </div>
    </Link>
  );
}
