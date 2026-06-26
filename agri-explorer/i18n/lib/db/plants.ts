import { z } from "zod";

import type { Plant } from "../../types/content";
import { apiGet, apiPost } from "./client";
import { plantSchema } from "./schemas";

/** Đọc toàn bộ plants từ AgriExplorerApi (.NET), validate, trả về đúng type
 * `Plant[]` mà `lib/data/plants.ts` đang export — dùng trong `scripts/sync-content.mts`. */
export async function fetchPlants(): Promise<Plant[]> {
  const data = await apiGet<unknown>("/api/plants");
  return z.array(plantSchema).parse(data);
}

/** Upsert (insert hoặc update theo `slug`) danh sách plants — dùng trong
 * `scripts/seed-content.mts` để đẩy dữ liệu mock hiện tại lên AgriExplorerApi. */
export async function upsertPlants(plants: Plant[]): Promise<void> {
  for (const plant of plants) {
    await apiPost("/api/plants", plant);
  }
}
