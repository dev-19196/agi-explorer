import type { Locale } from "./config";

/**
 * i18n/species-translations.ts
 *
 * Bản dịch tiếng Anh cho phần hiển thị ngắn của mỗi loài — neo bằng
 * `scientificName` (không đổi theo ngôn ngữ, đúng như PLAN.md yêu cầu).
 *
 * Có chủ đích KHÔNG dịch: `detail` (overview, classification, care,
 * behavior, growthStages, funFacts, gallery...) — nội dung dài này vẫn chỉ
 * tiếng Việt, xem `VietnameseOnlyNote`. File này tách biệt hoàn toàn khỏi
 * `lib/db/*` (Mục 6b) — không đụng tới schema/Zod đã verify ở 6b.
 */

interface SpeciesTranslation {
  name: string;
  tagline: string;
  country: string;
}

const SPECIES_TRANSLATIONS_EN: Record<string, SpeciesTranslation> = {
  // ─── Plants ──────────────────────────────────────────────────────────────
  "Oryza sativa": {
    name: "Rice",
    tagline: "A staple grain feeding more than half of Asia's population.",
    country: "Vietnam",
  },
  "Coffea canephora": {
    name: "Robusta Coffee",
    tagline: "Coffee beans that lead the Central Highlands' export output.",
    country: "Vietnam",
  },
  "Durio zibethinus": {
    name: "Durian",
    tagline: "The \"king of fruits,\" known for its spiky shell and divisive smell.",
    country: "Vietnam",
  },
  "Panax ginseng": {
    name: "Ginseng",
    tagline: "A prized medicinal root that grows slowly on cold mountain slopes.",
    country: "South Korea",
  },
  "Opuntia ficus-indica": {
    name: "Prickly Pear Cactus",
    tagline: "Stores water in its pads to survive prolonged drought.",
    country: "Mexico",
  },
  "Nelumbo nucifera": {
    name: "Lotus",
    tagline: "Grows out of the mud yet produces one of the purest flowers.",
    country: "Vietnam",
  },
  "Zea mays": {
    name: "Corn (Maize)",
    tagline: "The staple crop with the largest global production volume.",
    country: "Mexico",
  },
  "Camellia sinensis var. assamica": {
    name: "Shan Tuyet Tea",
    tagline: "Centuries-old tea trees growing high in the Northwest mountains.",
    country: "Vietnam",
  },

  // ─── Animals ─────────────────────────────────────────────────────────────
  "Elephas maximus": {
    name: "Asian Elephant",
    tagline: "Southeast Asia's largest land mammal, living in matriarchal herds.",
    country: "Vietnam",
  },
  "Bos grunniens": {
    name: "Yak",
    tagline: "A thick coat lets it withstand temperatures below -30°C on the plateau.",
    country: "Tibet",
  },
  "Camelus dromedarius": {
    name: "Dromedary Camel",
    tagline: "Can go more than a week without water in the desert.",
    country: "Saudi Arabia",
  },
  "Bubalus bubalis": {
    name: "Water Buffalo",
    tagline: "A farmer's companion in the flooded rice fields.",
    country: "Vietnam",
  },
  "Tyto alba": {
    name: "Barn Owl",
    tagline: "A natural rodent hunter that protects crops at night.",
    country: "Vietnam",
  },
  "Ara macao": {
    name: "Scarlet Macaw",
    tagline: "Vivid plumage high in the canopy of the Amazon rainforest.",
    country: "Brazil",
  },
};

/**
 * Dịch `name`/`tagline`/`country` của 1 loài theo locale hiện tại. Locale
 * `vi` hoặc loài chưa có bản dịch → trả về nguyên bản (fallback an toàn,
 * không bao giờ hiện chuỗi rỗng).
 */
export function translateSpecies<T extends { scientificName: string; name: string; tagline: string; country: string }>(
  item: T,
  locale: Locale,
): T {
  if (locale === "vi") return item;
  const translation = SPECIES_TRANSLATIONS_EN[item.scientificName];
  if (!translation) return item;
  return { ...item, ...translation };
}
