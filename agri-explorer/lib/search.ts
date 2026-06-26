/**
 * lib/search.ts — Fuzzy search engine cho Agri Explorer
 *
 * Không dùng thư viện ngoài để giữ bundle nhỏ. Thuật toán:
 *  1. Exact match → score cao nhất
 *  2. Prefix match → score cao
 *  3. Subsequence / token match → score trung bình
 *  4. Trigram overlap → cho phép typo 1–2 ký tự
 *
 * Tất cả so sánh đều normalize: lowercase + remove diacritics (tiếng Việt
 * có nhiều dấu, normalize giúp "lua" tìm được "Lúa").
 */

import { plants } from "@/lib/data/plants";
import { animals } from "@/lib/data/animals";
import { mediaItems } from "@/lib/data/media";
import { articles } from "@/lib/data/articles";
import type { Plant, Animal, MediaItem, Article } from "@/types/content";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SearchResultKind = "plant" | "animal" | "media" | "article";

export interface SearchResult {
  kind: SearchResultKind;
  slug: string;
  title: string;
  subtitle: string;
  biome?: string;
  category?: string;
  score: number;
  matchedFields: string[];
  plant?: Plant;
  animal?: Animal;
  media?: MediaItem;
  article?: Article;
}

// ─── Normalise ────────────────────────────────────────────────────────────────

/** Bỏ dấu tiếng Việt, lowercase */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d");
}

// ─── Scoring helpers ──────────────────────────────────────────────────────────

function exactScore(haystack: string, needle: string): number {
  const h = norm(haystack);
  const n = norm(needle);
  if (h === n) return 100;
  if (h.startsWith(n)) return 85;
  if (h.includes(n)) return 70;
  return 0;
}

/** Kiểm tra tất cả token trong needle đều xuất hiện trong haystack */
function tokenScore(haystack: string, needle: string): number {
  const h = norm(haystack);
  const tokens = norm(needle).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 0;
  const matched = tokens.filter((t) => h.includes(t));
  return matched.length === tokens.length
    ? 60
    : matched.length > 0
    ? Math.round((matched.length / tokens.length) * 40)
    : 0;
}

/** Trigram similarity — cho phép typo 1–2 ký tự */
function trigramScore(a: string, b: string): number {
  const na = norm(a);
  const nb = norm(b);
  if (na.length < 3 || nb.length < 3) return 0;

  const trigramsA = new Set<string>();
  for (let i = 0; i < na.length - 2; i++) trigramsA.add(na.slice(i, i + 3));

  let hits = 0;
  for (let i = 0; i < nb.length - 2; i++) {
    if (trigramsA.has(nb.slice(i, i + 3))) hits++;
  }

  const total = trigramsA.size + (nb.length - 2) - hits;
  if (total === 0) return 0;
  const jaccard = hits / total;
  return jaccard > 0.3 ? Math.round(jaccard * 50) : 0;
}

function scoreField(value: string, query: string, weight = 1): { score: number; matched: boolean } {
  const e = exactScore(value, query);
  const t = tokenScore(value, query);
  const g = trigramScore(value, query);
  const best = Math.max(e, t, g);
  return { score: Math.round(best * weight), matched: best > 0 };
}

// ─── Indexing ─────────────────────────────────────────────────────────────────

/** Pre-built index — tính một lần khi module load */
interface IndexEntry {
  kind: SearchResultKind;
  slug: string;
  fields: Array<{ key: string; value: string; weight: number }>;
  plant?: Plant;
  animal?: Animal;
  media?: MediaItem;
  article?: Article;
}

const INDEX: IndexEntry[] = [
  ...plants.map((p): IndexEntry => ({
    kind: "plant",
    slug: p.slug,
    fields: [
      { key: "name", value: p.name, weight: 1.0 },
      { key: "scientificName", value: p.scientificName, weight: 0.9 },
      { key: "tagline", value: p.tagline, weight: 0.5 },
      { key: "biome", value: p.biome, weight: 0.4 },
      { key: "category", value: p.category, weight: 0.4 },
      { key: "country", value: p.country, weight: 0.3 },
      // Thêm overview nếu có
      ...(p.detail?.overview ? [{ key: "overview", value: p.detail.overview.slice(0, 200), weight: 0.3 }] : []),
    ],
    plant: p,
  })),
  ...animals.map((a): IndexEntry => ({
    kind: "animal",
    slug: a.slug,
    fields: [
      { key: "name", value: a.name, weight: 1.0 },
      { key: "scientificName", value: a.scientificName, weight: 0.9 },
      { key: "tagline", value: a.tagline, weight: 0.5 },
      { key: "biome", value: a.biome, weight: 0.4 },
      { key: "country", value: a.country, weight: 0.3 },
      ...(a.detail?.overview ? [{ key: "overview", value: a.detail.overview.slice(0, 200), weight: 0.3 }] : []),
      ...(a.detail?.behavior?.diet ? [{ key: "diet", value: a.detail.behavior.diet, weight: 0.3 }] : []),
    ],
    animal: a,
  })),
  ...mediaItems.map((m): IndexEntry => ({
    kind: "media",
    slug: m.id,
    fields: [
      { key: "title", value: m.title, weight: 1.0 },
      { key: "biome", value: m.biome, weight: 0.4 },
      { key: "type", value: m.type, weight: 0.3 },
    ],
    media: m,
  })),
  ...articles.map((a): IndexEntry => ({
    kind: "article",
    slug: a.slug,
    fields: [
      { key: "title", value: a.title, weight: 1.0 },
      { key: "description", value: a.description, weight: 0.7 },
      { key: "tags", value: a.tags.join(" "), weight: 0.5 },
      { key: "category", value: a.category, weight: 0.3 },
    ],
    article: a,
  })),
];

