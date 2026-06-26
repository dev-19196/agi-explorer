import type { Plant } from "../../types/content";
import { getServiceClient } from "./client";
import { fromPlantRow, toPlantRow, type PlantRow } from "./mappers";

const TABLE = "plants";

/** Đọc toàn bộ plants từ Supabase, validate, trả về đúng type `Plant[]` mà
 * `lib/data/plants.ts` đang export — dùng trong `scripts/sync-content.mts`. */
export async function fetchPlants(): Promise<Plant[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("slug, name, scientific_name, category, biome, country, tagline, detail")
    .order("slug", { ascending: true });

  if (error) {
    throw new Error(`Lỗi đọc bảng "${TABLE}": ${error.message}`);
  }

  return (data as PlantRow[]).map(fromPlantRow);
}

/** Upsert (insert hoặc update theo `slug`) danh sách plants — dùng trong
 * `scripts/seed-content.mts` để đẩy dữ liệu mock hiện tại lên Supabase. */
export async function upsertPlants(plants: Plant[]): Promise<void> {
  if (plants.length === 0) return;

  const supabase = getServiceClient();
  const rows = plants.map(toPlantRow);

  const { error } = await supabase.from(TABLE).upsert(rows, { onConflict: "slug" });

  if (error) {
    throw new Error(`Lỗi upsert bảng "${TABLE}": ${error.message}`);
  }
}
