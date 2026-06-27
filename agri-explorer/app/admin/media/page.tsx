"use client";

import ResourceManager, { type FieldConfig } from "@/components/admin/ResourceManager";
import { mediaApi } from "@/lib/api/admin-resources";
import { BIOME_OPTIONS, MEDIA_ASPECT_OPTIONS, MEDIA_TYPE_OPTIONS, type MediaDto } from "@/lib/api/types";

const fields: FieldConfig<MediaDto>[] = [
  { key: "id", label: "ID", type: "text", required: true, lockOnEdit: true },
  { key: "title", label: "Tiêu đề", type: "text", required: true },
  { key: "type", label: "Loại", type: "select", options: MEDIA_TYPE_OPTIONS, required: true },
  { key: "biome", label: "Biome", type: "select", options: BIOME_OPTIONS, required: true },
  { key: "aspect", label: "Tỉ lệ khung", type: "select", options: MEDIA_ASPECT_OPTIONS, required: true },
];

const emptyItem: MediaDto = { id: "", title: "", type: "photo", biome: "tropical", aspect: "landscape" };

export default function AdminMediaPage() {
  return (
    <ResourceManager
      eyebrow="Hồ sơ media"
      title="Media"
      description="Ảnh, video, infographic dùng cho mục Media trên trang khai thác, gắn theo môi trường sống và tỉ lệ khung hiển thị."
      noun="media"
      primaryKey="id"
      fields={fields}
      emptyItem={emptyItem}
      api={mediaApi}
      listColumns={["id", "title", "type", "biome"]}
    />
  );
}
