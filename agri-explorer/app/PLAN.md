# Agri Explorer — Roadmap & Tiến độ triển khai

> Cập nhật lần cuối: Sprint 5 — Mục 6 hoàn thành toàn bộ (6a, 6b, 6c)
> Mọi thay đổi code được ghi tại đây để theo dõi tiến độ liên tục giữa các session.

---

## ✅ Mục 1 — Tài khoản & Cá nhân hoá

**Trạng thái: HOÀN THÀNH**

### Files đã tạo / sửa
| File | Vai trò |
|------|---------|
| `lib/hooks/useLocalStorage.ts` | Hook SSR-safe cho localStorage |
| `lib/hooks/useUserActivity.tsx` | Context store: favourites + history + quiz stats + badges |
| `components/personalisation/FavouriteButton.tsx` | Nút ♥ toggle, SSR-safe |
| `components/personalisation/HistoryTracker.tsx` | Component vô hình ghi lịch sử xem |
| `app/collection/page.tsx` | Trang `/collection` — 3 tab: Yêu thích / Đã xem / Gợi ý |
| `components/cards/PlantCard.tsx` | Thêm FavouriteButton overlay |
| `components/cards/AnimalCard.tsx` | Thêm FavouriteButton overlay |
| `app/plants/[slug]/page.tsx` | Thêm HistoryTracker + FavouriteButton |
| `app/animals/[slug]/page.tsx` | Thêm HistoryTracker + FavouriteButton |
| `app/quiz/page.tsx` | Ghi stats, high score, badges sau quiz |
| `app/layout.tsx` | Wrap với `<UserActivityProvider>` |
| `components/layout/Header.tsx` | Thêm nav link "Bộ sưu tập" |

### Tính năng đã hoàn thành
- [x] Bộ sưu tập yêu thích (localStorage, không cần auth)
- [x] Lịch sử đã xem (50 items, LIFO, ghi tự động)
- [x] Gợi ý "Có thể bạn quan tâm" dựa trên tần suất biome/category
- [x] Quiz stats: điểm cao nhất, tổng lượt, badges (4 loại)
- [x] Trang `/collection` với 3 tab filter

---

## ✅ Mục 2 — Tìm kiếm & Khám phá thông minh

**Trạng thái: HOÀN THÀNH**

### Files đã tạo / sửa
| File | Vai trò |
|------|---------|
| `lib/search.ts` | Fuzzy search engine: exact + token + trigram scoring |
| `components/personalisation/LuckyButton.tsx` | Nút "Tôi đang may mắn" → random species |
| `app/search/page.tsx` | Rewrite toàn bộ: live client-side search + dropdown |
| `app/search/layout.tsx` | Suspense wrapper cho useSearchParams |
| `components/hero/HeroSearch.tsx` | Thêm LuckyButton |
| `app/plants/[slug]/page.tsx` | Dùng `getRelatedPlants()` thay vì chỉ lọc biome |
| `app/animals/[slug]/page.tsx` | Dùng `getRelatedAnimals()` + label lý do gợi ý |

### Tính năng đã hoàn thành
- [x] Fuzzy search toàn site (cây + động vật + media + bài viết)
- [x] Normalize tiếng Việt (bỏ dấu để "lua" tìm được "Lúa")
- [x] Dropdown gợi ý real-time khi gõ (top 6 kết quả)
- [x] URL sync khi tìm kiếm (debounce 300ms, SSR-safe)
- [x] Nút "Tôi đang may mắn" — navigate random species
- [x] Related thông minh: cùng category/diet, không chỉ biome
- [x] Label lý do gợi ý ("Cùng nhóm cây", "Cùng môi trường"...)

---

## ✅ Mục 3 — Nội dung "Kiến thức" (Blog/Cẩm nang)

**Trạng thái: HOÀN THÀNH**

### Files đã tạo / sửa
| File | Vai trò |
|------|---------|
| `types/content.ts` | Append type `Article`, `ArticleSection`, `ArticleCategory` |
| `lib/data/articles.ts` | 4 bài viết mẫu chất lượng cao |
| `components/knowledge/ArticleRenderer.tsx` | Render sections: paragraph, heading, tip, warning, image, lifecycle, gallery |
| `components/knowledge/ArticleCard.tsx` | Card bài viết cho listing |
| `app/knowledge/page.tsx` | Rewrite: listing với filter category, bài nổi bật |
| `app/knowledge/[slug]/page.tsx` | Trang chi tiết bài viết: hero, body, related species, related articles |
| `lib/search.ts` | Thêm article vào index (title + description + tags) |
| `app/search/page.tsx` | Thêm tab "Bài viết" + render ArticleCard |

### Bài viết mẫu đã tạo
- [x] "Cách phân biệt 5 giống sầu riêng phổ biến nhất Việt Nam"
- [x] "Vì sao voi sợ ong — và cách khoa học tận dụng điều đó"
- [x] "Lúa nước: 10.000 năm nuôi sống một nửa nhân loại"
- [x] "Robusta Việt Nam: từ 'hạng hai' đến ngôi vương thị trường cà phê"

