import { z } from "zod";

import type { Article } from "../../types/content";
import { apiGet, apiPost } from "./client";
import { articleSchema } from "./schemas";

export async function fetchArticles(): Promise<Article[]> {
  const data = await apiGet<unknown>("/api/articles");
  return z.array(articleSchema).parse(data);
}

export async function upsertArticles(articles: Article[]): Promise<void> {
  for (const article of articles) {
    await apiPost("/api/articles", article);
  }
}