// ─── Main search function ─────────────────────────────────────────────────────

export interface SearchOptions {
  scope?: "all" | "plants" | "animals" | "media" | "articles";
  limit?: number;
  minScore?: number;
}

export function search(query: string, options: SearchOptions = {}): SearchResult[] {
  const { scope = "all", limit = 50, minScore = 10 } = options;
  const q = query.trim();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const entry of INDEX) {
    // Filter by scope
    if (scope !== "all") {
      if (scope === "plants" && entry.kind !== "plant") continue;
      if (scope === "animals" && entry.kind !== "animal") continue;
      if (scope === "media" && entry.kind !== "media") continue;
      if (scope === "articles" && entry.kind !== "article") continue;
    }

    let totalScore = 0;
    const matchedFields: string[] = [];

    for (const field of entry.fields) {
      const { score, matched } = scoreField(field.value, q, field.weight);
      if (matched) {
        totalScore += score;
        matchedFields.push(field.key);
      }
    }

    if (totalScore < minScore) continue;

    // Cap at 100
    const finalScore = Math.min(totalScore, 100);

    const plant = entry.plant;
    const animal = entry.animal;
    const media = entry.media;
    const article = entry.article;

    results.push({
      kind: entry.kind,
      slug: entry.slug,
      title: plant?.name ?? animal?.name ?? media?.title ?? article?.title ?? entry.slug,
      subtitle: plant?.scientificName ?? animal?.scientificName ?? media?.type ?? article?.category ?? "",
      biome: plant?.biome ?? animal?.biome ?? media?.biome ?? article?.biome,
      category: plant?.category ?? article?.category,
      score: finalScore,
      matchedFields,
      plant,
      animal,
      media,
      article,
    });
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ─── Highlight helper ─────────────────────────────────────────────────────────

/**
 * Trả về array [{text, highlight}] để render <mark> tag
 */
export function highlight(
  text: string,
  query: string
): Array<{ text: string; highlight: boolean }> {
  const n = norm(query);
  if (!n) return [{ text, highlight: false }];

  const normText = norm(text);
  const idx = normText.indexOf(n);
  if (idx === -1) return [{ text, highlight: false }];

  return [
    { text: text.slice(0, idx), highlight: false },
    { text: text.slice(idx, idx + n.length), highlight: true },
    { text: text.slice(idx + n.length), highlight: false },
  ].filter((p) => p.text);
}

// ─── Random species (cho nút "Tôi đang may mắn") ─────────────────────────────

export type RandomSpecies =
  | { kind: "plant"; slug: string; name: string }
  | { kind: "animal"; slug: string; name: string };

export function getRandomSpecies(): RandomSpecies {
  const all: RandomSpecies[] = [
    ...plants.map((p) => ({ kind: "plant" as const, slug: p.slug, name: p.name })),
    ...animals.map((a) => ({ kind: "animal" as const, slug: a.slug, name: a.name })),
  ];
  return all[Math.floor(Math.random() * all.length)];
}

// ─── Smart related (dùng ở trang detail) ─────────────────────────────────────

/** Related plants: ưu tiên cùng category HOẶC cùng biome, không lấy cùng slug */
export function getRelatedPlants(current: Plant, limit = 4): Plant[] {
  const scored = plants
    .filter((p) => p.slug !== current.slug)
    .map((p) => {
      let score = 0;
      if (p.category === current.category) score += 3;  // cùng loại quan trọng nhất
      if (p.biome === current.biome) score += 2;         // cùng biome
      if (p.country === current.country) score += 1;     // cùng quốc gia
      return { plant: p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.plant);
}

/** Related animals: ưu tiên cùng biome, sau đó diet type từ behavior.diet */
export function getRelatedAnimals(current: Animal, limit = 4): Animal[] {
  // Phân loại diet đơn giản từ text
  const dietType = (a: Animal) => {
    const d = a.detail?.behavior?.diet?.toLowerCase() ?? "";
    if (d.includes("ăn cỏ") || d.includes("herbivore") || d.includes("thực vật")) return "herbivore";
    if (d.includes("ăn thịt") || d.includes("carnivore")) return "carnivore";
    if (d.includes("ăn tạp") || d.includes("omnivore")) return "omnivore";
    return "unknown";
  };

  const currentDiet = dietType(current);

  const scored = animals
    .filter((a) => a.slug !== current.slug)
    .map((a) => {
      let score = 0;
      if (a.biome === current.biome) score += 3;
      if (currentDiet !== "unknown" && dietType(a) === currentDiet) score += 2;
      if (a.country === current.country) score += 1;
      return { animal: a, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.animal);
}
