import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/Link";
import {
  MapPin,
  Sprout,
  Clock,
  Droplets,
  Sun,
  Layers,
  Sparkles,
  Leaf,
  ListChecks,
} from "lucide-react";
import { plants } from "@/lib/data/plants";
import { BIOMES } from "@/types/content";
import { SpecimenPlate } from "@/components/cards/SpecimenPlate";
import { SpeciesMediaGallery } from "@/components/sections/SpeciesMediaGallery";
import { LifecycleTimeline } from "@/components/sections/LifecycleTimeline";
import { SpeciesDistributionMap } from "@/components/map/SpeciesDistributionMap";
import { AudioPronounceButton } from "@/components/ui/AudioPronounceButton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HistoryTracker } from "@/components/personalisation/HistoryTracker";
import { FavouriteButton } from "@/components/personalisation/FavouriteButton";
import { getRelatedPlants } from "@/lib/search";
import { isLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { translateSpecies } from "@/i18n/species-translations";
import { getBiomeMeta } from "@/i18n/biome-labels";
import { VietnameseOnlyNote } from "@/i18n/VietnameseOnlyNote";

interface PlantPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export function generateStaticParams() {
  return plants.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PlantPageProps): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const plant = plants.find((p) => p.slug === slug);
  if (!plant) return {};
  const lang: Locale = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const t = translateSpecies(plant, lang);
  return {
    title: t.name,
    description: t.tagline,
  };
}

