/** Types khớp 1:1 với DTO/record bên AgriExplorerApi (.NET). Property camelCase vì
 * Program.cs đã set `JsonNamingPolicy.CamelCase`. */

export type Biome = "tropical" | "plains" | "mountain" | "desert" | "wetland";
export type PlantCategory = "fruit" | "vegetable" | "herbal" | "industrial";
export type RegionCode = "bac" | "trung" | "nam";
export type WeatherAlertLevel = "info" | "caution" | "warning";
export type MediaType = "photo" | "video" | "infographic";
export type MediaAspect = "square" | "portrait" | "landscape";
export type ArticleCategory = "canh-tac" | "sinh-thai" | "thu-hoach" | "dong-vat" | "kham-pha";

export interface PlantDto {
  slug: string;
  name: string;
  scientificName: string;
  category: PlantCategory;
  biome: Biome;
  country: string;
  tagline: string;
  detail?: unknown;
}

export interface AnimalDto {
  slug: string;
  name: string;
  scientificName: string;
  biome: Biome;
  country: string;
  tagline: string;
  detail?: unknown;
}

export interface ArticleDto {
  slug: string;
  title: string;
  description: string;
  category: ArticleCategory;
  biome?: Biome | null;
  readingTimeMin: number;
  publishedAt: string;
  coverImage: string;
  coverCaption?: string | null;
  tags: string[];
  relatedSlugs: string[];
  sections: unknown;
}

export interface MediaDto {
  id: string;
  title: string;
  type: MediaType;
  biome: Biome;
  aspect: MediaAspect;
}

export interface SeasonalEventDto {
  id: string;
  plantSlug: string;
  region: RegionCode;
  plantingStart: number;
  plantingEnd: number;
  harvestStart: number;
  harvestEnd: number;
  note?: string | null;
}

export interface WeatherAlertDto {
  id: string;
  biome: Biome;
  region: RegionCode;
  months: number[];
  level: WeatherAlertLevel;
  title: string;
  description: string;
}

export const BIOME_COLOR_VAR: Record<Biome, string> = {
  tropical: "var(--biome-tropical)",
  plains: "var(--biome-plains)",
  mountain: "var(--biome-mountain)",
  desert: "var(--biome-desert)",
  wetland: "var(--biome-wetland)",
};

export const BIOME_LABEL_VI: Record<Biome, string> = {
  tropical: "Nhiệt đới",
  plains: "Đồng bằng",
  mountain: "Miền núi",
  desert: "Hoang mạc",
  wetland: "Đất ngập nước",
};

export const BIOME_OPTIONS: Biome[] = ["tropical", "plains", "mountain", "desert", "wetland"];
export const PLANT_CATEGORY_OPTIONS: PlantCategory[] = ["fruit", "vegetable", "herbal", "industrial"];
export const REGION_OPTIONS: RegionCode[] = ["bac", "trung", "nam"];
export const WEATHER_LEVEL_OPTIONS: WeatherAlertLevel[] = ["info", "caution", "warning"];
export const MEDIA_TYPE_OPTIONS: MediaType[] = ["photo", "video", "infographic"];
export const MEDIA_ASPECT_OPTIONS: MediaAspect[] = ["square", "portrait", "landscape"];
export const ARTICLE_CATEGORY_OPTIONS: ArticleCategory[] = [
  "canh-tac",
  "sinh-thai",
  "thu-hoach",
  "dong-vat",
  "kham-pha",
];
