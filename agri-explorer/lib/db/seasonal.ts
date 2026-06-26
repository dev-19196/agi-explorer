import type { SeasonalEvent, WeatherAlert } from "../../types/content";
import { getServiceClient } from "./client";
import {
  fromSeasonalEventRow,
  fromWeatherAlertRow,
  toSeasonalEventRow,
  toWeatherAlertRow,
  type SeasonalEventRow,
  type WeatherAlertRow,
} from "./mappers";

const EVENTS_TABLE = "seasonal_events";
const ALERTS_TABLE = "weather_alerts";

export async function fetchSeasonalEvents(): Promise<SeasonalEvent[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from(EVENTS_TABLE)
    .select(
      "id, plant_slug, region, planting_start, planting_end, harvest_start, harvest_end, note",
    )
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Lỗi đọc bảng "${EVENTS_TABLE}": ${error.message}`);
  }

  return (data as SeasonalEventRow[]).map(fromSeasonalEventRow);
}

export async function upsertSeasonalEvents(events: SeasonalEvent[]): Promise<void> {
  if (events.length === 0) return;

  const supabase = getServiceClient();
  const rows = events.map(toSeasonalEventRow);

  const { error } = await supabase.from(EVENTS_TABLE).upsert(rows, { onConflict: "id" });

  if (error) {
    throw new Error(`Lỗi upsert bảng "${EVENTS_TABLE}": ${error.message}`);
  }
}

export async function fetchWeatherAlerts(): Promise<WeatherAlert[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from(ALERTS_TABLE)
    .select("id, biome, region, months, level, title, description")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Lỗi đọc bảng "${ALERTS_TABLE}": ${error.message}`);
  }

  return (data as WeatherAlertRow[]).map(fromWeatherAlertRow);
}

export async function upsertWeatherAlerts(alerts: WeatherAlert[]): Promise<void> {
  if (alerts.length === 0) return;

  const supabase = getServiceClient();
  const rows = alerts.map(toWeatherAlertRow);

  const { error } = await supabase.from(ALERTS_TABLE).upsert(rows, { onConflict: "id" });

  if (error) {
    throw new Error(`Lỗi upsert bảng "${ALERTS_TABLE}": ${error.message}`);
  }
}
