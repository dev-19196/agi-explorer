import { Link } from "@/i18n/Link";
import Image from "next/image";
import type { Animal } from "@/types/content";
import { BIOMES } from "@/types/content";
import { SpecimenPlate } from "./SpecimenPlate";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { FavouriteButton } from "@/components/personalisation/FavouriteButton";
import type { Locale } from "@/i18n/config";
import { DEFAULT_LOCALE } from "@/i18n/config";
import { translateSpecies } from "@/i18n/species-translations";
import { getBiomeMeta } from "@/i18n/biome-labels";

export function AnimalCard({ animal, lang = DEFAULT_LOCALE }: { animal: Animal; lang?: Locale }) {
  const biome = getBiomeMeta(BIOMES.find((b) => b.id === animal.biome)!, lang);
  const cover = animal.detail?.gallery.find((g) => g.kind === "image");
  const t = translateSpecies(animal, lang);

  return (
    <Link
      href={`/animals/${animal.slug}`}
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
        <SpecimenPlate biome={animal.biome} icon="animal" className="aspect-[4/3] w-full" />
      )}
      {/* Favourite button overlay */}
      <div className="absolute right-3 top-3">
        <FavouriteButton
          item={{
            slug: animal.slug,
            kind: "animal",
            name: animal.name,
            scientificName: animal.scientificName,
            biome: animal.biome,
          }}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Badge variant="biome" dotColor={biome.colorVar} className="self-start">
          {biome.name}
        </Badge>
        <h3 className="font-display text-lg leading-snug text-ink">{t.name}</h3>
        <p className="-mt-1 font-display text-sm italic text-ink-faint">
          {animal.scientificName}
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
