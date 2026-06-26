/**
 * lib/db/client.ts
 *
 * Tạo Supabase client bằng SERVICE ROLE KEY — key này có quyền ghi và BYPASS
 * toàn bộ RLS, tuyệt đối không được lộ ra browser.
 *
 * CHỈ được import từ `scripts/*.mts` (seed/sync nội dung), chạy qua `tsx`
 * trong môi trường Node thuần — KHÔNG được import từ bất kỳ file nào trong
 * `app/` hay `components/`. Lưu ý: package `server-only` (marker chuẩn của
 * Next.js để chặn việc này ở bước build) KHÔNG dùng được ở đây — nó chỉ
 * resolve về bản no-op khi bundler khai báo điều kiện export
 * `react-server`; chạy thẳng qua Node/tsx như các script này luôn rơi vào
 * nhánh `default` và throw ngay khi import, nên không phù hợp cho thư mục
 * `lib/db/*` (được thiết kế để chạy NGOÀI Next.js). Việc tách `lib/db/*`
 * thành cây import riêng, không ai trong `app/`/`components/` đụng tới, là
 * biện pháp chặn thực tế thay cho marker package.
 *
 * Biến môi trường bắt buộc (đặt trong `.env.local`, xem `.env.example`):
 *   SUPABASE_URL               — URL project, dạng https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY  — service_role key (Project Settings → API)
 *
 * Lưu ý: 2 biến trên KHÔNG có tiền tố `NEXT_PUBLIC_` — vì chúng chỉ được
 * đọc trong script Node độc lập (chạy qua `tsx`), không phải trong code app
 * Next.js, nên không cần (và không nên) public.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedClient: SupabaseClient | null = null;

/**
 * Lấy Supabase client (service role). Throw lỗi rõ ràng ngay nếu thiếu env
 * var — tốt hơn nhiều so với để `createClient` âm thầm tạo client trỏ tới
 * `undefined` rồi fail khó hiểu ở lần gọi API đầu tiên.
 */
export function getServiceClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY. " +
        "Tạo file .env.local từ .env.example và điền giá trị thật từ " +
        "Supabase Project Settings → API trước khi chạy script seed/sync.",
    );
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cachedClient;
}