### Tính năng đã hoàn thành
- [x] Type hệ thống bài viết (sections-based thay MDX, không cần package mới)
- [x] 7 loại section: paragraph, heading, tip, warning, image, lifecycle, gallery
- [x] Tái sử dụng component `LifecycleTimeline` trong bài viết
- [x] Trang listing với filter category + bài nổi bật featured
- [x] Trang chi tiết: hero ảnh full-width, related species, related articles
- [x] Articles được index vào fuzzy search engine (tìm được từ `/search`)

---

## ✅ Mục 4 — Module "Mùa vụ / Lịch nông nghiệp"

**Trạng thái: HOÀN THÀNH**

### Files đã tạo / sửa
| File | Vai trò |
|------|---------|
| `types/content.ts` | Append type `Region`, `RegionMeta`, `REGIONS`, `MonthRange`, `SeasonalEvent`, `WeatherAlertLevel`, `WeatherAlert` |
| `lib/data/seasonal-calendar.ts` | Data mùa vụ cho 8 cây trồng × 3 vùng (24 sự kiện) + mock cảnh báo thời tiết theo biome/vùng |
| `components/calendar/AgriculturalCalendar.tsx` | Grid 12 tháng, màu theo biome, click để xem growthStages + ghi chú canh tác |
| `app/calendar/page.tsx` | Trang `/calendar` — filter theo vùng miền (Bắc/Trung/Nam) |
| `components/layout/Header.tsx` | Thêm nav link "Lịch mùa vụ" |
| `app/knowledge/[slug]/page.tsx` | Fix lỗi type-check không liên quan (union type `relatedSpecies`) chặn build |

### Tính năng đã hoàn thành
- [x] Type `SeasonalEvent` (cây, tháng trồng, tháng thu hoạch, vùng miền) hỗ trợ wrap-around qua năm mới
- [x] Data lịch mùa vụ cho 8 cây trồng đã có, chia 3 vùng (Bắc / Trung / Nam) — không nhồi ép vùng không phù hợp khí hậu, có ghi chú riêng cho cây ngoại lai (nhân sâm, xương rồng)
- [x] Component `AgriculturalCalendar` — bảng 12 tháng, icon Gieo/Thu hoạch màu theo biome, hàng mở rộng xem chi tiết
- [x] Trang `/calendar` với filter vùng miền qua query param, SSR-safe
- [x] Tích hợp `growthStages` từ `Plant.detail` thành chi tiết khi mở rộng từng dòng lịch (hiện có với sầu riêng — cây đã có detail đầy đủ)
- [x] Mock data cảnh báo thời tiết/mùa theo biome + vùng (7 cảnh báo: bão, rét đậm, lũ, hạn, xâm nhập mặn...) — skeleton để sau nối API thật

### Ghi chú kỹ thuật bổ sung
- Cây không có `detail` (chưa biên soạn growthStages) vẫn hiển thị lịch trồng/thu hoạch bình thường, chỉ ẩn khối vòng đời khi mở rộng.
- `weatherAlerts` lọc theo `region`, không lọc theo `biome` của từng cây trong bảng (tránh quá tải UI) — có thể tinh chỉnh sau nếu cần cảnh báo riêng theo cây.

---

## ⏳ Mục 5 — Cộng đồng / UGC

**Trạng thái: TẠM HOÃN — cần backend**

### Ghi chú
Tính năng này yêu cầu:
- Database thật (Supabase hoặc tương đương)
- Auth (đã có nền tảng localStorage từ Mục 1)
- Moderation pipeline

**Sẽ triển khai sau khi Mục 6 (Hạ tầng) hoàn thành.**

---

## ⏳ Mục 6 — Hạ tầng / Kỹ thuật

**Trạng thái: HOÀN THÀNH (6a, 6b, 6c)**

#### 6a. next/image cho ảnh Unsplash — ✅ HOÀN THÀNH
- [x] Cập nhật `next.config.ts`: thêm `images.unsplash.com` vào `remotePatterns`
- [x] Thay `<img>` bằng `<Image>` trong PlantCard, AnimalCard, SpeciesMediaGallery
- [x] Cập nhật CSP header để cho phép Unsplash (`img-src ... https://images.unsplash.com`)

#### 6b. CMS/DB thật — ✅ HOÀN THÀNH (code + hạ tầng)

- [x] Đánh giá Supabase vs Sanity theo nhu cầu
- [x] Tạo schema mapping từ `lib/data/*.ts`
- [x] Viết data-fetching layer (giữ nguyên interface để component không đổi)
- [x] Seed data từ mock hiện tại (script viết xong, verify bằng dry-run + round-trip test — **chưa chạy lên Supabase thật**, xem ghi chú cuối mục)

##### Đánh giá Supabase vs Sanity

| Tiêu chí | Supabase | Sanity |
|---|---|---|
| Dữ liệu của app (quan hệ rõ: plant ↔ seasonal_events, lọc theo biome/category) | Postgres quan hệ + index + RLS, query trực tiếp | Phải mô phỏng quan hệ qua GROQ reference, không có FK/constraint thật |
| Nhu cầu Mục 5 (UGC — comment/đánh giá, cần auth thật) | Có sẵn Postgres + Auth + RLS — dùng lại được, không cần hạ tầng thứ 2 | Không có DB quan hệ cho UGC — vẫn phải thêm Postgres/Supabase riêng |
| Biên tập nội dung | Table Editor (đủ dùng — nội dung hiện tại không cần rich-text WYSIWYG phức tạp, đã ở dạng sections có cấu trúc) | Studio chuyên biên tập — mạnh hơn nhưng dư cho nhu cầu hiện tại |
| Bảo mật | RLS theo role Postgres chuẩn, generous free tier | Cần token riêng cho viewer/editor, mô hình quyền khác Postgres |
| Vận hành | 1 hạ tầng phục vụ cả content (6b) và tương lai UGC (Mục 5) | 2 hạ tầng tách biệt nếu vẫn cần DB cho UGC sau này |

