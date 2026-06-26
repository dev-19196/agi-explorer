/**
 * scripts/sync-content.mts
 *
 * Đọc nội dung mới nhất từ Supabase và SINH LẠI các file `lib/data/*.ts`
 * tương ứng — đúng tên export, đúng type, để mọi component/page đang import
 * `plants`, `animals`, `mediaItems`, `articles`, `seasonalEvents`,
 * `weatherAlerts` KHÔNG cần sửa gì cả (đúng mục tiêu "giữ nguyên interface"
 * của Mục 6b trong PLAN.md).
 *
 * Chạy script này sau khi biên tập nội dung trong Supabase Studio, trước
 * khi `npm run build` để build production với nội dung mới nhất.
 *
 * Cách dùng:
 *   npm run content:sync              — đọc Supabase, ghi đè lib/data/*.ts
 *   npm run content:sync -- --dry-run — chỉ in số lượng record đọc được,
 *                                        KHÔNG ghi file
 *
 * An toàn: đọc + validate (Zod, qua các hàm fetch* trong lib/db/*) TOÀN BỘ
 * 6 bảng trước, chỉ ghi file khi tất cả đều hợp lệ — tránh tình trạng ghi
 * dở dang nếu 1 bảng lỗi giữa chừng.
 */

import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";

import {
  fetchPlants,
  fetchAnimals,
  fetchMediaItems,
  fetchArticles,
  fetchSeasonalEvents,
  fetchWeatherAlerts,
} from "../lib/db";

const ENV_FILE = ".env.local";
if (existsSync(ENV_FILE)) {
  process.loadEnvFile(ENV_FILE);
}

const isDryRun = process.argv.includes("--dry-run");
const DATA_DIR = path.join(import.meta.dirname, "..", "lib", "data");

function renderFile(opts: {
  imports: string;
  table: string;
  body: string;
}): string {
  const generatedAt = new Date().toISOString();
  return `${opts.imports}

/**
 * Nguồn dữ liệu chính: Supabase, bảng ${opts.table} (xem
 * \`supabase/schema.sql\`). File này được SINH TỰ ĐỘNG bởi
 * \`npm run content:sync\` lúc ${generatedAt} — KHÔNG sửa tay, mọi thay đổi
 * sẽ bị ghi đè ở lần sync kế tiếp. Sửa nội dung trong Supabase Studio rồi
 * chạy lại \`npm run content:sync\`.
 */
${opts.body}
`;
}

async function main() {
  console.log(`\n=== Đồng bộ nội dung từ Supabase ${isDryRun ? "(DRY RUN — không ghi file)" : ""} ===\n`);

  console.log("  Đang đọc + validate 6 bảng...");
  const [plants, animals, mediaItems, articles, seasonalEvents, weatherAlerts] =
    await Promise.all([
      fetchPlants(),
      fetchAnimals(),
      fetchMediaItems(),
      fetchArticles(),
      fetchSeasonalEvents(),
      fetchWeatherAlerts(),
    ]);

  console.log(`    plants: ${plants.length}`);
  console.log(`    animals: ${animals.length}`);
  console.log(`    media_items: ${mediaItems.length}`);
  console.log(`    articles: ${articles.length}`);
  console.log(`    seasonal_events: ${seasonalEvents.length}`);
  console.log(`    weather_alerts: ${weatherAlerts.length}`);

  if (isDryRun) {
    console.log("\nDry-run hoàn tất — không có file nào được ghi.\n");
    return;
  }

  const files: Array<{ name: string; content: string }> = [
    {
      name: "plants.ts",
      content: renderFile({
        imports: `import type { Plant } from "@/types/content";`,
        table: "`plants`",
        body: `export const plants: Plant[] = ${JSON.stringify(plants, null, 2)};`,
      }),
    },
    {
      name: "animals.ts",
      content: renderFile({
        imports: `import type { Animal } from "@/types/content";`,
        table: "`animals`",
        body: `export const animals: Animal[] = ${JSON.stringify(animals, null, 2)};`,
      }),
    },
    {
      name: "media.ts",
      content: renderFile({
        imports: `import type { MediaItem } from "@/types/content";`,
        table: "`media_items`",
        body: `export const mediaItems: MediaItem[] = ${JSON.stringify(mediaItems, null, 2)};`,
      }),
    },
    {
      name: "articles.ts",
      content: renderFile({
        imports: `import type { Article } from "@/types/content";`,
        table: "`articles`",
        body: `export const articles: Article[] = ${JSON.stringify(articles, null, 2)};`,
      }),
    },
    {
      name: "seasonal-calendar.ts",
      content: renderFile({
        imports: `import type { SeasonalEvent, WeatherAlert } from "@/types/content";`,
        table: "`seasonal_events` + `weather_alerts`",
        body: [
          `export const seasonalEvents: SeasonalEvent[] = ${JSON.stringify(seasonalEvents, null, 2)};`,
          "",
          `export const weatherAlerts: WeatherAlert[] = ${JSON.stringify(weatherAlerts, null, 2)};`,
        ].join("\n"),
      }),
    },
  ];

  console.log("\n  Đang ghi file...");
  for (const file of files) {
    const filePath = path.join(DATA_DIR, file.name);
    await writeFile(filePath, file.content, "utf-8");
    console.log(`    đã ghi lib/data/${file.name}`);
  }

  console.log(
    "\n✅ Sync hoàn tất. Nhớ chạy `npm run lint -- --fix` để format lại file vừa sinh,\n" +
      "   rồi `npm run build` để xác nhận không có lỗi type trước khi deploy.\n",
  );
}

main().catch((err) => {
  console.error("\n❌ Sync thất bại — KHÔNG file nào bị ghi đè:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
