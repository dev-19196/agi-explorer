import { plants } from "@/lib/data/plants";
import { animals } from "@/lib/data/animals";
import { BIOMES } from "@/types/content";
import type { Plant, Animal } from "@/types/content";

export type CompareEntry =
  | { kind: "plant"; data: Plant }
  | { kind: "animal"; data: Animal };

export const COMPARE_ENTRIES: CompareEntry[] = [
  ...plants.map((p) => ({ kind: "plant" as const, data: p })),
  ...animals.map((a) => ({ kind: "animal" as const, data: a })),
];

export function compareKey(entry: CompareEntry) {
  return `${entry.kind}:${entry.data.slug}`;
}

export function findEntry(key: string): CompareEntry | undefined {
  return COMPARE_ENTRIES.find((e) => compareKey(e) === key);
}

export const PLANT_CATEGORY_LABEL: Record<Plant["category"], string> = {
  fruit: "Cây ăn quả",
  vegetable: "Rau màu",
  herbal: "Dược liệu",
  industrial: "Công nghiệp",
};

const FALLBACK = "Chưa cập nhật";

/** Tóm tắt các trường có thể so sánh được của 1 entry (cây hoặc vật), không phân biệt loại. */
function summarize(entry: CompareEntry) {
  const biomeName = BIOMES.find((b) => b.id === entry.data.biome)?.name ?? entry.data.biome;

  if (entry.kind === "plant") {
    const d = entry.data.detail;
    return {
      group: PLANT_CATEGORY_LABEL[entry.data.category],
      biome: biomeName,
      country: entry.data.country,
      climate: d?.habitat.climate ?? FALLBACK,
      temperature: d?.habitat.temperatureRange ?? FALLBACK,
      careOrDiet: d?.care.watering ?? FALLBACK,
      careOrDietLabel: "Tưới nước",
      statusOrUse: d?.uses?.[0] ?? FALLBACK,
      statusOrUseLabel: "Công dụng nổi bật",
    };
  }

  const d = entry.data.detail;
  return {
    group: "Động vật",
    biome: biomeName,
    country: entry.data.country,
    climate: d?.habitat.climate ?? FALLBACK,
    temperature: d?.habitat.temperatureRange ?? FALLBACK,
    careOrDiet: d?.behavior.diet ?? FALLBACK,
    careOrDietLabel: "Chế độ ăn",
    statusOrUse: d?.conservationStatus ?? FALLBACK,
    statusOrUseLabel: "Tình trạng bảo tồn",
  };
}

export interface CompareRow {
  label: string;
  a: string;
  b: string;
}

/** Trích các trường có thể so sánh được giữa 2 entry (cây-cây, cây-vật, vật-vật đều chạy được). */
export function buildCompareRows(a: CompareEntry, b: CompareEntry): CompareRow[] {
  const sa = summarize(a);
  const sb = summarize(b);

  return [
    { label: "Tên khoa học", a: a.data.scientificName, b: b.data.scientificName },
    { label: "Nhóm / loại", a: sa.group, b: sb.group },
    { label: "Môi trường sống", a: sa.biome, b: sb.biome },
    { label: "Quốc gia / khu vực", a: sa.country, b: sb.country },
    { label: "Khí hậu", a: sa.climate, b: sb.climate },
    { label: "Nhiệt độ phù hợp", a: sa.temperature, b: sb.temperature },
    { label: `${sa.careOrDietLabel} / ${sb.careOrDietLabel}`, a: sa.careOrDiet, b: sb.careOrDiet },
    { label: `${sa.statusOrUseLabel} / ${sb.statusOrUseLabel}`, a: sa.statusOrUse, b: sb.statusOrUse },
  ];
}
