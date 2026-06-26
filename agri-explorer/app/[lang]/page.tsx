import { Hero } from "@/components/hero/Hero";
import { HeroStats } from "@/components/hero/HeroStats";
import { SpeciesMarquee } from "@/components/sections/SpeciesMarquee";
import { CategorySection } from "@/components/sections/CategorySection";
import { FeaturedSection } from "@/components/sections/FeaturedSection";
import { EnvironmentSection } from "@/components/sections/EnvironmentSection";
import { MediaSection } from "@/components/sections/MediaSection";
import { isLocale, DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

interface HomePageProps {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang: rawLang } = await params;
  const lang: Locale = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;
  const dict = await getDictionary(lang);

  return (
    <>
      <Hero />
      <SpeciesMarquee />
      <HeroStats />
      <CategorySection />
      <FeaturedSection />
      <EnvironmentSection lang={lang} dict={dict} />
      <MediaSection />
    </>
  );
}
