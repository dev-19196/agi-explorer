"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { plants } from "@/lib/data/plants";
import { animals } from "@/lib/data/animals";
import { useLocale } from "@/i18n/use-dictionary";
import { translateSpecies } from "@/i18n/species-translations";
import type { Locale } from "@/i18n/config";

function buildItems(lang: Locale) {
  return [
    ...plants.map((p) => translateSpecies(p, lang)).map((p) => ({ name: p.name, scientific: p.scientificName })),
    ...animals.map((a) => translateSpecies(a, lang)).map((a) => ({ name: a.name, scientific: a.scientificName })),
  ];
}

function Track({ items }: { items: ReturnType<typeof buildItems> }) {
  return (
    <div className="marquee-track flex shrink-0 items-center gap-10 pr-10">
      {items.map((item, i) => (
        <span key={`${item.name}-${i}`} className="flex items-center gap-3 whitespace-nowrap">
          <span className="font-display text-lg text-ink sm:text-xl">{item.name}</span>
          <span className="font-display text-sm italic text-ink-faint sm:text-base">{item.scientific}</span>
          <span aria-hidden className="size-1.5 rounded-full bg-honey" />
        </span>
      ))}
    </div>
  );
}

/** Băng chữ chạy ngang vô hạn, dừng lại khi hover/touch để dễ đọc. */
export function SpeciesMarquee() {
  const lang = useLocale();
  const items = buildItems(lang);
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tracks = gsap.utils.toArray<HTMLElement>(".marquee-track", rootRef.current!);
      if (tracks.length < 2) return;

      const width = tracks[0].offsetWidth;
      const tween = gsap.to(tracks, {
        x: -width,
        duration: 55,
        ease: "none",
        repeat: -1,
      });

      const root = rootRef.current;
      const pause = () => tween.timeScale(0.08);
      const resume = () => tween.timeScale(1);
      root?.addEventListener("mouseenter", pause);
      root?.addEventListener("mouseleave", resume);

      return () => {
        root?.removeEventListener("mouseenter", pause);
        root?.removeEventListener("mouseleave", resume);
      };
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className="relative flex overflow-hidden border-y border-line bg-canvas-soft py-5"
    >
      <Track items={items} />
      <Track items={items} />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-canvas-soft to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-canvas-soft to-transparent" />
    </div>
  );
}
