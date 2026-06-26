/**
 * i18n/config.ts
 *
 * Cấu hình trung tâm cho i18n (Mục 6c). Phạm vi: routing 2 ngôn ngữ đầy đủ
 * (vi/en) cho TOÀN BỘ app qua segment `app/[lang]/`, nhưng dịch NỘI DUNG chỉ
 * ở mức đã thống nhất trong PLAN.md — tên loài, tagline, nhãn biome/region,
 * khung UI (nav, footer). Nội dung dài (detail loài, bài viết Kiến thức) vẫn
 * chỉ có tiếng Việt — xem `i18n/VietnameseOnlyNote.tsx`.
 */

export const LOCALES = ["vi", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "vi";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
