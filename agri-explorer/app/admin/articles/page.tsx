"use client";

import ResourceManager, { type FieldConfig } from "@/components/admin/ResourceManager";
import { articlesApi } from "@/lib/api/admin-resources";
import { ARTICLE_CATEGORY_OPTIONS, BIOME_OPTIONS, type ArticleDto } from "@/lib/api/types";

const fields: FieldConfig<ArticleDto>[] = [
  { key: "slug", label: "Slug", type: "text", required: true, lockOnEdit: true },
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "description", label: "Mô tả ngắn", type: "textarea", required: true },
  { key: "category", label: "Danh mục", type: "select", options: ARTICLE_CATEGORY_OPTIONS, required: true },
  { key: "biome", label: "Biome (tùy chọn)", type: "select", options: BIOME_OPTIONS },
  { key: "readingTimeMin", label: "Thời gian đọc (phút)", type: "number", required: true },
  { key: "publishedAt", label: "Ngày xuất bản", type: "datetime", required: true },
  { key: "coverImage", label: "Ảnh cover (URL)", type: "text", required: true },
  { key: "coverCaption", label: "Caption ảnh cover", type: "text" },
  { key: "tags", label: "Tags", type: "tags", hint: "Phân tách bằng dấu phẩy, ví dụ: canh-tac, huu-co" },
  { key: "relatedSlugs", label: "Bài liên quan (slug)", type: "tags", hint: "Phân tách bằng dấu phẩy" },
  { key: "sections", label: "Sections (JSON)", type: "json", required: true, hint: "Mảng ArticleSection[] khớp ArticleRenderer." },
];

const emptyItem: ArticleDto = {
  slug: "",
  title: "",
  description: "",
  category: "canh-tac",
  biome: undefined,
  readingTimeMin: 5,
  publishedAt: new Date().toISOString(),
  coverImage: "",
  coverCaption: "",
  tags: [],
  relatedSlugs: [],
  sections: [],
};

export default function AdminArticlesPage() {
  return (
    <ResourceManager
      eyebrow="Hồ sơ bài viết"
      title="Bài viết"
      description="Bài viết chuyên đề ở mục Tri thức — canh tác, sinh thái, thu hoạch... kèm nội dung từng phần (sections) hiển thị qua ArticleRenderer."
      noun="bài viết"
      primaryKey="slug"
      fields={fields}
      emptyItem={emptyItem}
      api={articlesApi}
      listColumns={["slug", "title", "category", "publishedAt"]}
    />
  );
}
