import { z } from "zod";

import type { MediaItem } from "../../types/content";
import { apiGet, apiPost } from "./client";
import { mediaItemSchema } from "./schemas";

export async function fetchMediaItems(): Promise<MediaItem[]> {
  const data = await apiGet<unknown>("/api/media");
  return z.array(mediaItemSchema).parse(data);
}

export async function upsertMediaItems(items: MediaItem[]): Promise<void> {
  for (const item of items) {
    await apiPost("/api/media", item);
  }
}
