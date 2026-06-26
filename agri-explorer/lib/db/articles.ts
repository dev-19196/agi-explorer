import type { Article } from "../../types/content";
import { getServiceClient } from "./client";
import { fromArticleRow, toArticleRow, type ArticleRow } from "./mappers";

const TABLE = "articles";

export async function fetchArticles(): Promise<Article[]> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      "slug, title, description, category, biome, reading_time_min, published_at, cover_image, cover_caption, tags, related_slugs, sections",
    )
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(`Lỗi đọc bảng "${TABLE}": ${error.message}`);
  }

  return (data as ArticleRow[]).map(fromArticleRow);
}

export async function upsertArticles(articles: Article[]): Promise<void> {
  if (articles.length === 0) return;

  const supabase = getServiceClient();
  const rows = articles.map(toArticleRow);

  const { error } = await supabase.from(TABLE).upsert(rows, { onConflict: "slug" });

  if (error) {
    throw new Error(`Lỗi upsert bảng "${TABLE}": ${error.message}`);
  }
}
