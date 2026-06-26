import type { Animal } from "../../types/content";
import { getServiceClient } from "./client";
import { fromAnimalRow, toAnimalRow, type AnimalRow } from "./mappers";

const TABLE = "animals";

export async function fetchAnimals(): Promise<Animal[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("slug, name, scientific_name, biome, country, tagline, detail")
    .order("slug", { ascending: true });

  if (error) {
    throw new Error(`Lỗi đọc bảng "${TABLE}": ${error.message}`);
  }

  return (data as AnimalRow[]).map(fromAnimalRow);
}

export async function upsertAnimals(animals: Animal[]): Promise<void> {
  if (animals.length === 0) return;

  const supabase = getServiceClient();
  const rows = animals.map(toAnimalRow);

  const { error } = await supabase.from(TABLE).upsert(rows, { onConflict: "slug" });

  if (error) {
    throw new Error(`Lỗi upsert bảng "${TABLE}": ${error.message}`);
  }
}
