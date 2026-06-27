"use client";

import ResourceManager, { type FieldConfig } from "@/components/admin/ResourceManager";
import { animalsApi } from "@/lib/api/admin-resources";
import { BIOME_OPTIONS, type AnimalDto } from "@/lib/api/types";

const fields: FieldConfig<AnimalDto>[] = [
  { key: "slug", label: "Slug", type: "text", required: true, lockOnEdit: true, hint: "Khoá chính, không đổi được sau khi tạo." },
  { key: "name", label: "Tên", type: "text", required: true },
  { key: "scientificName", label: "Tên khoa học", type: "text", required: true },
  { key: "biome", label: "Biome", type: "select", options: BIOME_OPTIONS, required: true },
  { key: "country", label: "Quốc gia/Vùng", type: "text" },
  { key: "tagline", label: "Tagline", type: "text" },
  { key: "detail", label: "Detail (JSON)", type: "json", hint: "Khớp AnimalDetail trong types/content.ts." },
];

const emptyItem: AnimalDto = {
  slug: "",
  name: "",
  scientificName: "",
  biome: "tropical",
  country: "",
  tagline: "",
  detail: undefined,
};

export default function AdminAnimalsPage() {
  return (
    <ResourceManager
      eyebrow="Hồ sơ động vật"
      title="Động vật"
      description="Danh mục loài vật theo từng môi trường sống — tên khoa học, vùng phân bố và tiêu bản chi tiết hiển thị ở trang khai thác."
      noun="loài vật"
      primaryKey="slug"
      fields={fields}
      emptyItem={emptyItem}
      api={animalsApi}
      listColumns={["slug", "name", "biome"]}
    />
  );
}
