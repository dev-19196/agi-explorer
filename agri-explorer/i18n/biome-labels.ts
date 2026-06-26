import type { Biome, BiomeMeta } from "@/types/content";
import type { Locale } from "./config";

/**
 * i18n/biome-labels.ts
 *
 * `BIOMES` (types/content.ts) là hằng số UI/CSS dùng chung — giữ nguyên,
 * không sửa. File này chỉ thêm bản dịch tiếng Anh cho `name`/`description`,
 * áp vào nơi hiển thị qua `getBiomeMeta()` thay vì tìm trực tiếp trong
 * `BIOMES`.
 */

const BIOME_LABELS_EN: Record<Biome, { name: string; description: string }> = {
  tropical: {
    name: "Tropical Rainforest",
    description: "Dense canopy, high humidity — the richest biodiversity on the planet.",
  },
  plains: {
    name: "Plains",
    description: "Fertile alluvial soil, a key region for staple-crop farming.",
  },
  mountain: {
    name: "Highlands",
    description: "Cold climate — drought-tolerant plants and altitude-adapted animals.",
  },
  desert: {
    name: "Desert",
    description: "Harsh aridity — organisms evolved to store and conserve water.",
  },
  wetland: {
    name: "Wetland",
    description: "Where water meets land — a nutrient-rich ecological buffer zone.",
  },
};

/** Trả về `BiomeMeta` đã dịch theo locale (giữ nguyên `id`/`colorVar`). */
export function getBiomeMeta(biome: BiomeMeta, locale: Locale): BiomeMeta {
  if (locale === "vi") return biome;
  const translation = BIOME_LABELS_EN[biome.id];
  return translation ? { ...biome, ...translation } : biome;
}
