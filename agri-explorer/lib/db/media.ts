import type { MediaItem } from "../../types/content";
import { getServiceClient } from "./client";
import { fromMediaItemRow, toMediaItemRow, type MediaItemRow } from "./mappers";

const TABLE = "media_items";

export async function fetchMediaItems(): Promise<MediaItem[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, title, type, biome, aspect")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Lỗi đọc bảng "${TABLE}": ${error.message}`);
  }

  return (data as MediaItemRow[]).map(fromMediaItemRow);
}

export async function upsertMediaItems(items: MediaItem[]): Promise<void> {
  if (items.length === 0) return;

  const supabase = getServiceClient();
  const rows = items.map(toMediaItemRow);

  const { error } = await supabase.from(TABLE).upsert(rows, { onConflict: "id" });

  if (error) {
    throw new Error(`Lỗi upsert bảng "${TABLE}": ${error.message}`);
  }
}
