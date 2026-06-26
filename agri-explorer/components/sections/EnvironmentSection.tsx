import { Link } from "@/i18n/Link";
import { BIOMES } from "@/types/content";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { getBiomeMeta } from "@/i18n/biome-labels";

interface EnvironmentSectionProps {
  lang: Locale;
  dict: Dictionary;
}

export function EnvironmentSection({ lang, dict }: EnvironmentSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-honey-dark">
          {dict.environment.eyebrow}
        </p>
        <h2 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
          {dict.environment.title}
        </h2>
        <p className="mt-2 text-ink-soft">{dict.environment.description}</p>
      </div>

      <ScrollReveal className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BIOMES.map((biomeRaw, i) => {
          const biome = getBiomeMeta(biomeRaw, lang);
          return (
            <Link
              key={biome.id}
              href={`/environment/${biome.id}`}
              className={`group relative flex min-h-56 flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-5 text-white ${
                i === 0 ? "sm:col-span-2 lg:col-span-2" : ""
              }`}
              style={{
                background: `linear-gradient(155deg, ${biome.colorVar} 0%, color-mix(in srgb, ${biome.colorVar} 60%, black) 100%)`,
              }}
            >
              <div className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
              <h3 className="relative font-display text-xl">{biome.name}</h3>
              <p className="relative mt-1 max-w-sm text-sm text-white/85">{biome.description}</p>
            </Link>
          );
        })}
      </ScrollReveal>
    </section>
  );
}
