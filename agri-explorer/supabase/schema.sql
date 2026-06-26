-- ============================================================================
-- Agri Explorer — Schema Supabase (Mục 6b)
-- ============================================================================
-- Chạy file này 1 lần trong Supabase Studio → SQL Editor (hoặc qua Supabase
-- CLI: `supabase db push`) trên một project Supabase mới hoàn toàn rỗng.
--
-- Idempotent: dùng `if not exists` / `or replace` ở mọi nơi có thể, nên có
-- thể chạy lại an toàn nếu lần đầu bị lỗi giữa chừng.
--
-- Quyết định kiến trúc:
--  1. Các khối lồng nhau, hình dạng linh hoạt (PlantDetail, AnimalDetail,
--     ArticleSection[]) lưu dưới dạng `jsonb` thay vì chuẩn hoá hết ra bảng
--     con. Lý do: nội dung này luôn được đọc/ghi như một khối nguyên vẹn (cả
--     bài, cả "detail" của 1 loài) — không có nhu cầu query theo từng field
--     con (ví dụ "tìm mọi cây có watering = X" là vô nghĩa với dữ liệu dạng
--     văn bản tự do). Khi nhu cầu lọc xuất hiện thật (ví dụ lọc theo gallery
--     credit), tách bảng con lúc đó vẫn không phá vỡ tầng `lib/db/*`.
--  2. `BIOMES` và `REGIONS` (tên hiển thị, mô tả, CSS var) KHÔNG đưa vào DB —
--     đây là hằng số gắn chặt với UI/CSS (`types/content.ts`), không phải
--     nội dung biên tập. DB chỉ lưu khoá (enum) tham chiếu tới hằng số này.
--  3. RLS: bật trên mọi bảng, chỉ cấp policy SELECT cho `anon`/`authenticated`.
--     KHÔNG cấp policy INSERT/UPDATE/DELETE cho 2 role này — nghĩa là ghi dữ
--     liệu chỉ thực hiện được qua `service_role` key (server-side, không bao
--     giờ lộ ra client). Đây là nguyên tắc "deny by default".
-- ============================================================================

-- ─── Enums ───────────────────────────────────────────────────────────────────

do $$ begin
  create type biome as enum ('tropical', 'plains', 'mountain', 'desert', 'wetland');
exception when duplicate_object then null; end $$;

do $$ begin
  create type plant_category as enum ('fruit', 'vegetable', 'herbal', 'industrial');
exception when duplicate_object then null; end $$;

do $$ begin
  create type region as enum ('bac', 'trung', 'nam');
exception when duplicate_object then null; end $$;

do $$ begin
  create type weather_alert_level as enum ('info', 'caution', 'warning');
exception when duplicate_object then null; end $$;

do $$ begin
  create type media_type as enum ('photo', 'video', 'infographic');
exception when duplicate_object then null; end $$;

do $$ begin
  create type media_aspect as enum ('square', 'portrait', 'landscape');
exception when duplicate_object then null; end $$;

do $$ begin
  create type article_category as enum ('canh-tac', 'sinh-thai', 'thu-hoach', 'dong-vat', 'kham-pha');
exception when duplicate_object then null; end $$;

-- ─── Hàm dùng chung: tự cập nhật updated_at ─────────────────────────────────

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Bảng: plants ────────────────────────────────────────────────────────────