→ **Chọn Supabase**: vì Mục 5 (UGC) đã được note "cần backend — sẽ triển khai sau Mục 6", dùng Supabase ngay từ 6b giải quyết được cả 2 nhu cầu bằng 1 hạ tầng, tránh phải tích hợp thêm DB quan hệ riêng khi làm Mục 5. Sanity tối ưu cho long-form editorial content (CMS blog thuần) — không phải nhu cầu chính ở đây.

### Files đã tạo / sửa

| File | Vai trò |
|------|---------|
| `supabase/schema.sql` | DDL: 7 enum, 6 bảng, index, trigger `updated_at`, RLS (chỉ public SELECT — ghi chỉ qua service_role) |
| `supabase/README.md` | Hướng dẫn tạo project, chạy schema, lấy key, seed, sync |
| `.env.example` | Mẫu `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` |
| `.gitignore` | **Tạo mới** — project trước đó thiếu hoàn toàn, rủi ro lộ `.env.local` |
| `lib/db/schemas.ts` | Zod schema validate đúng shape `types/content.ts` |
| `lib/db/mappers.ts` | Map 2 chiều row (snake_case, Postgres) ↔ domain type (camelCase) |
| `lib/db/client.ts` | Factory tạo Supabase client bằng service-role key, throw rõ nếu thiếu env |
| `lib/db/plants.ts`, `animals.ts`, `media.ts`, `articles.ts`, `seasonal.ts` | DAL: `fetchX()` (đọc + validate) và `upsertX()` (ghi) cho từng bảng |
| `lib/db/index.ts` | Barrel export cho `scripts/*` |
| `scripts/seed-content.mts` | Đẩy `lib/data/*.ts` hiện có lên Supabase (upsert, hỗ trợ `--dry-run`) |
| `scripts/sync-content.mts` | Đọc Supabase → sinh lại `lib/data/*.ts` (hỗ trợ `--dry-run`) |
| `package.json` | Thêm `@supabase/supabase-js`, `zod`, devDep `tsx`; script `content:seed`, `content:sync` |
| `types/content.ts` | Thêm `ARTICLE_CATEGORY_LABELS`, `REGION_LABELS` (dời từ `lib/data/*.ts` — cùng nhóm hằng số UI với `BIOMES`/`REGIONS`, không thuộc nội dung CMS) |
| `lib/data/articles.ts`, `seasonal-calendar.ts` | Bỏ 2 label map (đã dời), thêm header "nguồn dữ liệu chính: Supabase" |

### Kiến trúc: build-time sync, không runtime fetch

**Quyết định quan trọng nhất của 6b**: app Next.js **không** gọi Supabase
lúc runtime. `lib/db/*` chỉ được dùng bởi 2 script Node (`content:seed`,
`content:sync`) — chạy ngoài Next.js, qua `tsx`. Luồng dữ liệu:

```
Supabase (Table Editor, biên tập tay)
   ──content:sync──▶  lib/data/*.ts  (TS file, generated)
                         ──import──▶  app/ + components/ (không đổi 1 dòng)
```

Lý do chọn cách này thay vì Server Component fetch trực tiếp từ Supabase:

1. **`lib/data/plants.ts` v.v. đang được 19 file import đồng bộ** — nhiều
   là Client Component lọc/tìm kiếm phía client (`PlantsExplorer`,
   `lib/search.ts`...). Chuyển sang `async`/await thật sẽ phải sửa kiến
   trúc data-loading của toàn bộ các trang đó. Build-time sync giữ đúng
   yêu cầu trong kế hoạch gốc: **"giữ nguyên interface để component không
   đổi"**.
2. **Bảo mật tốt hơn**: service-role key (quyền ghi, bypass RLS) chỉ tồn
   tại trong môi trường CI/máy dev lúc chạy script — **không bao giờ** đi
   vào bundle hay runtime của app. Không có request nào tới Supabase từ
   browser → CSP `connect-src` không cần mở thêm domain nào.
3. **Đúng tính chất nội dung hiện tại**: cây/con vật/bài viết là dữ liệu
   tham chiếu, đổi không thường xuyên (biên tập, không phải user sinh) —
   không cần tươi theo từng request. Khi Mục 5 (UGC) cần dữ liệu thật-time
   (comment, đánh giá), sẽ thêm 1 client riêng dùng `anon` key + RLS, đọc
   runtime — tách biệt hoàn toàn với `lib/db/*` hiện tại (vốn dùng
   service-role, không an toàn để chạy trong request runtime).

### Quyết định kiến trúc khác

- **`detail` (Plant/Animal) và `sections` (Article) lưu `jsonb`**, không
  chuẩn hoá hết ra bảng con — các khối này luôn đọc/ghi nguyên vẹn theo
  từng bản ghi, không có nhu cầu lọc theo field con. Đánh đổi: mất khả năng
  query SQL vào trong các field này — chấp nhận được ở quy mô hiện tại,
  ghi rõ trong `supabase/schema.sql`.
