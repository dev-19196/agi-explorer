import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { CalendarDays } from "lucide-react";
import { plants } from "@/lib/data/plants";
import { seasonalEvents, weatherAlerts } from "@/lib/data/seasonal-calendar";
import { REGIONS, REGION_LABELS } from "@/types/content";
import type { Region } from "@/types/content";
import { AgriculturalCalendar } from "@/components/calendar/AgriculturalCalendar";

interface CalendarPageProps {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ region?: string }>;
}

export async function generateMetadata({ params }: CalendarPageProps): Promise<Metadata> {
  const { lang } = await params;
  const d = await getDictionary(lang);
  return { title: d.calendar.title, description: d.calendar.description };
}

const VALID_REGIONS = REGIONS.map((r) => r.id);

export default async function CalendarPage({ params, searchParams }: CalendarPageProps) {
  const { lang } = await params;
  const { region: rawRegion } = await searchParams;
  const d = await getDictionary(lang);

  const activeRegion: Region = VALID_REGIONS.includes(rawRegion as Region)
    ? (rawRegion as Region)
    : "bac";

  const regionMeta = REGIONS.find((r) => r.id === activeRegion)!;
  const filteredEvents = seasonalEvents.filter((e) => e.region === activeRegion);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-pine-soft">
          <CalendarDays className="size-5 text-pine-dark" strokeWidth={1.8} />
        </div>
        <div>
          <h1 className="font-display text-3xl text-ink">{d.calendar.title}</h1>
          <p className="mt-0.5 text-sm text-ink-soft">{d.calendar.subtitle}</p>
        </div>
      </div>

      {/* Region filter */}
      <nav className="mt-7 flex flex-wrap gap-2" aria-label={d.calendar.filterAriaLabel}>
        {REGIONS.map((r) => (
          <a
            key={r.id}
            href={`/calendar?region=${r.id}`}
            className={`rounded-[var(--radius-pill)] border px-4 py-1.5 text-sm font-medium transition-colors ${
              activeRegion === r.id
                ? "border-pine bg-pine text-canvas"
                : "border-line text-ink-soft hover:border-pine hover:text-pine"
            }`}
          >
            {REGION_LABELS[r.id] ?? r.name}
          </a>
        ))}
      </nav>

      <p className="mt-4 max-w-2xl text-sm text-ink-soft">{regionMeta.description}</p>

      <div className="mt-8">
        <AgriculturalCalendar
          events={filteredEvents}
          plants={plants}
          alerts={weatherAlerts}
          region={activeRegion}
        />
      </div>
    </div>
  );
}
