/**
 * lib/db/schemas.ts
 *
 * Zod schema cho đúng các type domain trong `types/content.ts`. Mục đích:
 * dữ liệu trong Supabase được biên tập qua Studio (giao diện bảng, không có
 * type-check) nên CÓ THỂ sai hình dạng (thiếu field, sai enum, jsonb lệch
 * cấu trúc...). Trước khi dùng dữ liệu đó để sinh lại `lib/data/*.ts`, ta
 * validate nghiêm ngặt — lỗi thì dừng và báo rõ, KHÔNG ghi đè file với dữ
 * liệu rác (tránh phá toàn bộ build của app).
 *
 * Chỉ dùng trong `scripts/*` và `lib/db/*` (Node, build-time) — không bao
 * giờ được import từ `app/` hay `components/`.
 */

import { z } from "zod";

export const biomeSchema = z.enum([
  "tropical",
  "plains",
  "mountain",
  "desert",
  "wetland",
]);

export const plantCategorySchema = z.enum([
  "fruit",
  "vegetable",
  "herbal",
  "industrial",
]);

export const regionSchema = z.enum(["bac", "trung", "nam"]);

export const weatherAlertLevelSchema = z.enum(["info", "caution", "warning"]);

export const mediaTypeSchema = z.enum(["photo", "video", "infographic"]);

export const mediaAspectSchema = z.enum(["square", "portrait", "landscape"]);

export const articleCategorySchema = z.enum([
  "canh-tac",
  "sinh-thai",
  "thu-hoach",
  "dong-vat",
  "kham-pha",
]);

export const mediaAssetSchema = z.object({
  url: z.string().min(1),
  kind: z.enum(["image", "youtube"]),
  caption: z.string(),
  credit: z.string().optional(),
});

export const lifecycleStageSchema = z.object({
  label: z.string().min(1),
  duration: z.string().min(1),
  description: z.string(),
});

export const classificationSchema = z.object({
  kingdom: z.string().min(1),
  family: z.string().min(1),
  genus: z.string().min(1),
  order: z.string().min(1),
});

export const habitatInfoSchema = z.object({
  climate: z.string(),
  terrain: z.string(),
  distribution: z.string(),
  temperatureRange: z.string(),
});

export const plantCareSchema = z.object({
  watering: z.string(),
  light: z.string(),
  soil: z.string(),
  fertilizing: z.string(),
  pests: z.string(),
});

export const animalBehaviorSchema = z.object({
  diet: z.string(),
  socialStructure: z.string(),
  activityPattern: z.string(),
  reproduction: z.string(),
  lifespan: z.string(),
});

export const geoPointSchema = z.object({
  label: z.string().min(1),
  lat: z.number(),
  lon: z.number(),
});

export const plantDetailSchema = z.object({
  overview: z.string().min(1),
  classification: classificationSchema,
  characteristics: z.array(z.string()),
  habitat: habitatInfoSchema,
  care: plantCareSchema,
  growthStages: z.array(lifecycleStageSchema),
  funFacts: z.array(z.string()),
  uses: z.array(z.string()),
  gallery: z.array(mediaAssetSchema),
  distribution: z.array(geoPointSchema).optional(),
});

export const animalDetailSchema = z.object({
  overview: z.string().min(1),
  classification: classificationSchema,
  characteristics: z.array(z.string()),
  habitat: habitatInfoSchema,
  behavior: animalBehaviorSchema,
  lifeStages: z.array(lifecycleStageSchema),
  funFacts: z.array(z.string()),
  conservationStatus: z.string().min(1),
  gallery: z.array(mediaAssetSchema),
  distribution: z.array(geoPointSchema).optional(),
  humanConnection: z.array(z.string()).optional(),
});

export const plantSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  scientificName: z.string().min(1),
  category: plantCategorySchema,
  biome: biomeSchema,
  country: z.string().min(1),
  tagline: z.string().min(1),
  detail: plantDetailSchema.optional(),
});

export const animalSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  scientificName: z.string().min(1),
  biome: biomeSchema,
  country: z.string().min(1),
  tagline: z.string().min(1),
  detail: animalDetailSchema.optional(),
});

export const mediaItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: mediaTypeSchema,
  biome: biomeSchema,
  aspect: mediaAspectSchema,
});

export const articleSectionSchema = z.object({
  type: z.enum([
    "paragraph",
    "heading",
    "tip",
    "warning",
    "image",
    "lifecycle",
    "gallery",
  ]),
  content: z.string().optional(),
  stages: z.array(lifecycleStageSchema).optional(),
  src: z.string().optional(),
  caption: z.string().optional(),
  credit: z.string().optional(),
  images: z
    .array(
      z.object({
        src: z.string().min(1),
        caption: z.string(),
        credit: z.string().optional(),
      }),
    )
    .optional(),
});

export const articleSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  category: articleCategorySchema,
  biome: biomeSchema.optional(),
  readingTimeMin: z.number().int().positive(),
  publishedAt: z.iso.date(),
  coverImage: z.string().min(1),
  coverCaption: z.string().optional(),
  tags: z.array(z.string()),
  relatedSlugs: z.array(z.string()).optional(),
  sections: z.array(articleSectionSchema),
});

export const monthRangeSchema = z.object({
  start: z.number().int().min(1).max(12),
  end: z.number().int().min(1).max(12),
});

export const seasonalEventSchema = z.object({
  id: z.string().min(1),
  plantSlug: z.string().min(1),
  region: regionSchema,
  plantingMonths: monthRangeSchema,
  harvestMonths: monthRangeSchema,
  note: z.string().optional(),
});

export const weatherAlertSchema = z.object({
  id: z.string().min(1),
  biome: biomeSchema,
  region: regionSchema,
  months: z.array(z.number().int().min(1).max(12)),
  level: weatherAlertLevelSchema,
  title: z.string().min(1),
  description: z.string().min(1),
});
