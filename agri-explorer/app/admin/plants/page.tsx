"use client";

import ResourceManager, { type FieldConfig } from "@/components/admin/ResourceManager";
import { plantsApi } from "@/lib/api/admin-resources";
import { BIOME_OPTIONS, PLANT_CATEGORY_OPTIONS, type PlantDto } from "@/lib/api/types";

const fields: FieldConfig<PlantDto>[] = [
  { key: "slug", label: "Slug", type: "text", required: true, lockOnEdit: true, hint: "Khoá chính, không đổi được sau khi tạo." },
  { key: "name", label: "Tên", type: "text", required: true },
  { key: "scientificName", label: "Tên khoa học", type: "text", required: true },
  { key: "category", label: "Phân loại", type: "select", options: PLANT_CATEGORY_OPTIONS, required: true },
  { key: "biome", label: "Biome", type: "select", options: BIOME_OPTIONS, required: true },
  { key: "country", label: "Quốc gia/Vùng", type: "text" },
  { key: "tagline", label: "Tagline", type: "text" },
  { key: "detail", label: "Detail (JSON)", type: "json", hint: "Khớp PlantDetail trong types/content.ts — overview, classification, care, growthStages, gallery..." },
];

const emptyItem: PlantDto = {
  slug: "",
  name: "",
  scientificName: "",
  category: "fruit",
  biome: "tropical",
  country: "",
  tagline: "",
  detail: undefined,
};

export default function AdminPlantsPage() {
  return (
    <ResourceManager
      eyebrow="Hồ sơ thực vật"
      title="Thực vật"
      description="Toàn bộ loài cây đang xuất hiện trên trang khai thác — từ tên gọi, phân loại đến tiêu bản chi tiết (overview, đặc điểm chăm sóc, các giai đoạn sinh trưởng)."
      noun="cây"
      primaryKey="slug"
      fields={fields}
      emptyItem={emptyItem}
      api={plantsApi}
      listColumns={["slug", "name", "category", "biome"]}
    />
  );
}
