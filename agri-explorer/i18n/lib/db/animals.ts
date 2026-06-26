import { z } from "zod";

import type { Animal } from "../../types/content";
import { apiGet, apiPost } from "./client";
import { animalSchema } from "./schemas";

export async function fetchAnimals(): Promise<Animal[]> {
  const data = await apiGet<unknown>("/api/animals");
  return z.array(animalSchema).parse(data);
}

export async function upsertAnimals(animals: Animal[]): Promise<void> {
  for (const animal of animals) {
    await apiPost("/api/animals", animal);
  }
}