- **`seasonal_events` tách `MonthRange` thành 4 cột số nguyên** (không
  dùng jsonb) — vì đây là field thực sự cần lọc bằng SQL (ví dụ "cây nào
  thu hoạch tháng 6"), khác với các khối "detail" tự do.
- **`BIOMES`, `REGIONS` không đưa vào Supabase** — đây là hằng số UI/CSS
  (`colorVar`...), không phải nội dung biên tập, vẫn nằm trong
  `types/content.ts`.
- **Không dùng ORM (Drizzle/Prisma)** — dùng trực tiếp `@supabase/supabase-js`.
  Schema đơn giản, không cần lớp trừu tượng thêm; giữ đúng triết lý "không
  thêm phụ thuộc khi chưa cần" đã áp dụng từ Mục 2 (fuzzy search tự viết).
- **Zod cho validate dữ liệu từ Supabase** — vì nội dung được biên tập qua
  Table Editor (không có type-check), cần chặn dữ liệu sai hình dạng trước
  khi nó được dùng để sinh lại `lib/data/*.ts` và làm hỏng build.

### Lỗi đã phát hiện và sửa lúc verify

- Lúc đầu `lib/db/*` có `import "server-only"` (theo khuyến nghị chuẩn cho
  Data Access Layer trong docs Next.js 16) — nhưng test thực tế bằng
  `npm run content:seed` cho thấy package này **throw ngay khi chạy qua
  `tsx`/Node thuần**, vì nó chỉ resolve về bản no-op khi bundler khai báo
  điều kiện export `react-server` (Next.js làm vậy lúc build, `tsx` không).
  Đã gỡ `import "server-only"` khỏi toàn bộ `lib/db/*` và gỡ luôn package
  (không dùng ở đâu khác) — cơ chế chặn thực tế là `lib/db/*` không nằm
  trong cây import của `app/`/`components/` nào cả.
- Đã verify lại bằng `npm run content:seed -- --dry-run` (đọc đúng số
  lượng record), test với `.env.local` giả (xác nhận đọc env + tạo client
  + gọi API đúng luồng, fail đúng chỗ ở bước network vì sandbox không có
  route tới `supabase.co`), và 1 script round-trip tạm thời (domain → row
  → domain qua Zod) cho **toàn bộ 55 record thật** — 0 lệch dữ liệu.

### Còn lại — cần bạn tự làm (ngoài khả năng của sandbox này)

Sandbox build của Claude không có quyền truy cập `supabase.co` (xem
`network_configuration`), nên phần sau **chưa được chạy với DB thật**:

1. Tạo Supabase project (theo `supabase/README.md`)
2. Chạy `supabase/schema.sql`
3. `cp .env.example .env.local` + điền `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
4. `npm run content:seed` — seed dữ liệu mock hiện tại lên Supabase thật
5. Thử sửa 1 record trong Table Editor → `npm run content:sync` → xác nhận `lib/data/*.ts` cập nhật đúng

#### 6c. i18n — ✅ HOÀN THÀNH

- [x] Dùng Next.js i18n routing built-in (không cài `next-intl`)
- [x] Tạo dictionary `i18n/dictionaries/vi.json` + `en.json`
- [x] Dùng `scientificName` làm điểm neo song ngữ (`i18n/species-translations.ts`)
- [x] Ưu tiên: tên loài + tagline + biome labels — **đã mở rộng thêm** sang routing đầy đủ + các trang Compare/Map (xem "Phạm vi dịch" dưới)

##### next-intl vs built-in routing

| Tiêu chí | next-intl | Built-in `[lang]` + dictionary |
|---|---|---|
| Số lượng string cần dịch | Phù hợp khi cần ICU plural/format phức tạp | Chỉ cần key-value đơn giản — đúng nhu cầu hiện tại (UI chrome + tên loài, không có số nhiều phức tạp) |
| Dependency | Thêm 1 package + convention riêng (`useTranslations`, request config) | 0 dependency mới, dùng đúng pattern chính thức trong docs Next.js 16 |
| Phù hợp triết lý dự án | — | Nhất quán với quyết định "không thêm dependency khi chưa cần" đã áp dụng ở Mục 2 (fuzzy search tự viết) và 6b (không dùng ORM) |

→ **Chọn built-in routing**. Phạm vi dịch hiện tại (nav, footer, hero, nhãn biome, tên/tagline loài) chỉ cần tra cứu key-value đơn giản — next-intl sẽ là lựa chọn đúng nếu sau này cần dịch số nhiều, định dạng ngày/số phức tạp, hoặc danh sách string tăng lên hàng trăm key.

##### Kiến trúc routing

Toàn bộ `app/*` (trừ `globals.css`, `favicon.ico`) di chuyển vào `app/[lang]/`.
Next.js 16 đổi `middleware.ts` → `proxy.ts` (project root, không phải trong
`app/`) — `proxy.ts` phát hiện locale qua `Accept-Language` (tự viết, không
thêm `negotiator`/`@formatjs/intl-localematcher` cho 2 locale) và redirect
307 khi thiếu tiền tố `/vi`/`/en`. **URL đổi** (`/plants` → `/vi/plants`) —
chấp nhận được vì app đang ở giai đoạn phát triển, chưa có SEO/backlink thật
cần giữ.

`generateStaticParams` ở `app/[lang]/layout.tsx` trả về `[{lang:"vi"},{lang:"en"}]`;
Next.js tự nhân với `generateStaticParams` của từng route con (`[slug]`) —
verify qua build thật: `plants/[slug]` ra 16 trang (8 loài × 2 locale),
`animals/[slug]` 12 trang, `environment/[slug]` 10 trang,
`knowledge/[slug]` 8 trang — không cần tự viết logic cross-product.

##### Files đã tạo

| File | Vai trò |
|------|---------|
| `i18n/config.ts` | `LOCALES`, `DEFAULT_LOCALE`, type `Locale`, guard `isLocale()` |
| `i18n/dictionaries/vi.json`, `en.json` | Dictionary UI chrome (nav, footer, hero, environment, language switcher) |
| `i18n/get-dictionary.ts` | Loader dictionary phía server (`server-only`, dynamic import theo locale — đúng pattern khuyến nghị trong docs Next 16) |
| `i18n/use-dictionary.ts` | Hook client (`useLocale`/`useDictionary`) — import tĩnh cả 2 dictionary cho component lồng sâu (Hero → HeroSearch → LuckyButton) để tránh prop-drilling |
| `i18n/species-translations.ts` | Bản dịch EN cho name/tagline/country của 14 loài, neo bằng `scientificName` |
| `i18n/biome-labels.ts` | Bản dịch EN cho 5 nhãn biome — `getBiomeMeta()` |
| `i18n/Link.tsx` | Thay `next/link` — tự thêm tiền tố locale (đọc qua `useParams()`, không cần Context) |
| `i18n/useLocaleRouter.ts` | Thay `useRouter()` — `push`/`replace` tự thêm tiền tố locale |
| `i18n/LanguageSwitcher.tsx` | Đổi ngôn ngữ, giữ nguyên phần path hiện tại |
| `i18n/VietnameseOnlyNote.tsx` | Ghi chú minh bạch khi xem nội dung chưa dịch ở locale `en` |
| `proxy.ts` (root) | Phát hiện locale + redirect — thay `middleware.ts` |

##### Phạm vi dịch (có chủ đích giới hạn)

**Đã dịch:** Header/Footer (toàn bộ nav + tagline), Hero (headline/subheadline/search), language switcher, nhãn biome (Footer, EnvironmentSection, trang `environment/[slug]`, sidebar Plants/AnimalsExplorer, filter Map), tên + tagline + quốc gia của 14 loài (neo `scientificName`) — áp dụng ở PlantCard/AnimalCard (→ lan ra mọi nơi dùng card: trang chủ, listing, search, related species), SpeciesMarquee, trang chi tiết loài (hero), trang Compare, trang Map.

**Có chủ đích KHÔNG dịch** (giữ tiếng Việt ở mọi locale, đúng như PLAN.md yêu cầu giảm phạm vi): nội dung `detail` của loài (overview, classification, care, behavior, growthStages, funFacts, gallery caption...), toàn bộ nội dung 4 bài viết Kiến thức (`ArticleRenderer`), nhãn filter/category trên các trang listing (Cây ăn quả, Rau màu...), UI của Quiz/Collection. Lý do: đây là nội dung biên soạn dài, dịch đúng nghĩa cần viết lại toàn bộ bằng tay (tương đương viết 1 bộ encyclopedia tiếng Anh riêng) — vượt phạm vi 1 task kỹ thuật. Có `VietnameseOnlyNote` hiển thị minh bạch ở locale `en` trên trang chi tiết loài và bài viết Kiến thức, thay vì âm thầm trộn ngôn ngữ.

##### Lỗi đã phát hiện và sửa lúc verify

- `i18n/get-dictionary.ts`: viết `satisfies Record<Locale, () => Promise<unknown>>` lên object `dictionaries` khiến TypeScript suy luận sai `ReturnType` thành `unknown` (verify bằng test cô lập, tái hiện được lỗi). Đã bỏ `satisfies`, thay bằng 1 assertion kiểu tĩnh đơn giản để vẫn bắt lỗi compile nếu thiếu locale.
- `components/map/WorldMap.tsx` dùng `<a href>` thuần (không qua `i18n/Link`) để vẽ marker trong SVG — nếu không sửa, click vào điểm trên bản đồ ở `/en/map` sẽ mất locale (về `/plants/...` rồi bị `proxy.ts` redirect lại theo `Accept-Language`, không giữ lựa chọn hiện tại của người dùng). Sửa tại nguồn: `app/[lang]/map/page.tsx` tự thêm tiền tố `/${lang}` vào `href` trước khi truyền vào `WorldMap` (giữ component dùng chung không phụ thuộc i18n).
- `app/[lang]/knowledge/page.tsx` dùng `<a href="/knowledge">` thuần cho filter category — cùng lỗi mất-locale-khi-click. Đổi sang `i18n/Link`.
- Đã soát toàn bộ `<a href="/...">` còn lại trong `app/` + `components/` để xác nhận không còn trường hợp tương tự.
- Sau khi deploy, người dùng báo cảnh báo hydration mismatch tại `<html lang={lang}>` (layout.tsx). Xác minh bằng Cửa sổ ẩn danh → hết cảnh báo → kết luận do extension trình duyệt (Grammarly/Dark Reader/dịch trang...) chèn attribute vào `<html>`/`<body>` trước khi React hydrate — không phải lỗi code. Đã thêm `suppressHydrationWarning` vào `<html>` và `<body>` trong `app/[lang]/layout.tsx` theo đúng khuyến nghị chính thức của React cho trường hợp này.

##### Đã verify

`tsc --noEmit`, `eslint .` (không phát sinh lỗi/warning mới ngoài 6 lỗi pre-existing đã biết), `next build` (xác nhận đúng số trang tĩnh sinh ra cho từng locale). Chạy `next dev` thật và `curl`:
- Redirect: `/` → 307 → `/vi`; với header `Accept-Language: en` → 307 → `/en`; `/plants` → `/vi/plants`.
- Toàn bộ trang chính (`/vi`, `/en`, listing, detail loài, compare, map, calendar...) trả 200 ở cả 2 locale.
- Diff nội dung HTML thật giữa `/vi/plants/sau-rieng` và `/en/plants/sau-rieng`: tên "Sầu riêng" → "Durian", tagline đổi đúng, biome "Rừng nhiệt đới" → "Tropical Rainforest", có hiện `VietnameseOnlyNote`.
- Language switcher giữ đúng path hiện tại khi đổi locale (`/en/plants/sau-rieng` → bấm "Tiếng Việt" → `href="/vi/plants/sau-rieng"`, không phải về trang chủ).
- `favicon.ico` không bị `proxy.ts` redirect (matcher loại trừ đúng).

#### 6d. Quả địa cầu 3D cho bản đồ phân bố — ✅ HOÀN THÀNH

Yêu cầu: bản đồ phân bố loài (SVG vẽ tay, lục địa chỉ là đa giác xấp xỉ thô) khiến người dùng "không rõ địa điểm" thật trên thực tế. Nâng cấp thành quả địa cầu 3D xoay được (Three.js), kèm bản đồ 2D dự phòng cũng được nâng cấp theo.

##### Files đã tạo / sửa
- `scripts/generate-world-geo.mts` (mới) — script build-time (giống `seed-content.mts`) dùng `world-atlas` + `topojson-client` (chỉ devDependency, không vào bundle client) để sinh `lib/globe/world-land-110m.json`: toạ độ đường bờ lục địa thật từ Natural Earth (độ phân giải 110m), làm tròn 1 chữ số thập phân (~11km, đủ cho quả địa cầu cách điệu) — 125 lục địa/đảo, 5123 điểm, ~20KB gzip. Chạy lại bằng `npm run geo:generate` khi cần.
- `lib/globe/world-geo.ts` (mới) — cắt ring tại đường đổi ngày (antimeridian, tránh vẽ đường ngang xuyên bản đồ ở Nga/Fiji/Nam Cực), tách riêng ring lỗ (hồ Caspi) để tô màu nước đè lên, và `lonLatToVector3()` (công thức đã verify trực tiếp khớp UV mapping của `THREE.SphereGeometry` từ source code three@0.184, không chỉ tin theo trí nhớ).
- `lib/globe/world-texture.ts` (mới) — vẽ texture equirectangular lên `<canvas>` ngay trong browser (không tải ảnh từ server/CDN nào → không cần whitelist domain mới trong CSP `img-src`), dùng làm `THREE.CanvasTexture` bọc quả địa cầu.
- `lib/globe/webgl-support.ts` (mới) — kiểm tra WebGL nhẹ, không tải Three.js.
- `components/map/WorldGlobeScene.tsx` (mới) — scene Three.js thuần (không react-three-fiber): OrbitControls (kéo xoay, cuộn zoom, auto-rotate khi rảnh, tự tắt nếu `prefers-reduced-motion`), raycasting hover/click marker (có lọc mặt sau quả địa cầu bị che), tooltip overlay HTML đồng bộ theo từng khung hình, hào quang Fresnel (rim glow) tông màu honey, marker pulse khi hover/active. Đồng bộ marker khi prop đổi (đổi filter biome, hover từ list) bằng diff thủ công, KHÔNG dựng lại scene (giữ nguyên góc xoay người dùng đang xem). Dọn dẹp đầy đủ geometry/material/texture/renderer lúc unmount.
- `components/map/WorldGlobe.tsx` (mới) — wrapper public: `next/dynamic(..., {ssr:false})` để Three.js không vào bundle các trang không có bản đồ; tự lùi về `WorldMap` (2D) nếu không hỗ trợ WebGL, dùng `useSyncExternalStore` (không dùng `setState` trong effect — vi phạm rule mới `react-hooks/set-state-in-effect` của `eslint-plugin-react-hooks` v7) để đọc capability này mà không lệch hydrate.
- `components/map/WorldMap.tsx` — thay toàn bộ mảng `CONTINENTS` vẽ tay (6 lục địa, toạ độ ước lượng) bằng dữ liệu thật từ `lib/globe/world-geo.ts` — bản đồ 2D dự phòng giờ cũng chính xác địa lý, không chỉ quả địa cầu 3D.
- `components/map/SpeciesDistributionMap.tsx`, `app/[lang]/map/page.tsx` — đổi sang dùng `WorldGlobe`.
- `i18n/dictionaries/{vi,en}.json` — thêm `worldMap.globeAriaLabel`, `worldMap.dragHint`.
- `package.json` — deps: `three`; devDeps: `@types/three`, `topojson-client` + `@types/topojson-client`, `world-atlas` (2 package cuối chỉ dùng trong `generate-world-geo.mts`, không ảnh hưởng bundle production).

##### Quyết định kiến trúc
- **Vanilla Three.js, không react-three-fiber** — thêm 1 abstraction layer không cần thiết cho 1 component, đi ngược triết lý "tối thiểu dependency" của dự án.
- **Sinh dữ liệu địa lý build-time, không runtime fetch** — cùng triết lý với Mục 6b (CMS sync). `world-atlas`/`topojson-client` chỉ chạy trong sandbox của tôi/máy dev, kết quả tĩnh commit vào repo.
- **Texture vẽ bằng Canvas 2D runtime, không ảnh PNG** — tránh asset nhị phân, tránh phải mở thêm domain ảnh trong CSP, tự động đổi màu nếu design token đổi (đọc màu qua `getComputedStyle` thay vì hard-code hex).
- **Quả địa cầu tự xoay hướng về phía các marker ban đầu** (tính centroid hướng 3D rồi xoay `globeGroup`) — nếu không, loài chỉ phân bố ở Đông Nam Á (VD sầu riêng) sẽ mở trang lên thấy ngay mặt... Châu Mỹ.

##### Lỗi đã phát hiện và sửa lúc verify
- Hồ Caspi (ring lỗ trong polygon Á-Âu) lúc đầu bị tô cùng màu lục địa → hiện thành 1 hình viền mờ vô nghĩa giữa đất liền. Sửa: vẽ ring lỗ ở pass riêng, tô màu nước đè lên sau cùng.
- `container` bị TypeScript báo `possibly null` trong các closure lồng (`resize`, `animate`) dù đã `if (!container) return` ngay trước — TS không tự suy luận narrowing xuyên qua khai báo `function` lồng bên trong (đã verify bằng test cô lập riêng). Sửa bằng cách gán lại biến sau khi narrow.
- `eslint-plugin-react-hooks` v7 (rule mới dạng "React Compiler"): cấm gán `ref.current = ...` trực tiếp lúc render (`react-hooks/refs`) và cấm gọi `setState` đồng bộ trong effect (`react-hooks/set-state-in-effect`). Phát hiện ngay từ bản build đầu — không phải lỗi cũ, mà do code mới viết theo pattern cũ chưa hợp với rule mới. Sửa bằng effect riêng để đồng bộ ref, và `useSyncExternalStore` thay cho `useLayoutEffect`+`setState` khi đọc WebGL support.
- `THREE.Clock` đã deprecated ở three@0.184 → đổi sang `THREE.Timer`.
- **🔴 [Phát hiện sau khi đã giao bản đầu — do người dùng báo "quả địa cầu bị ngược", verify lại mới ra lỗi thật]** `globeGroup.quaternion.setFromUnitVectors(centroid, (0,0,1))` đưa đúng centroid ra giữa khung hình, NHƯNG không kiểm soát "roll" (xoay quanh chính trục nhìn) — với centroid lệch xa khỏi xích đạo/kinh tuyến gốc (VD trang `/map` với 14 loài, centroid ngả về phía Việt Nam/Trung Quốc), roll đo được lên tới **126°**, khiến cả vùng nhìn bị vẹo trục Bắc, nhìn như "ngược" dù dữ liệu đường bờ biển hoàn toàn đúng. Phát hiện sai lầm ban đầu: lúc đầu tưởng là lỗi đông-tây (đã thử đảo `lon+180`→`180-lon`, verify lại bằng marker thật ở London/Tokyo/New York mới phát hiện bản gốc đông-tây ĐÚNG, đã revert) — lỗi thật nằm ở phần roll này, tìm ra bằng cách tái tạo y nguyên scene với dữ liệu 14 loài thật + gắn nhãn quốc gia lên từng marker để so khớp pixel-by-pixel với ảnh chụp người dùng gửi, rồi đo trực tiếp hướng "Bắc" sau khi xoay bằng vector toán học (không suy diễn). Sửa bằng `computeNorthUpOrientation()` — dựng hệ toạ độ trực chuẩn (right/up/target) thay cho `setFromUnitVectors`, đảm bảo roll = 0° với mọi centroid.

##### Bài học verify (ghi lại để tránh lặp lại)
Test bằng 1 species ít điểm, gần nhau, gần xích đạo (sầu riêng: VN/Indonesia/Malaysia/Thái Lan) KHÔNG phát hiện được lỗi roll — vì centroid của nhóm điểm gần nhau, ít lệch xích đạo thì roll nhỏ, không đáng kể. Lỗi chỉ rõ ràng ở trang `/map` (14 loài, trải nhiều lục địa, centroid lệch hẳn về 1 phía). Rút ra: khi verify tính năng liên quan toạ độ/xoay 3D, cần test với cả trường hợp "nhiều điểm trải rộng" chứ không chỉ trường hợp đơn giản, và khi nghi ngờ hướng/chiều, ưu tiên đo bằng số (dot/cross product, hoặc dựng lại scene thật để so khớp) thay vì chỉ nhìn ảnh suy diễn — lần đầu chính em cũng suy diễn sai (kết luận nhầm là lỗi đông-tây) trước khi đo lại bằng marker thật.
- **Quan trọng — phát hiện ngoài phạm vi mục này:** test bằng `next start` (production) + Chromium thật (Playwright) phát hiện **toàn bộ hydration React bị CSP chặn ở production**, không riêng tính năng này. Xem mục mới trong "Vấn đề kỹ thuật cần theo dõi" bên dưới — đây là lý do trước đây không phát hiện ra: verify trước giờ chỉ chạy `next dev` (có `unsafe-inline`) và `curl` (không chạy JS).

##### Đã verify
`tsc --noEmit`, `eslint` (0 lỗi/warning mới trên các file đã sửa), `next build` sạch (71 trang SSG, chunk Three.js ~134KB gzip, chỉ tải lười ở 2 trang có bản đồ). Verify trực quan bằng Chromium thật (Playwright + swiftshare software WebGL) qua `next dev`: quả địa cầu render đúng lục địa, đúng marker theo toạ độ thật, hào quang hover, đổi filter biome không vỡ scene, hover từ list làm marker sáng lên đúng — có screenshot kiểm chứng từng bước trong quá trình làm.

---

## Ghi chú kỹ thuật

### Quyết định kiến trúc quan trọng
1. **Không dùng MDX cho Knowledge** — dùng sections-based TS data để tránh install thêm package, giữ type-safety, và phù hợp với pattern mock data hiện tại. Khi có CMS thật, sections vẫn map được.
2. **Fuzzy search không dùng thư viện** — tự implement trigram + token để bundle size nhỏ. Nếu data tăng lên 1000+ items thì nên chuyển sang Fuse.js.
3. **localStorage first, auth sau** — UserActivity context thiết kế để dễ swap sang remote storage khi có backend.
4. **CMS/DB build-time, không runtime** (Mục 6b) — xem chi tiết ở mục 6b trên. Khi Mục 5 (UGC) cần dữ liệu runtime thật-time, dùng client Supabase riêng (anon key + RLS), không tái sử dụng `lib/db/*` (service-role, chỉ an toàn trong script/CI).
5. **i18n routing built-in, không next-intl** (Mục 6c) — `app/[lang]/` + `proxy.ts` + dictionary JSON tự viết. Dịch có chủ đích giới hạn: UI chrome + tên/tagline loài + nhãn biome, KHÔNG dịch nội dung dài (detail loài, bài viết Kiến thức) — xem "Phạm vi dịch" ở mục 6c.

### Vấn đề kỹ thuật cần theo dõi
- **🔴 [MỚI — Mục 6d, cần quyết định] CSP chặn toàn bộ hydration React ở production.** `next.config.ts` chỉ thêm `'unsafe-inline'` vào `script-src` khi `isDev`; ở production (`next start`), Next.js App Router vẫn nhúng các inline `<script>self.__next_f.push(...)</script>` (RSC streaming payload, cơ chế lõi, không tránh được) — bị `script-src 'self'` (không có `'unsafe-inline'`, không nonce) chặn hoàn toàn. Hậu quả: KHÔNG MỘT client component nào hydrate được ở production — favourite button, language switcher, search, quiz, và quả địa cầu 3D mới đều "chết" trên giao diện (HTML tĩnh vẫn hiện đúng vì SSR, nhưng không bấm/tương tác được gì). Phát hiện bằng Chromium thật (Playwright) chạy `next start`; trước đây không phát hiện vì verify chỉ dùng `next dev` (có `unsafe-inline`) và `curl` (không chạy JS) — cả 2 đều "che" được lỗi này. Next.js có khuyến nghị chính thức dùng CSP nonce qua `proxy.ts` (đã có sẵn file này, dùng cho i18n) để vừa giữ `script-src` nghiêm vừa không chặn hydration, NHƯNG theo docs: nonce **yêu cầu trang phải dynamic-render** (`await connection()`), không dùng được với SSG — mà toàn bộ kiến trúc 6b/6c của dự án này đang dựa vào SSG (`generateStaticParams`) để tối ưu hiệu năng/hosting. Đây là trade-off kiến trúc thật, cần bạn quyết định hướng (nonce + chuyển sang dynamic rendering, hay tạm dùng `'unsafe-inline'` ở production, hay hướng khác) — chưa tự sửa trong phạm vi Mục 6d để tránh áp đặt 1 quyết định ảnh hưởng toàn site.
- ~~CSP hiện tại block ảnh Unsplash~~ — đã mở `img-src https://images.unsplash.com` ở Mục 6a.
- Quiz page dùng client-side random — nếu nhiều câu hỏi hơn cần cân nhắc seed từ server
- Search INDEX build tại module load — ổn với data nhỏ, cần cache hoặc worker với data lớn
- `npm run lint` hiện báo 6 lỗi/18 warning **không liên quan tới Mục 6b/6c** — đều ở code Mục 1–3 (ví dụ `react-hooks/set-state-in-effect` trong `useLocalStorage.ts`, `useUserActivity.tsx`, `app/quiz/page.tsx`, `app/search/page.tsx`; `Math.random` trong `app/collection/page.tsx`; vài lỗi nhỏ khác về `<img>`/`any`). Không sửa trong phạm vi 6b/6c để tránh lan phạm vi — nên dọn ở 1 sprint riêng.
