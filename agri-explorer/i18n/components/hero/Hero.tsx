"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroVisual } from "./HeroVisual";
import { HeroSearch } from "./HeroSearch";
import { useDictionary } from "@/i18n/use-dictionary";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const dict = useDictionary();
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Entrance: chữ + search bay lên lần lượt khi tải trang
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.15 }
        );
      }

      // Parallax: nền trôi chậm hơn nội dung khi cuộn xuống
      if (visualRef.current) {
        gsap.to(visualRef.current, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center text-canvas sm:px-6"
    >
      <div ref={visualRef} className="absolute inset-0 -top-24 bottom-0">
        <HeroVisual />
      </div>

      <div ref={contentRef} className="relative z-10 flex flex-col items-center gap-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-honey">
          {dict.hero.eyebrow}
        </p>
        <h1 className="font-display text-5xl font-medium leading-[1.05] text-balance sm:text-7xl">
          {dict.hero.headline}
        </h1>
        <p className="max-w-md text-base text-canvas/85 sm:text-lg">{dict.hero.subheadline}</p>

        <div className="mt-2 w-full">
          <HeroSearch />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-canvas/60">
        <svg width="20" height="32" viewBox="0 0 20 32" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="18" height="30" rx="9" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="10" cy="10" r="2.4" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}
