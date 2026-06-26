import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/Link";
import { BIOMES } from "@/types/content";
import { plants } from "@/lib/data/plants";
import { animals } from "@/lib/data/animals";
import { PlantCard } from "@/components/cards/PlantCard";
import { AnimalCard } from "@/components/cards/AnimalCard";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getBiomeMeta } from "@/i18n/biome-labels";

interface EnvironmentPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export function generateStaticParams() {
  return BIOMES.map((b) => ({ slug: b.id }));
}

export async function generateMetadata({ params }: EnvironmentPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const biomeRaw = BIOMES.find((b) => b.id === slug);
  if (!biomeRaw || !isLocale(lang)) return {};
  const biome = getBiomeMeta(biomeRaw, lang);
  return { title: biome.name, description: biome.description };
}

export default async function EnvironmentPage({ params }: EnvironmentPageProps) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const biomeRaw = BIOMES.find((b) => b.id === slug);
  if (!biomeRaw) notFound();
  const biome = getBiomeMeta(biomeRaw, lang as Locale);
  const dict = await getDictionary(lang as Locale);

  const biomePlants = plants.filter((p) => p.biome === biomeRaw.id);
  const biomeAnimals = animals.filter((a) => a.biome === biomeRaw.id);

  return (
    <div>
      <div
        className="relative flex min-h-64 flex-col justify-end px-4 py-10 text-white sm:px-6 lg:px-8"
        style={{
          background: `linear-gradient(155deg, ${biomeRaw.colorVar} 0%, color-mix(in srgb, ${biomeRaw.colorVar} 55%, black) 100%)`,
        }}
      >
        <Link href="/" className="text-sm text-white/80 hover:text-white">
          {dict.environment.backHome}
        </Link>
        <h1 className="mt-3 font-display text-4xl">{biome.name}</h1>
        <p className="mt-2 max-w-xl text-white/90">{biome.description}</p>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <h2 className="mb-4 font-display text-xl text-ink">
            {dict.environment.plantsHeading} ({biomePlants.length})
          </h2>
          {biomePlants.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {biomePlants.map((p) => (
                <PlantCard key={p.slug} plant={p} lang={lang as Locale} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-faint">{dict.environment.noData}</p>
          )}
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl text-ink">
            {dict.environment.animalsHeading} ({biomeAnimals.length})
          </h2>
          {biomeAnimals.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {biomeAnimals.map((a) => (
                <AnimalCard key={a.slug} animal={a} lang={lang as Locale} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-faint">{dict.environment.noData}</p>
          )}
        </section>
      </div>
    </div>
  );
}
