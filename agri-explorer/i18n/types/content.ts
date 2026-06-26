/**
 * Type dùng chung cho dữ liệu nội dung.
 * Đây là dữ liệu mock cho Sprint 1 — khi nối CMS/DB thật ở Sprint 2,
 * giữ nguyên shape này hoặc map response API về đúng type để các
 * component (PlantCard, AnimalCard, FeaturedSection...) không cần sửa.
 */

export type Biome =
  | "tropical" // Rừng nhiệt đới
  | "plains" // Đồng bằng
  | "mountain" // Núi cao
  | "desert" // Sa mạc
  | "wetland"; // Đất ngập nước

export interface BiomeMeta {
  id: Biome;
  name: string;
  description: string;
  colorVar: string; // CSS variable: var(--biome-xxx)
}

export const BIOMES: BiomeMeta[] = [
  {
    id: "tropical",
    name: "Rừng nhiệt đới",
    description: "Tầng lá rậm rạp, độ ẩm cao, đa dạng sinh học lớn nhất hành tinh.",
    colorVar: "var(--biome-tropical)",
  },
  {
    id: "plains",
    name: "Đồng bằng",
    description: "Đất phù sa màu mỡ, vùng canh tác lương thực trọng yếu.",
    colorVar: "var(--biome-plains)",
  },
  {
    id: "mountain",
    name: "Núi cao",
    description: "Khí hậu lạnh, thực vật chịu hạn và động vật thích nghi độ cao.",
    colorVar: "var(--biome-mountain)",
  },
  {
    id: "desert",
    name: "Sa mạc",
    description: "Khô hạn khắc nghiệt, sinh vật tiến hoá để tích và giữ nước.",
    colorVar: "var(--biome-desert)",
  },
  {
    id: "wetland",
    name: "Đất ngập nước",
    description: "Giao giữa nước và đất, vùng đệm sinh thái giàu dưỡng chất.",
    colorVar: "var(--biome-wetland)",
  },
];

export type PlantCategory = "fruit" | "vegetable" | "herbal" | "industrial";

/** Một ảnh/video thật dùng cho gallery chi tiết loài. */
export interface MediaAsset {
  url: string; // ảnh: link CDN trực tiếp. video: id YouTube
  kind: "image" | "youtube";
  caption: string;
  credit?: string; // tác giả ảnh (Unsplash yêu cầu ghi nhận tinh thần, không bắt buộc)
}

/** Một mốc trong vòng đời / chu kỳ sinh trưởng — dùng cho cả cây và con vật. */
export interface LifecycleStage {
  label: string;
  duration: string;
  description: string;
}

/** Khối "Phân loại khoa học" chi tiết hơn taxon đơn giản ban đầu. */
export interface Classification {
  kingdom: string;
  family: string;
  genus: string;
  order: string;
}

/** Điều kiện môi trường sống chi tiết. */
export interface HabitatInfo {
  climate: string;
  terrain: string;
  distribution: string;
  temperatureRange: string;
}

/** Thông tin chăm bón — dành cho cây trồng. */
export interface PlantCare {
  watering: string;
  light: string;
  soil: string;
  fertilizing: string;
  pests: string;
}

/** Thông tin tập tính / chăm sóc — dành cho động vật. */
export interface AnimalBehavior {
  diet: string;
  socialStructure: string;
  activityPattern: string;
  reproduction: string;
  lifespan: string;
}

/** Một điểm địa lý trong vùng phân bố của loài. */
export interface GeoPoint {
  label: string;
  lat: number;
  lon: number;
}

/** Khối chi tiết đầy đủ — optional vì chưa phải mọi loài đều đã biên soạn xong. */
export interface PlantDetail {
  overview: string;
  classification: Classification;
  characteristics: string[];
  habitat: HabitatInfo;
  care: PlantCare;
  growthStages: LifecycleStage[];
  funFacts: string[];
  uses: string[];
  gallery: MediaAsset[];
  distribution?: GeoPoint[];
}

export interface AnimalDetail {
  overview: string;
  classification: Classification;
  characteristics: string[];
  habitat: HabitatInfo;
  behavior: AnimalBehavior;
  lifeStages: LifecycleStage[];
  funFacts: string[];
  conservationStatus: string;
  gallery: MediaAsset[];
  distribution?: GeoPoint[];
  /** Giá trị kinh tế / văn hoá gắn với đời sống con người (song song với PlantDetail.uses). */
  humanConnection?: string[];
}

