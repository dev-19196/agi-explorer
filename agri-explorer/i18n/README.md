# Agri Explorer

Khám phá thế giới nông nghiệp — bộ sưu tập sống về cây trồng, động vật và
những vùng đất (môi trường sống) nuôi dưỡng chúng.

> Trạng thái: xem chi tiết tiến độ từng mục tại [`PLAN.md`](./PLAN.md) —
> tính đến bản cập nhật gần nhất: Mục 1–4 (tài khoản, tìm kiếm, kiến thức,
> lịch mùa vụ) và Mục 6a–6c (ảnh thật, CMS/DB Supabase, i18n) đã hoàn thành.
>
> ⚠️ URL đã đổi do Mục 6c: mọi trang giờ có tiền tố locale, ví dụ
> `/plants` → `/vi/plants` hoặc `/en/plants`. Truy cập `/` sẽ tự
> redirect theo `Accept-Language`.

## Stack

| Thành phần | Phiên bản | Ghi chú |
| --- | --- | --- |
| Next.js | 16.2.x | App Router, Turbopack (mặc định) |
| React | 19.2.x | đi kèm theo Next 16 |
| TypeScript | 5.x | `strict: true` |
| Tailwind CSS | 4.x | cấu hình theo `@theme inline` trong `app/globals.css` |
| UI primitives | Radix UI (tự dựng) | Button/Input/Badge/Separator/Sheet viết tay theo pattern shadcn |
| Icons | lucide-react | |
| Animation | motion (bản kế nhiệm framer-motion) | |
| Carousel | swiper | dùng cho "Khám phá hôm nay" |
| Font | `@fontsource-variable/inter`, `@fontsource-variable/lora` | self-host qua npm, không gọi `fonts.googleapis.com` lúc build |
| CMS/DB | Supabase (Postgres) | chỉ dùng build-time qua `npm run content:sync` — xem `supabase/README.md` |
| Validate dữ liệu | zod | validate dữ liệu đọc về từ Supabase trước khi sinh `lib/data/*.ts` |
| Script runner | tsx | chạy `scripts/*.mts` (seed/sync nội dung) |
| i18n | tự viết (Next.js i18n routing built-in) | `app/[lang]/` + `proxy.ts` — không dùng `next-intl`, xem `i18n/` và `PLAN.md` Mục 6c |

### Vì sao tự dựng UI primitives thay vì `shadcn` CLI?

Trong môi trường build hiện tại (sandbox của Claude), domain `ui.shadcn.com`
không nằm trong allowlist mạng nên CLI `npx shadcn init/add` sẽ fail. Mình đã
viết tay các component `Button/Input/Badge/Separator/Sheet` theo đúng pattern
mã nguồn mở của shadcn (Radix UI + `class-variance-authority` + `tailwind-merge`)
nên hành vi và API tương đương. **Trên máy của bạn (có mạng đầy đủ), bạn vẫn
có thể chạy `npx shadcn@latest add <component>` bình thường** nếu muốn thêm
component khác — chỉ cần đừng đè lên các file đã có trong `components/ui`.

## Bắt đầu

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build production (đã verify thành công)
npm run lint      # eslint (next 16 đã bỏ lệnh `next lint`)

# Nội dung (Supabase) — xem chi tiết supabase/README.md
npm run content:seed -- --dry-run   # xem trước, không ghi gì
npm run content:seed                # đẩy lib/data/*.ts lên Supabase
npm run content:sync                # đọc Supabase, sinh lại lib/data/*.ts
```

## Cấu trúc

```
proxy.ts                       Phát hiện locale (vi/en) + redirect — thay middleware.ts (Next 16)

app/
  favicon.ico, globals.css      Không thuộc locale nào, giữ ở app/ root
  [lang]/layout.tsx             Root layout — generateStaticParams cho 2 locale
  [lang]/page.tsx                Trang chủ (Hero, Stats, Danh mục, Featured, Environment, Media)
  [lang]/plants/page.tsx         Danh sách cây
  [lang]/plants/[slug]/page.tsx  Chi tiết cây
  [lang]/animals/...              Tương tự, cho động vật
  [lang]/media/page.tsx           Thư viện media (Pinterest layout)
  [lang]/knowledge/page.tsx       Bài viết Kiến thức
  [lang]/search/page.tsx          Kết quả tìm kiếm theo tab
  [lang]/environment/[slug]/page.tsx  Danh sách theo môi trường sống
  [lang]/compare/, map/, quiz/, calendar/, collection/  Các trang còn lại

i18n/
  config.ts, get-dictionary.ts, use-dictionary.ts   Locale + dictionary loader (server/client)
  dictionaries/vi.json, en.json   UI chrome đã dịch
  species-translations.ts        Bản dịch name/tagline/country, neo bằng scientificName
  biome-labels.ts                 Bản dịch 5 nhãn biome
  Link.tsx, useLocaleRouter.ts    Thay next/link / useRouter — tự thêm tiền tố locale
  LanguageSwitcher.tsx, VietnameseOnlyNote.tsx

