# Nối Agri Explorer với Supabase thật

Hướng dẫn này dành cho việc kết nối project với 1 Supabase project thật —
bước cuối của Mục 6b trong `PLAN.md` mà chỉ bạn (có quyền tạo project, có
mạng tới `supabase.com`) mới làm được. Sandbox build hiện tại của Claude
không có quyền truy cập `supabase.co` nên phần seed/sync thật **chưa được
chạy thử với DB thật** — toàn bộ phần dưới đây đã được verify ở mức
type-check/lint/build và unit-test mapping (xem PLAN.md), còn bước cuối —
chạy thật — cần bạn tự làm theo các bước sau.

## 1. Tạo project

1. Vào [supabase.com](https://supabase.com) → **New project**.
2. Chọn region gần Việt Nam nhất (ví dụ Singapore) để giảm latency.
3. Đặt mật khẩu DB mạnh, lưu lại (không dùng trong project này nhưng
   Supabase yêu cầu khi tạo).

## 2. Chạy schema

1. Mở **SQL Editor** trong Supabase Studio.
2. Copy toàn bộ nội dung `supabase/schema.sql` vào, **Run**.
3. Kiểm tra **Table Editor** đã thấy 6 bảng: `plants`, `animals`,
   `media_items`, `articles`, `seasonal_events`, `weather_alerts`.
4. Script idempotent — chạy lại an toàn nếu cần (ví dụ sau khi sửa schema).

## 3. Lấy API keys

**Project Settings → API**:

- `Project URL` → dán vào `SUPABASE_URL`
- `service_role` key (mục **Project API keys**, KHÔNG phải `anon` key) →
  dán vào `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ `service_role` key bypass toàn bộ RLS — chỉ dùng trong `.env.local`
> (đã `.gitignore`), không bao giờ dán vào code commit, không paste vào
> chat AI, không log ra console trong code thật.

## 4. Cấu hình local

```bash
cp .env.example .env.local
# rồi mở .env.local, điền 2 giá trị ở bước 3
```

## 5. Seed dữ liệu gốc lên Supabase

```bash
npm run content:seed -- --dry-run   # xem trước sẽ ghi gì, không gọi API
npm run content:seed                # ghi thật — upsert 6 bảng từ lib/data/*.ts
```

Idempotent — chạy lại nhiều lần không tạo bản trùng (upsert theo
`slug`/`id`).

## 6. Biên tập nội dung

Sau khi seed, bạn có thể sửa nội dung trực tiếp trong **Table Editor** của
Supabase Studio — sửa text, thêm loài mới, sửa `detail` (cột `jsonb`, sửa
qua JSON editor tích hợp của Supabase).

## 7. Đồng bộ về code

```bash
npm run content:sync -- --dry-run   # xem số lượng record đọc được, chưa ghi file
npm run content:sync                # ghi đè lib/data/*.ts bằng dữ liệu mới nhất
npm run lint                        # kiểm tra lỗi
npm run build                       # build production để xác nhận
```

Chạy `content:sync` trước mỗi lần deploy để app dùng nội dung mới nhất từ
Supabase — vì kiến trúc hiện tại đọc Supabase **lúc build**, không phải lúc
runtime (xem lý do trong `PLAN.md`, mục "Quyết định kiến trúc" của 6b).

## An toàn dữ liệu khi sync lỗi

`sync-content.mts` đọc + validate (Zod) **toàn bộ 6 bảng trước**, chỉ ghi
file khi tất cả hợp lệ — nếu 1 bảng có dữ liệu sai hình dạng (ví dụ ai đó
sửa nhầm `category` thành giá trị không thuộc enum), script dừng với lỗi
rõ ràng và **không ghi đè** `lib/data/*.ts` nào cả — tránh để 1 lỗi biên
tập làm hỏng cả build.

## Khi nào cần sửa schema

Nếu bạn thêm field mới vào `types/content.ts` (ví dụ thêm field cho
`Plant`), cần đồng bộ 3 nơi:

1. `supabase/schema.sql` — thêm cột (nếu field nằm ngoài `detail` jsonb;
   field bên trong `detail`/`sections` thì không cần đổi schema SQL).
2. `lib/db/schemas.ts` — thêm vào Zod schema tương ứng.
3. `lib/db/mappers.ts` — thêm field vào `toXRow`/`fromXRow`.