export default async function PlantDetailPage({ params }: PlantPageProps) {
  const { lang: rawLang, slug } = await params;
  const plant = plants.find((p) => p.slug === slug);
  if (!plant) notFound();
  const lang: Locale = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const dict = await getDictionary(lang);
  const t = translateSpecies(plant, lang);

  const biome = getBiomeMeta(BIOMES.find((b) => b.id === plant.biome)!, lang);
  const related = getRelatedPlants(plant, 4);
  const d = plant.detail;
  const cover = d?.gallery.find((g) => g.kind === "image");

  return (
    <article>
      {/* Ghi lịch sử xem (client component, invisible) */}
      <HistoryTracker
        slug={plant.slug}
        kind="plant"
        name={plant.name}
        scientificName={plant.scientificName}
        biome={plant.biome}
        category={plant.category}
      />
      {/* Hero chi tiết */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/plants" className="text-sm text-ink-faint hover:text-pine">
          ← {dict.nav.plants}
        </Link>

        <div className="mt-6 grid gap-8 sm:grid-cols-[280px_1fr]">
          {cover ? (
            <img
              src={cover.url}
              alt={t.name}
              className="aspect-square w-full rounded-[var(--radius-card)] border border-line object-cover"
            />
          ) : (
            <SpecimenPlate biome={plant.biome} icon="plant" className="aspect-square w-full" />
          )}

          <div>
            <Badge variant="biome" dotColor={biome.colorVar}>
              {biome.name}
            </Badge>
            <div className="mt-3 flex items-start gap-3">
              <h1 className="font-display text-4xl text-ink">{t.name}</h1>
              <FavouriteButton
                item={{
                  slug: plant.slug,
                  kind: "plant",
                  name: plant.name,
                  scientificName: plant.scientificName,
                  biome: plant.biome,
                }}
                size="md"
                className="mt-1 shrink-0"
              />
            </div>
            <p className="mt-1 flex items-center gap-2 font-display text-lg italic text-ink-faint">
              {plant.scientificName}
              <AudioPronounceButton text={plant.scientificName} />
            </p>
            <p className="mt-4 max-w-xl text-ink-soft">{t.tagline}</p>
            <div className="mt-4 flex items-center gap-1.5 text-sm text-ink-faint">
              <MapPin className="size-4" /> {t.country}
            </div>
            {lang === "en" && <VietnameseOnlyNote text={dict.vietnameseOnlyNote} />}
          </div>
        </div>
      </div>

      <Separator />

      {d ? (
        <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
          <section>
            <h2 className="flex items-center gap-2 font-display text-xl text-ink">
              <Leaf className="size-5 text-pine" /> {dict.plantDetail.overview}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{d.overview}</p>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[var(--radius-card)] border border-line bg-canvas-soft p-6">
              <h3 className="font-display text-lg text-ink">{dict.plantDetail.classification}</h3>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-faint">{dict.plantDetail.kingdom}</dt>
                  <dd className="text-right text-ink-soft">{d.classification.kingdom}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-faint">{dict.plantDetail.order}</dt>
                  <dd className="text-right text-ink-soft">{d.classification.order}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-faint">{dict.plantDetail.family}</dt>
                  <dd className="text-right text-ink-soft">{d.classification.family}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-faint">{dict.plantDetail.genus}</dt>
                  <dd className="text-right text-ink-soft">{d.classification.genus}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[var(--radius-card)] border border-line bg-canvas-soft p-6">
              <h3 className="flex items-center gap-2 font-display text-lg text-ink">
                <ListChecks className="size-4 text-pine" /> {dict.plantDetail.characteristics}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                {d.characteristics.map((c) => (
                  <li key={c} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-pine" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">{dict.plantDetail.habitatTitle}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: dict.plantDetail.climate, value: d.habitat.climate },
                { label: dict.plantDetail.terrain, value: d.habitat.terrain },
                { label: dict.plantDetail.distribution, value: d.habitat.distribution },
                { label: dict.plantDetail.temperature, value: d.habitat.temperatureRange },
              ].map((item) => (
                <div key={item.label} className="rounded-[var(--radius-card)] border border-line p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-honey-dark">{item.label}</p>
                  <p className="mt-1.5 text-sm text-ink-soft">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {d.distribution && d.distribution.length > 0 && (
            <section>
              <h2 className="font-display text-xl text-ink">{dict.plantDetail.distributionMapTitle}</h2>
              <div className="mt-4">
                <SpeciesDistributionMap points={d.distribution} />
              </div>
            </section>
          )}

          <section>
            <h2 className="flex items-center gap-2 font-display text-xl text-ink">
              <Sprout className="size-5 text-pine" /> {dict.plantDetail.careTitle}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Droplets, label: dict.plantDetail.watering, value: d.care.watering },
                { icon: Sun, label: dict.plantDetail.light, value: d.care.light },
                { icon: Layers, label: dict.plantDetail.soil, value: d.care.soil },
                { icon: Sparkles, label: dict.plantDetail.fertilizing, value: d.care.fertilizing },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-[var(--radius-card)] border border-line p-4">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
                    <Icon className="size-4 text-pine" /> {label}
                  </p>
                  <p className="mt-1.5 text-sm text-ink-soft">{value}</p>
                </div>
              ))}
              <div className="rounded-[var(--radius-card)] border border-dashed border-line p-4 sm:col-span-2">
                <p className="text-sm font-medium text-ink">{dict.plantDetail.pests}</p>
                <p className="mt-1.5 text-sm text-ink-soft">{d.care.pests}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-2 font-display text-xl text-ink">
              <Clock className="size-5 text-pine" /> {dict.plantDetail.growthStagesTitle}
            </h2>
            <div className="mt-6">
              <LifecycleTimeline stages={d.growthStages} />
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">{dict.plantDetail.galleryTitle}</h2>
            <div className="mt-4">
              <SpeciesMediaGallery gallery={d.gallery} />
            </div>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[var(--radius-card)] border border-line bg-canvas-soft p-6">
              <h3 className="font-display text-lg text-ink">{dict.plantDetail.usesTitle}</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                {d.uses.map((u) => (
                  <li key={u} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-honey-dark" />
                    {u}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-pine-soft p-6">
              <h3 className="font-display text-lg text-ink">{dict.plantDetail.funFactsTitle}</h3>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                {d.funFacts.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Sparkles className="mt-0.5 size-3.5 shrink-0 text-honey-dark" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      ) : (
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[var(--radius-card)] border border-dashed border-line p-6">
              <Sprout className="size-5 text-pine" />
              <h2 className="mt-3 font-display text-lg text-ink">{dict.plantDetail.emptyHabitatTitle}</h2>
              <p className="mt-1 text-sm text-ink-soft">
                {dict.plantDetail.emptyDesc}
              </p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-dashed border-line p-6">
              <Clock className="size-5 text-pine" />
              <h2 className="mt-3 font-display text-lg text-ink">{dict.plantDetail.emptyTimelineTitle}</h2>
              <p className="mt-1 text-sm text-ink-soft">
                {dict.plantDetail.emptyTimelinePrefix}{" "}
                <Link href="/plants/sau-rieng" className="text-pine underline">
                  {translateSpecies(plants.find((p) => p.slug === "sau-rieng")!, lang).name}
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="flex items-baseline gap-2">
            <h2 className="font-display text-xl text-ink">{dict.plantDetail.relatedTitle}</h2>
            <span className="text-sm text-ink-faint">{dict.plantDetail.relatedSubtitle}</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => {
              const sameCategory = p.category === plant.category;
              const sameBiome = p.biome === plant.biome;
              const reasonLabel = sameCategory
                ? dict.plantDetail.relatedReasonSameGroup
                : sameBiome
                ? dict.plantDetail.relatedReasonSameBiome
                : dict.plantDetail.relatedReasonGeneric;
              const pBiome = BIOMES.find((b) => b.id === p.biome);
              const pT = translateSpecies(p, lang);
              return (
                <Link
                  key={p.slug}
                  href={`/plants/${p.slug}`}
                  className="group flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-canvas-soft p-3 transition-colors hover:border-pine"
                >
                  <SpecimenPlate biome={p.biome} icon="plant" className="size-14 shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink group-hover:text-pine">
                      {pT.name}
                    </p>
                    <p className="truncate text-xs italic text-ink-faint">{p.scientificName}</p>
                    {pBiome && (
                      <span
                        className="mt-1 inline-flex items-center gap-1 text-[10px] text-ink-faint"
                      >
                        <span
                          className="inline-block size-1.5 rounded-full"
                          style={{ background: pBiome.colorVar }}
                        />
                        {reasonLabel}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}