create table if not exists public.plants (
  slug            text primary key,
  name            text not null,
  scientific_name text not null,
  category        plant_category not null,
  biome           biome not null,
  country         text not null,
  tagline         text not null,
  -- Khớp với type PlantDetail (types/content.ts) khi có; null nếu loài
  -- chưa được biên soạn chi tiết.
  detail          jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_plants_biome on public.plants (biome);
create index if not exists idx_plants_category on public.plants (category);

drop trigger if exists trg_plants_updated_at on public.plants;
create trigger trg_plants_updated_at
  before update on public.plants
  for each row execute function set_updated_at();

-- ─── Bảng: animals ───────────────────────────────────────────────────────────

create table if not exists public.animals (
  slug            text primary key,
  name            text not null,
  scientific_name text not null,
  biome           biome not null,
  country         text not null,
  tagline         text not null,
  -- Khớp với type AnimalDetail (types/content.ts) khi có.
  detail          jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_animals_biome on public.animals (biome);

drop trigger if exists trg_animals_updated_at on public.animals;
create trigger trg_animals_updated_at
  before update on public.animals
  for each row execute function set_updated_at();

-- ─── Bảng: media_items ───────────────────────────────────────────────────────

create table if not exists public.media_items (
  id         text primary key,
  title      text not null,
  type       media_type not null,
  biome      biome not null,
  aspect     media_aspect not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_media_items_biome on public.media_items (biome);
create index if not exists idx_media_items_type on public.media_items (type);

drop trigger if exists trg_media_items_updated_at on public.media_items;
create trigger trg_media_items_updated_at
  before update on public.media_items
  for each row execute function set_updated_at();

-- ─── Bảng: articles ──────────────────────────────────────────────────────────

create table if not exists public.articles (
  slug             text primary key,
  title            text not null,
  description      text not null,
  category         article_category not null,
  biome            biome, -- nullable: không phải bài viết nào cũng gắn 1 biome
  reading_time_min smallint not null check (reading_time_min > 0),
  published_at     timestamptz not null,
  cover_image      text not null,
  cover_caption    text,
  tags             text[] not null default '{}',
  related_slugs    text[] not null default '{}',
  -- Khớp với type ArticleSection[] (types/content.ts) — union 7 dạng section.
  sections         jsonb not null default '[]',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_articles_category on public.articles (category);
create index if not exists idx_articles_published_at on public.articles (published_at desc);
create index if not exists idx_articles_tags on public.articles using gin (tags);

drop trigger if exists trg_articles_updated_at on public.articles;
create trigger trg_articles_updated_at
  before update on public.articles
  for each row execute function set_updated_at();

-- ─── Bảng: seasonal_events ───────────────────────────────────────────────────

create table if not exists public.seasonal_events (
  id             text primary key,
  plant_slug     text not null references public.plants (slug) on delete cascade,
  region         region not null,
  -- MonthRange tách thành 4 cột số nguyên (1-12) để query được trực tiếp
  -- bằng SQL (ví dụ "cây nào thu hoạch được trong tháng 6") — thay vì gói
  -- gọn vào jsonb như các khối "detail" tự do khác.
  planting_start smallint not null check (planting_start between 1 and 12),
  planting_end   smallint not null check (planting_end between 1 and 12),
  harvest_start  smallint not null check (harvest_start between 1 and 12),
  harvest_end    smallint not null check (harvest_end between 1 and 12),
  note           text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_seasonal_events_plant_slug on public.seasonal_events (plant_slug);
create index if not exists idx_seasonal_events_region on public.seasonal_events (region);

drop trigger if exists trg_seasonal_events_updated_at on public.seasonal_events;
create trigger trg_seasonal_events_updated_at
  before update on public.seasonal_events
  for each row execute function set_updated_at();

-- ─── Bảng: weather_alerts ────────────────────────────────────────────────────

create table if not exists public.weather_alerts (
  id          text primary key,
  biome       biome not null,
  region      region not null,
  months      smallint[] not null,
  level       weather_alert_level not null,
  title       text not null,
  description text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_weather_alerts_region on public.weather_alerts (region);
create index if not exists idx_weather_alerts_biome on public.weather_alerts (biome);

drop trigger if exists trg_weather_alerts_updated_at on public.weather_alerts;
create trigger trg_weather_alerts_updated_at
  before update on public.weather_alerts
  for each row execute function set_updated_at();

-- ============================================================================
-- Row Level Security — bật trên mọi bảng, chỉ cho phép đọc công khai.
-- Ghi (insert/update/delete) KHÔNG có policy nào cho anon/authenticated →
-- chỉ service_role (bypass RLS theo mặc định của Supabase) mới ghi được.
-- ============================================================================

alter table public.plants enable row level security;
alter table public.animals enable row level security;
alter table public.media_items enable row level security;
alter table public.articles enable row level security;
alter table public.seasonal_events enable row level security;
alter table public.weather_alerts enable row level security;

drop policy if exists "Public read access" on public.plants;
create policy "Public read access" on public.plants for select using (true);

drop policy if exists "Public read access" on public.animals;
create policy "Public read access" on public.animals for select using (true);

drop policy if exists "Public read access" on public.media_items;
create policy "Public read access" on public.media_items for select using (true);

drop policy if exists "Public read access" on public.articles;
create policy "Public read access" on public.articles for select using (true);

drop policy if exists "Public read access" on public.seasonal_events;
create policy "Public read access" on public.seasonal_events for select using (true);

drop policy if exists "Public read access" on public.weather_alerts;
create policy "Public read access" on public.weather_alerts for select using (true);
