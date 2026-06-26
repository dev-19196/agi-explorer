import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { animals } from "@/lib/data/animals";
import { AnimalsExplorer } from "@/components/sections/AnimalsExplorer";

interface Props {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const d = await getDictionary(lang);
  return { title: d.animals.title, description: d.animals.description };
}

export default async function AnimalsPage({ params }: Props) {
  const { lang } = await params;
  const d = await getDictionary(lang);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl text-ink">{d.animals.title}</h1>
      <p className="mt-2 text-ink-soft">
        {animals.length} {d.animals.countLabel}
      </p>
      <AnimalsExplorer />
    </div>
  );
}
