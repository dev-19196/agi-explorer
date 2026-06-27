"use client";

import ResourceManager, { type FieldConfig } from "@/components/admin/ResourceManager";
import { weatherAlertsApi } from "@/lib/api/admin-resources";
import { BIOME_OPTIONS, REGION_OPTIONS, WEATHER_LEVEL_OPTIONS, type WeatherAlertDto } from "@/lib/api/types";

const fields: FieldConfig<WeatherAlertDto>[] = [
  { key: "id", label: "ID", type: "text", required: true, lockOnEdit: true },
  { key: "biome", label: "Biome", type: "select", options: BIOME_OPTIONS, required: true },
  { key: "region", label: "Vùng", type: "select", options: REGION_OPTIONS, required: true },
  { key: "months", label: "Các tháng áp dụng", type: "months", required: true, hint: "Phân tách bằng dấu phẩy, ví dụ: 6, 7, 8" },
  { key: "level", label: "Mức độ", type: "select", options: WEATHER_LEVEL_OPTIONS, required: true },
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "description", label: "Mô tả", type: "textarea", required: true },
];

const emptyItem: WeatherAlertDto = {
  id: "",
  biome: "tropical",
  region: "bac",
  months: [],
  level: "info",
  title: "",
  description: "",
};

export default function AdminWeatherAlertsPage() {
  return (
    <ResourceManager
      eyebrow="Hồ sơ cảnh báo"
      title="Cảnh báo thời tiết"
      description="Cảnh báo theo tháng cho từng môi trường/vùng — hiển thị kèm lưới lịch nông vụ để người dùng biết rủi ro thời tiết trong giai đoạn canh tác."
      noun="cảnh báo"
      primaryKey="id"
      fields={fields}
      emptyItem={emptyItem}
      api={weatherAlertsApi}
      listColumns={["id", "biome", "region", "level", "title"]}
    />
  );
}
