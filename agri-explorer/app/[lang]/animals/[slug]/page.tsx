import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/Link";
import {
  MapPin,
  Clock,
  Utensils,
  Users,
  Users2,
  Moon,
  Heart,
  Sparkles,
  PawPrint,
  ListChecks,
  ShieldAlert,
} from "lucide-react";
import { animals } from "@/lib/data/animals";
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
import { getRelatedAnimals } from "@/lib/search";
import { isLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { translateSpecies } from "@/i18n/species-translations";
import { getBiomeMeta } from "@/i18n/biome-labels";
import { VietnameseOnlyNote } from "@/i18n/VietnameseOnlyNote";

interface AnimalPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export function generateStaticParams() {
  return animals.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: AnimalPageProps): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const animal = animals.find((a) => a.slug === slug);
  if (!animal) return {};
  const lang: Locale = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const t = translateSpecies(animal, lang);
  return {
    title: t.name,
    description: t.tagline,
  };
}

export default async function AnimalDetailPage({ params }: AnimalPageProps) {
  const { lang: rawLang, slug } = await params;
  const animal = animals.find((a) => a.slug === slug);
  if (!animal) notFound();
  const lang: Locale = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const dict = await getDictionary(lang);
  const t = translateSpecies(animal, lang);

  const biome = getBiomeMeta(BIOMES.find((b) => b.id === animal.biome)!, lang);
  const related = getRelatedAnimals(animal, 4);
  const d = animal.detail;
  const cover = d?.gallery.find((g) => g.kind === "image");

  return (
    <article>
      {/* Ghi lịch sử xem */}
      <HistoryTracker
        slug={animal.slug}
        kind="animal"
        name={animal.name}
        scientificName={animal.scientificName}
        biome={animal.biome}
      />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link href="/animals" className="text-sm text-ink-faint hover:text-pine">
          ← {dict.nav.animals}
        </Link>

        <div className="mt-6 grid gap-8 sm:grid-cols-[280px_1fr]">
          {cover ? (
            <img
              src={cover.url}
              alt={t.name}
              className="aspect-square w-full rounded-[var(--radius-card)] border border-line object-cover"
            />
          ) : (
            <SpecimenPlate biome={animal.biome} icon="animal" className="aspect-square w-full" />
          )}

          <div>
            <Badge variant="biome" dotColor={biome.colorVar}>
              {biome.name}
            </Badge>
            <div className="mt-3 flex items-start gap-3">
              <h1 className="font-display text-4xl text-ink">{t.name}</h1>
              <FavouriteButton
                item={{
                  slug: animal.slug,
                  kind: "animal",
                  name: animal.name,
                  scientificName: animal.scientificName,
                  biome: animal.biome,
                }}
                size="md"
                className="mt-1 shrink-0"
              />
            </div>
            <p className="mt-1 flex items-center gap-2 font-display text-lg italic text-ink-faint">
              {animal.scientificName}
              <AudioPronounceButton text={animal.scientificName} />
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
              <PawPrint className="size-5 text-pine" /> {dict.animalDetail.overview}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{d.overview}</p>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[var(--radius-card)] border border-line bg-canvas-soft p-6">
              <h3 className="font-display text-lg text-ink">{dict.animalDetail.classification}</h3>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-faint">{dict.animalDetail.kingdom}</dt>
                  <dd className="text-right text-ink-soft">{d.classification.kingdom}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-faint">{dict.animalDetail.order}</dt>
                  <dd className="text-right text-ink-soft">{d.classification.order}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-faint">{dict.animalDetail.family}</dt>
                  <dd className="text-right text-ink-soft">{d.classification.family}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-faint">{dict.animalDetail.genus}</dt>
                  <dd className="text-right text-ink-soft">{d.classification.genus}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[var(--radius-card)] border border-line bg-canvas-soft p-6">
              <h3 className="flex items-center gap-2 font-display text-lg text-ink">
                <ListChecks className="size-4 text-pine" /> {dict.animalDetail.characteristics}
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
            <h2 className="font-display text-xl text-ink">{dict.animalDetail.habitatTitle}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: dict.animalDetail.climate, value: d.habitat.climate },
                { label: dict.animalDetail.terrain, value: d.habitat.terrain },
                { label: dict.animalDetail.distribution, value: d.habitat.distribution },
                { label: dict.animalDetail.temperature, value: d.habitat.temperatureRange },
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
              <h2 className="font-display text-xl text-ink">{dict.animalDetail.distributionMapTitle}</h2>
              <div className="mt-4">
                <SpeciesDistributionMap points={d.distribution} />
              </div>
            </section>
          )}

          <section>
            <h2 className="flex items-center gap-2 font-display text-xl text-ink">
              <PawPrint className="size-5 text-pine" /> {dict.animalDetail.behaviorTitle}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Utensils, label: dict.animalDetail.diet, value: d.behavior.diet },
                { icon: Users, label: dict.animalDetail.socialStructure, value: d.behavior.socialStructure },
                { icon: Moon, label: dict.animalDetail.activity, value: d.behavior.activityPattern },
                { icon: Heart, label: dict.animalDetail.reproduction, value: d.behavior.reproduction },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-[var(--radius-card)] border border-line p-4">
                  <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
                    <Icon className="size-4 text-pine" /> {label}
                  </p>
                  <p className="mt-1.5 text-sm text-ink-soft">{value}</p>
                </div>
              ))}
              <div className="rounded-[var(--radius-card)] border border-dashed border-line p-4 sm:col-span-2">
                <p className="text-sm font-medium text-ink">{dict.animalDetail.lifespan}</p>
                <p className="mt-1.5 text-sm text-ink-soft">{d.behavior.lifespan}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-2 font-display text-xl text-ink">
              <Clock className="size-5 text-pine" /> {dict.animalDetail.lifecycleTitle}
            </h2>
            <div className="mt-6">
              <LifecycleTimeline stages={d.lifeStages} />
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">{dict.animalDetail.galleryTitle}</h2>
            <div className="mt-4">
              <SpeciesMediaGallery gallery={d.gallery} />
            </div>
          </section>

          {d.humanConnection && d.humanConnection.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 font-display text-xl text-ink">
                <Users2 className="size-5 text-pine" /> {dict.animalDetail.humanConnectionTitle}
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {d.humanConnection.map((h) => (
                  <li
                    key={h}
                    className="flex gap-2 rounded-[var(--radius-card)] border border-line bg-canvas-soft p-4 text-sm text-ink-soft"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-honey-dark" />
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-[var(--radius-card)] border border-line bg-canvas-soft p-6">
              <h3 className="flex items-center gap-2 font-display text-lg text-ink">
                <ShieldAlert className="size-4 text-honey-dark" /> {dict.animalDetail.conservationTitle}
              </h3>
              <p className="mt-3 text-sm text-ink-soft">{d.conservationStatus}</p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-pine-soft p-6">
              <h3 className="font-display text-lg text-ink">{dict.animalDetail.funFactsTitle}</h3>
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
              <PawPrint className="size-5 text-pine" />
              <h2 className="mt-3 font-display text-lg text-ink">{dict.animalDetail.emptyHabitatTitle}</h2>
              <p className="mt-1 text-sm text-ink-soft">
                {dict.animalDetail.emptyDesc}
              </p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-dashed border-line p-6">
              <Clock className="size-5 text-pine" />
              <h2 className="mt-3 font-display text-lg text-ink">{dict.animalDetail.emptyTimelineTitle}</h2>
              <p className="mt-1 text-sm text-ink-soft">
                {dict.animalDetail.emptyTimelinePrefix}{" "}
                <Link href="/animals/voi-chau-a" className="text-pine underline">
                  {translateSpecies(animals.find((a) => a.slug === "voi-chau-a")!, lang).name}
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
            <h2 className="font-display text-xl text-ink">{dict.animalDetail.relatedTitle}</h2>
            <span className="text-sm text-ink-faint">{dict.animalDetail.relatedSubtitle}</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((a) => {
              const sameBiome = a.biome === animal.biome;
              const reasonLabel = sameBiome ? dict.animalDetail.relatedReasonSameBiome : dict.animalDetail.relatedReasonDiet;
              const aBiome = BIOMES.find((b) => b.id === a.biome);
              const aT = translateSpecies(a, lang);
              return (
                <Link
                  key={a.slug}
                  href={`/animals/${a.slug}`}
                  className="group flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-canvas-soft p-3 transition-colors hover:border-pine"
                >
                  <SpecimenPlate biome={a.biome} icon="animal" className="size-14 shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink group-hover:text-pine">
                      {aT.name}
                    </p>
                    <p className="truncate text-xs italic text-ink-faint">{a.scientificName}</p>
                    {aBiome && (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-ink-faint">
                        <span
                          className="inline-block size-1.5 rounded-full"
                          style={{ background: aBiome.colorVar }}
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
