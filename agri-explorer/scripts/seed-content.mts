/**
 * scripts/seed-content.mts
 *
 * Đẩy dữ liệu hiện có trong `lib/data/*.ts` (viết tay từ các sprint trước)
 * lên Supabase — chạy 1 lần (hoặc bất cứ khi nào muốn reset nội dung gốc)
 * sau khi đã tạo project Supabase + chạy `supabase/schema.sql`.
 *
 * Idempotent: dùng `upsert` theo khoá chính (slug/id), chạy lại nhiều lần
 * không tạo bản trùng.
 *
 * Cách dùng:
 *   npm run content:seed              — seed thật lên Supabase
 *   npm run content:seed -- --dry-run — chỉ in số lượng record, KHÔNG ghi gì
 *
 * Yêu cầu: file `.env.local` (copy từ `.env.example`) với SUPABASE_URL và
 * SUPABASE_SERVICE_ROLE_KEY hợp lệ — script sẽ báo lỗi rõ ràng nếu thiếu.
 */

import { existsSync } from "node:fs";

import { plants } from "../lib/data/plants";
import { animals } from "../lib/data/animals";
import { mediaItems } from "../lib/data/media";
import { articles } from "../lib/data/articles";
import { seasonalEvents, weatherAlerts } from "../lib/data/seasonal-calendar";
import {
  upsertPlants,
  upsertAnimals,
  upsertMediaItems,
  upsertArticles,
  upsertSeasonalEvents,
  upsertWeatherAlerts,
} from "../lib/db";

const ENV_FILE = ".env.local";
if (existsSync(ENV_FILE)) {
  process.loadEnvFile(ENV_FILE);
}

const isDryRun = process.argv.includes("--dry-run");

const TASKS: Array<{ label: string; count: number; run: () => Promise<void> }> = [
  { label: "plants", count: plants.length, run: () => upsertPlants(plants) },
  { label: "animals", count: animals.length, run: () => upsertAnimals(animals) },
  { label: "media_items", count: mediaItems.length, run: () => upsertMediaItems(mediaItems) },
  { label: "articles", count: articles.length, run: () => upsertArticles(articles) },
  {
    label: "seasonal_events",
    count: seasonalEvents.length,
    run: () => upsertSeasonalEvents(seasonalEvents),
  },
  {
    label: "weather_alerts",
    count: weatherAlerts.length,
    run: () => upsertWeatherAlerts(weatherAlerts),
  },
];

async function main() {
  console.log(`\n=== Seed dữ liệu lên Supabase ${isDryRun ? "(DRY RUN — không ghi gì)" : ""} ===\n`);

  for (const task of TASKS) {
    if (isDryRun) {
      console.log(`  [dry-run] ${task.label}: sẽ upsert ${task.count} record`);
      continue;
    }
    process.stdout.write(`  → ${task.label} (${task.count} record)... `);
    await task.run();
    console.log("OK");
  }

  console.log(
    isDryRun
      ? "\nDry-run hoàn tất — không có gì được ghi. Bỏ cờ --dry-run để seed thật.\n"
      : "\n✅ Seed hoàn tất.\n",
  );
}

main().catch((err) => {
  console.error("\n❌ Seed thất bại:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
