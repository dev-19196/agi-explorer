"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { plants } from "@/lib/data/plants";
import { animals } from "@/lib/data/animals";
import { PlantCard } from "@/components/cards/PlantCard";
import { AnimalCard } from "@/components/cards/AnimalCard";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { TiltCard } from "@/components/animation/TiltCard";
import { useLocale, useDictionary } from "@/i18n/use-dictionary";

// Trộn cây + động vật cho cảm giác "khám phá ngẫu nhiên" mỗi ngày
const featured = [
  ...plants.slice(0, 4).map((p) => ({ type: "plant" as const, data: p })),
  ...animals.slice(0, 4).map((a) => ({ type: "animal" as const, data: a })),
];

export function FeaturedSection() {
  const lang = useLocale();
  const dict = useDictionary();
  return (
    <section className="bg-canvas-soft py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">
            {dict.featuredSection.title}
          </h2>
          <p className="hidden text-sm text-ink-faint sm:block">{dict.featuredSection.swipeHint}</p>
        </ScrollReveal>
      </div>

      <div className="mt-8 overflow-hidden pl-4 sm:pl-6 lg:pl-8">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={1.3}
          breakpoints={{
            480: { slidesPerView: 1.8 },
            768: { slidesPerView: 2.6 },
            1024: { slidesPerView: 3.4 },
            1280: { slidesPerView: 4.2 },
          }}
          className="!pr-4 sm:!pr-6 lg:!pr-8 [&_.swiper-button-next]:!text-pine [&_.swiper-button-prev]:!text-pine"
        >
          {featured.map((item) => (
            <SwiperSlide key={`${item.type}-${item.data.slug}`}>
              <TiltCard>
                {item.type === "plant" ? (
                  <PlantCard plant={item.data} lang={lang} />
                ) : (
                  <AnimalCard animal={item.data} lang={lang} />
                )}
              </TiltCard>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
