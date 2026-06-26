"use client";

import { useCountUp } from "@/lib/hooks/useCountUp";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { useDictionary, useLocale } from "@/i18n/use-dictionary";

function StatItem({ value, label }: { value: number; label: string }) {
  const { ref, value: count } = useCountUp(value);
  const lang = useLocale();
  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-4xl font-medium text-pine sm:text-5xl">
        {count.toLocaleString(lang === "vi" ? "vi-VN" : "en-US")}+
      </p>
      <p className="mt-1 text-sm text-ink-soft">{label}</p>
    </div>
  );
}

export function HeroStats() {
  const dict = useDictionary();

  const STATS = [
    { label: dict.heroStats.plants, value: 12000 },
    { label: dict.heroStats.animals, value: 5000 },
    { label: dict.heroStats.images, value: 30000 },
    { label: dict.heroStats.videos, value: 2000 },
  ];

  return (
    <section className="border-b border-line bg-canvas-soft">
      <div className="biome-spectrum-bg h-[3px] w-full" />
      <ScrollReveal className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 py-12 sm:grid-cols-4 sm:px-6 lg:px-8">
        {STATS.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </ScrollReveal>
    </section>
  );
}