components/
  layout/      Header, Footer
  hero/        Hero, HeroVisual, HeroSearch, HeroStats
  sections/    CategorySection, FeaturedSection, EnvironmentSection, MediaSection
  cards/       PlantCard, AnimalCard, MediaCard, SpecimenPlate
  ui/          Button, Input, Badge, Separator, Sheet

lib/
  data/        Dữ liệu hiển thị cho app (sinh từ Supabase qua `content:sync`)
  db/          Data Access Layer tới Supabase — CHỈ dùng trong scripts/, không import từ app/
  hooks/       useCountUp
  utils.ts     hàm cn() gộp className

scripts/
  seed-content.mts   lib/data/*.ts hiện có → Supabase (upsert)
  sync-content.mts   Supabase → sinh lại lib/data/*.ts

supabase/
  schema.sql   DDL + RLS — chạy 1 lần trên project Supabase mới
  README.md    Hướng dẫn setup chi tiết

types/content.ts  Type dùng chung + hằng số UI (BIOMES, REGIONS, các *_LABELS)
```

## Hệ thiết kế

- **Biome Spectrum** — 5 màu ứng với 5 môi trường sống (rừng nhiệt đới, đồng
  bằng, núi cao, sa mạc, đất ngập nước) — chính là điểm khác biệt của sản
  phẩm — dùng làm hệ màu nhận diện xuyên suốt: thanh dưới Header, dải phân
  cách trước Stats, tag môi trường trên mọi card, Section "Theo môi trường".
- **Specimen Plate** — minh hoạ dạng "tiêu bản herbarium" (gradient + lưới
  chấm + icon) thay cho ảnh chụp thật, vì Sprint 1 chưa kết nối nguồn ảnh/CMS.
  Khi có ảnh thật, thay `<SpecimenPlate />` bằng `<Image>` ngay trong từng
  `*Card` component mà không cần đổi layout xung quanh.
- Font hiển thị: **Lora** (serif, dùng italic cho tên khoa học — đúng quy
  ước phân loại sinh học) + **Inter** (sans, nội dung chính).

## Bảo mật đã áp dụng (Sprint 1)

- Security headers qua `next.config.ts`: CSP, `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`,
  HSTS. CSP `script-src` chỉ `'self'` — chưa nhúng script bên thứ 3 nào.
- `images.remotePatterns` để **rỗng** có chủ đích — chưa khai báo domain ảnh
  nào để tránh bị lợi dụng SSRF qua image optimization. Khi nối CMS/nguồn
  ảnh thật, khai báo chính xác domain, không dùng wildcard.
- Font self-host hoàn toàn qua npm package (`@fontsource-variable`) — không
  có request ra ngoài lúc build hay runtime, giảm bề mặt phụ thuộc bên thứ 3.
- `poweredByHeader: false` — không lộ thông tin framework qua response header.
- Supabase `service_role` key (quyền ghi, bypass RLS) chỉ tồn tại trong
  `.env.local` (đã `.gitignore`) và biến môi trường CI khi chạy
  `content:seed`/`content:sync` — không bao giờ vào bundle hay runtime của
  app (xem `PLAN.md` Mục 6b). RLS bật trên mọi bảng, chỉ cho `SELECT` công
  khai — ghi chỉ qua `service_role`.

### Cảnh báo audit còn tồn đọng

`npm audit` báo 1 lỗi *moderate* (PostCSS XSS qua stringify) nằm **trong nội
bộ `node_modules/next/node_modules/postcss`** — tức là transitive dependency
do chính Next.js 16.2.9 mang theo, không phải gói bạn cài trực tiếp. Đây là
công cụ build-time, không xử lý CSS từ input người dùng nên rủi ro thực tế
thấp. `npm audit fix --force` sẽ hạ Next.js xuống bản 9 (rất cũ, **không nên
làm**) — cách đúng là chờ Next.js phát hành bản patch cập nhật PostCSS nội bộ
và chạy `npm update next` khi đó.

## Việc cần làm ở Sprint 2

- Nối nguồn ảnh/CMS thật, thay `SpecimenPlate` bằng ảnh thật + khai báo
  `images.remotePatterns`.
- `GrowthTimeline`, block "Điều kiện sinh trưởng", "Sâu bệnh" (accordion),
  Gallery (masonry + lightbox), Video (Swiper) cho trang chi tiết cây.
- Bộ lọc thật cho `/plants` (sidebar) và `/search` (hiện đang lọc theo tên,
  chưa lọc theo loại/môi trường/quốc gia).
