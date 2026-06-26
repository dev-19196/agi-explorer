"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useDictionary } from "@/i18n/use-dictionary";

/**
 * Nền Hero dạng "video-like": slideshow ảnh thật của các loài nổi bật,
 * crossfade + Ken Burns (zoom chậm) liên tục bằng GSAP — thay cho SVG tĩnh
 * trước đây. Dùng ảnh thay vì <video> để tránh phụ thuộc vào một file mp4
 * không chắc tải được; khi có asset /public/videos/hero.mp4 thật, có thể
 * thay toàn bộ <div className="absolute inset-0"> bằng <video autoPlay muted loop>.
 */
const SLIDE_URLS = [
  "https://images.unsplash.com/photo-1719807633728-7ff13f7f2b61?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506212928588-93568581fb14?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1674556275226-47b6b393d623?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1780887333912-72313aa0b6c3?q=80&w=2000&auto=format&fit=crop",
];

export function HeroVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dict = useDictionary();

  const SLIDES = [
    { url: SLIDE_URLS[0], alt: dict.heroVisual.slideAlt1 },
    { url: SLIDE_URLS[1], alt: dict.heroVisual.slideAlt2 },
    { url: SLIDE_URLS[2], alt: dict.heroVisual.slideAlt3 },
    { url: SLIDE_URLS[3], alt: dict.heroVisual.slideAlt4 },
  ];

  useGSAP(
    () => {
      const slides = gsap.utils.toArray<HTMLElement>(".hero-slide");
      if (slides.length === 0) return;

      gsap.set(slides, { opacity: 0, scale: 1.08 });
      gsap.set(slides[0], { opacity: 1 });

      const tl = gsap.timeline({ repeat: -1 });
      slides.forEach((slide, i) => {
        tl.to(slide, { scale: 1, duration: 6, ease: "none" }, i * 6)
          .to(slide, { opacity: 1, duration: 1.2 }, i * 6)
          .to(slide, { opacity: 0, duration: 1.2 }, i * 6 + 5);
      });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden bg-pine-dark">
      {SLIDES.map((slide) => (
        <div
          key={slide.url}
          className="hero-slide absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.url})` }}
          role="img"
          aria-label={slide.alt}
        />
      ))}

      {/* overlay tối để chữ luôn rõ trên ảnh */}
      <div className="absolute inset-0 bg-gradient-to-t from-pine-dark via-pine-dark/75 to-pine-dark/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-pine-dark/50 via-transparent to-transparent" />
    </div>
  );
}
