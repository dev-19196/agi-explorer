/**
 * lib/db/mappers.ts
 *
 * Map 2 chiều giữa "row" Postgres (snake_case, đúng cột trong
 * `supabase/schema.sql`) và type domain camelCase trong `types/content.ts`
 * mà toàn bộ component của app đang dùng.
 *
 * `fromRow*`  : Supabase row → domain type (đi qua Zod parse để chặn dữ liệu
 *               sai hình dạng do biên tập tay trong Supabase Studio).
 * `toRow*`    : domain type (từ `lib/data/*.ts` hiện có) → row để upsert lên
 *               Supabase (dùng trong `scripts/seed-content.mts`).
 */

import type {
  Animal,
  AnimalDetail,
  Article,
  ArticleSection,
  MediaItem,
  Plant,
  PlantDetail,
  Region,
  SeasonalEvent,
  WeatherAlert,
} from "../../types/content";
import {
  animalSchema,
  articleSchema,
  mediaItemSchema,
  plantSchema,
  seasonalEventSchema,
  weatherAlertSchema,
} from "./schemas";

// ─── Row types (đúng cột trong supabase/schema.sql) ─────────────────────────

export interface PlantRow {
  slug: string;
  name: string;
  scientific_name: string;
  category: Plant["category"];
  biome: Plant["biome"];
  country: string;
  tagline: string;
  detail: PlantDetail | null;
}

export interface AnimalRow {
  slug: string;
  name: string;
  scientific_name: string;
  biome: Animal["biome"];
  country: string;
  tagline: string;
  detail: AnimalDetail | null;
}

export interface MediaItemRow {
  id: string;
  title: string;
  type: MediaItem["type"];
  biome: MediaItem["biome"];
  aspect: MediaItem["aspect"];
}

export interface ArticleRow {
  slug: string;
  title: string;
  description: string;
  category: Article["category"];
  biome: Article["biome"] | null;
  reading_time_min: number;
  published_at: string;
  cover_image: string;
  cover_caption: string | null;
  tags: string[];
  related_slugs: string[];
  sections: ArticleSection[];
}

export interface SeasonalEventRow {
  id: string;
  plant_slug: string;
  region: Region;
  planting_start: number;
  planting_end: number;
  harvest_start: number;
  harvest_end: number;
  note: string | null;
}

export interface WeatherAlertRow {
  id: string;
  biome: WeatherAlert["biome"];
  region: Region;
  months: number[];
  level: WeatherAlert["level"];
  title: string;
  description: string;
}

// ─── row → domain (validate bằng Zod, throw nếu sai hình dạng) ─────────────

export function fromPlantRow(row: PlantRow): Plant {
  return plantSchema.parse({
    slug: row.slug,
    name: row.name,
    scientificName: row.scientific_name,
    category: row.category,
    biome: row.biome,
    country: row.country,
    tagline: row.tagline,
    ...(row.detail ? { detail: row.detail } : {}),
  }) as Plant;
}

export function fromAnimalRow(row: AnimalRow): Animal {
  return animalSchema.parse({
    slug: row.slug,
    name: row.name,
    scientificName: row.scientific_name,
    biome: row.biome,
    country: row.country,
    tagline: row.tagline,
    ...(row.detail ? { detail: row.detail } : {}),
  }) as Animal;
}

export function fromMediaItemRow(row: MediaItemRow): MediaItem {
  return mediaItemSchema.parse({
    id: row.id,
    title: row.title,
    type: row.type,
    biome: row.biome,
    aspect: row.aspect,
  }) as MediaItem;
}

export function fromArticleRow(row: ArticleRow): Article {
  return articleSchema.parse({
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    ...(row.biome ? { biome: row.biome } : {}),
    readingTimeMin: row.reading_time_min,
    publishedAt: row.published_at,
    coverImage: row.cover_image,
    ...(row.cover_caption ? { coverCaption: row.cover_caption } : {}),
    tags: row.tags,
    ...(row.related_slugs.length ? { relatedSlugs: row.related_slugs } : {}),
    sections: row.sections,
  }) as Article;
}

export function fromSeasonalEventRow(row: SeasonalEventRow): SeasonalEvent {
  return seasonalEventSchema.parse({
    id: row.id,
    plantSlug: row.plant_slug,
    region: row.region,
    plantingMonths: { start: row.planting_start, end: row.planting_end },
    harvestMonths: { start: row.harvest_start, end: row.harvest_end },
    ...(row.note ? { note: row.note } : {}),
  }) as SeasonalEvent;
}

export function fromWeatherAlertRow(row: WeatherAlertRow): WeatherAlert {
  return weatherAlertSchema.parse({
    id: row.id,
    biome: row.biome,
    region: row.region,
    months: row.months,
    level: row.level,
    title: row.title,
    description: row.description,
  }) as WeatherAlert;
}

// ─── domain → row (dùng để seed Supabase từ lib/data/*.ts hiện có) ─────────

export function toPlantRow(plant: Plant): PlantRow {
  return {
    slug: plant.slug,
    name: plant.name,
    scientific_name: plant.scientificName,
    category: plant.category,
    biome: plant.biome,
    country: plant.country,
    tagline: plant.tagline,
    detail: plant.detail ?? null,
  };
}

export function toAnimalRow(animal: Animal): AnimalRow {
  return {
    slug: animal.slug,
    name: animal.name,
    scientific_name: animal.scientificName,
    biome: animal.biome,
    country: animal.country,
    tagline: animal.tagline,
    detail: animal.detail ?? null,
  };
}

export function toMediaItemRow(item: MediaItem): MediaItemRow {
  return {
    id: item.id,
    title: item.title,
    type: item.type,
    biome: item.biome,
    aspect: item.aspect,
  };
}

export function toArticleRow(article: Article): ArticleRow {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    category: article.category,
    biome: article.biome ?? null,
    reading_time_min: article.readingTimeMin,
    published_at: article.publishedAt,
    cover_image: article.coverImage,
    cover_caption: article.coverCaption ?? null,
    tags: article.tags,
    related_slugs: article.relatedSlugs ?? [],
    sections: article.sections,
  };
}

export function toSeasonalEventRow(event: SeasonalEvent): SeasonalEventRow {
  return {
    id: event.id,
    plant_slug: event.plantSlug,
    region: event.region,
    planting_start: event.plantingMonths.start,
    planting_end: event.plantingMonths.end,
    harvest_start: event.harvestMonths.start,
    harvest_end: event.harvestMonths.end,
    note: event.note ?? null,
  };
}

export function toWeatherAlertRow(alert: WeatherAlert): WeatherAlertRow {
  return {
    id: alert.id,
    biome: alert.biome,
    region: alert.region,
    months: alert.months,
    level: alert.level,
    title: alert.title,
    description: alert.description,
  };
}
