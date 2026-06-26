import { z } from "zod";

import type { SeasonalEvent, WeatherAlert } from "../../types/content";
import { apiGet, apiPost } from "./client";
import { seasonalEventSchema, weatherAlertSchema } from "./schemas";

/** Shape trả về từ .NET API — flat columns (giống row Postgres cũ), khác
 * với domain type `SeasonalEvent` (nested `plantingMonths`/`harvestMonths`).
 * Giữ nguyên cách map 2 chiều như `lib/db/mappers.ts` bản Supabase trước. */
interface SeasonalEventApiRow {
  id: string;
  plantSlug: string;
  region: string;
  plantingStart: number;
  plantingEnd: number;
  harvestStart: number;
  harvestEnd: number;
  note?: string | null;
}

export async function fetchSeasonalEvents(): Promise<SeasonalEvent[]> {
  const rows = await apiGet<SeasonalEventApiRow[]>("/api/seasonal-events");
  return rows.map((row) =>
    seasonalEventSchema.parse({
      id: row.id,
      plantSlug: row.plantSlug,
      region: row.region,
      plantingMonths: { start: row.plantingStart, end: row.plantingEnd },
      harvestMonths: { start: row.harvestStart, end: row.harvestEnd },
      ...(row.note ? { note: row.note } : {}),
    }),
  ) as SeasonalEvent[];
}

export async function upsertSeasonalEvents(events: SeasonalEvent[]): Promise<void> {
  for (const event of events) {
    await apiPost("/api/seasonal-events", {
      id: event.id,
      plantSlug: event.plantSlug,
      region: event.region,
      plantingStart: event.plantingMonths.start,
      plantingEnd: event.plantingMonths.end,
      harvestStart: event.harvestMonths.start,
      harvestEnd: event.harvestMonths.end,
      note: event.note ?? null,
    });
  }
}

export async function fetchWeatherAlerts(): Promise<WeatherAlert[]> {
  const data = await apiGet<unknown>("/api/weather-alerts");
  return z.array(weatherAlertSchema).parse(data);
}

export async function upsertWeatherAlerts(alerts: WeatherAlert[]): Promise<void> {
  for (const alert of alerts) {
    await apiPost("/api/weather-alerts", alert);
  }
}
