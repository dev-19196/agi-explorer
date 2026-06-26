import type { MediaItem } from "@/types/content";

/**
 * Nguồn dữ liệu chính: Supabase, bảng `media_items` (xem
 * `supabase/schema.sql`). File này sinh lại bằng `npm run content:sync`.
 * Xem chú thích đầy đủ ở đầu `lib/data/plants.ts`.
 */
export const mediaItems: MediaItem[] = [
  { id: "m1", title: "Ruộng bậc thang mùa nước đổ", type: "photo", biome: "mountain", aspect: "portrait" },
  { id: "m2", title: "Vòng đời cây lúa", type: "infographic", biome: "plains", aspect: "square" },
  { id: "m3", title: "Voi rừng kiếm ăn buổi sáng", type: "video", biome: "tropical", aspect: "landscape" },
  { id: "m4", title: "Mùa thu hoạch cà phê Tây Nguyên", type: "photo", biome: "tropical", aspect: "landscape" },
  { id: "m5", title: "Cấu trúc rễ ngập nước của sen", type: "infographic", biome: "wetland", aspect: "portrait" },
  { id: "m6", title: "Đàn lạc đà băng qua cồn cát", type: "photo", biome: "desert", aspect: "square" },
  { id: "m7", title: "Tập tính sinh sản của trâu nước", type: "video", biome: "wetland", aspect: "landscape" },
  { id: "m8", title: "Sương sớm trên đồi trà Shan Tuyết", type: "photo", biome: "mountain", aspect: "portrait" },
];
