"use client";

import ResourceManager, { type FieldConfig } from "@/components/admin/ResourceManager";
import { seasonalEventsApi } from "@/lib/api/admin-resources";
import { REGION_OPTIONS, type SeasonalEventDto } from "@/lib/api/types";

const fields: FieldConfig<SeasonalEventDto>[] = [
  { key: "id", label: "ID", type: "text", required: true, lockOnEdit: true },
  { key: "plantSlug", label: "Slug cây trồng", type: "text", required: true, hint: "Phải khớp slug đã tồn tại ở mục Thực vật (FK)." },
  { key: "region", label: "Vùng", type: "select", options: REGION_OPTIONS, required: true },
  { key: "plantingStart", label: "Tháng gieo trồng (bắt đầu)", type: "number", required: true, hint: "1–12" },
  { key: "plantingEnd", label: "Tháng gieo trồng (kết thúc)", type: "number", required: true, hint: "1–12" },
  { key: "harvestStart", label: "Tháng thu hoạch (bắt đầu)", type: "number", required: true, hint: "1–12" },
  { key: "harvestEnd", label: "Tháng thu hoạch (kết thúc)", type: "number", required: true, hint: "1–12" },
  { key: "note", label: "Ghi chú", type: "textarea" },
];

const emptyItem: SeasonalEventDto = {
  id: "",
  plantSlug: "",
  region: "bac",
  plantingStart: 1,
  plantingEnd: 1,
  harvestStart: 1,
  harvestEnd: 1,
  note: "",
};

export default function AdminSeasonalEventsPage() {
  return (
    <ResourceManager
      eyebrow="Hồ sơ nông vụ"
      title="Lịch nông vụ"
      description="Mốc gieo trồng và thu hoạch theo từng vùng (Bắc/Trung/Nam) cho mỗi cây trồng — dữ liệu nguồn của lưới 12 tháng ở mục Lịch nông vụ."
      noun="mốc lịch"
      primaryKey="id"
      fields={fields}
      emptyItem={emptyItem}
      api={seasonalEventsApi}
      listColumns={["id", "plantSlug", "region", "plantingStart", "harvestStart"]}
    />
  );
}