export interface Plant {
  slug: string;
  name: string;
  scientificName: string;
  category: PlantCategory;
  biome: Biome;
  country: string;
  tagline: string;
  detail?: PlantDetail;
}

export interface Animal {
  slug: string;
  name: string;
  scientificName: string;
  biome: Biome;
  country: string;
  tagline: string;
  detail?: AnimalDetail;
}

export type MediaType = "photo" | "video" | "infographic";

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  biome: Biome;
  aspect: "square" | "portrait" | "landscape";
}

// ─── Knowledge / Article ─────────────────────────────────────────────────────

export type ArticleCategory =
  | "canh-tac"       // Kỹ thuật canh tác
  | "sinh-thai"      // Sinh thái & môi trường
  | "thu-hoach"      // Thu hoạch & bảo quản
  | "dong-vat"       // Động vật & chăn nuôi
  | "kham-pha";      // Khám phá & sự kiện thú vị

/** Nhãn hiển thị cho từng category bài viết — hằng số UI, không thuộc nội
 * dung biên tập nên không lưu trong Supabase (xem `supabase/schema.sql`). */
export const ARTICLE_CATEGORY_LABELS: Record<ArticleCategory, string> = {
  "canh-tac": "Kỹ thuật canh tác",
  "sinh-thai": "Sinh thái",
  "thu-hoach": "Thu hoạch",
  "dong-vat": "Động vật",
  "kham-pha": "Khám phá",
};

export interface ArticleSection {
  type: "paragraph" | "heading" | "tip" | "warning" | "image" | "lifecycle" | "gallery";
  content?: string;
  // lifecycle section
  stages?: LifecycleStage[];
  // image section
  src?: string;
  caption?: string;
  credit?: string;
  // gallery section
  images?: Array<{ src: string; caption: string; credit?: string }>;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: ArticleCategory;
  biome?: Biome;
  readingTimeMin: number;
  publishedAt: string; // ISO date string
  coverImage: string;
  coverCaption?: string;
  tags: string[];
  relatedSlugs?: string[]; // slug của plant/animal liên quan
  sections: ArticleSection[];
}

// ─── Mùa vụ / Lịch nông nghiệp ───────────────────────────────────────────────

export type Region = "bac" | "trung" | "nam";

export interface RegionMeta {
  id: Region;
  name: string;
  description: string;
}

export const REGIONS: RegionMeta[] = [
  {
    id: "bac",
    name: "Miền Bắc",
    description: "Khí hậu 4 mùa rõ rệt, có mùa đông lạnh — lịch vụ thường lệch 1–2 tháng so với miền Nam.",
  },
  {
    id: "trung",
    name: "Miền Trung",
    description: "Mưa bão tập trung cuối năm, nắng hạn gay gắt giữa năm — canh tác phải tránh khung thời tiết cực đoan.",
  },
  {
    id: "nam",
    name: "Miền Nam",
    description: "Khí hậu 2 mùa mưa–khô, nhiệt độ ổn định quanh năm, có thể canh tác gần như liên tục.",
  },
];

/** Nhãn hiển thị ngắn cho từng vùng — hằng số UI, tương tự
 * ARTICLE_CATEGORY_LABELS, không lưu trong Supabase. */
export const REGION_LABELS: Record<Region, string> = {
  bac: "Miền Bắc",
  trung: "Miền Trung",
  nam: "Miền Nam",
};

/**
 * Một dải tháng trong năm, 1–12. Có thể "vòng" qua năm (ví dụ start=11, end=2
 * nghĩa là tháng 11 → tháng 2 năm sau) — UI cần xử lý wrap-around này.
 */
export interface MonthRange {
  start: number; // 1-12
  end: number; // 1-12
}

/** Một sự kiện mùa vụ: cây gì, trồng/thu hoạch lúc nào, ở vùng nào. */
export interface SeasonalEvent {
  id: string;
  plantSlug: string; // tham chiếu Plant.slug
  region: Region;
  plantingMonths: MonthRange;
  harvestMonths: MonthRange;
  note?: string; // ghi chú canh tác ngắn riêng cho vùng/vụ này
}

export type WeatherAlertLevel = "info" | "caution" | "warning";

/**
 * Mock cảnh báo thời tiết/mùa theo biome — skeleton để sau nối API thời tiết
 * thật (ví dụ NCHMF). Hiện chỉ là dữ liệu tĩnh theo tháng.
 */
export interface WeatherAlert {
  id: string;
  biome: Biome;
  region: Region;
  months: number[]; // các tháng áp dụng cảnh báo, 1-12
  level: WeatherAlertLevel;
  title: string;
  description: string;
}
