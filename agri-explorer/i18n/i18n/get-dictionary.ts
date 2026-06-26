import "server-only";
import type { Locale } from "./config";

/**
 * Dùng dynamic import theo đúng pattern khuyến nghị của Next.js docs
 * (app/[lang]/dictionaries.ts) — chỉ chạy trên server, file dictionary
 * không vào bundle client.
 */
const dictionaries = {
  vi: () => import("./dictionaries/vi.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

// Kiểm tra tĩnh: dictionaries phải có đúng key cho mỗi Locale (lỗi compile
// nếu thiếu 1 locale nào) — không dùng `satisfies` trực tiếp trên object vì
// nó khiến TS suy luận sai `ReturnType` thành `unknown` khi kết hợp với
// generic `Promise<unknown>` (đã verify lại bằng test cô lập).
type _AssertHasAllLocales = Locale extends keyof typeof dictionaries ? true : never;
const _assertHasAllLocales: _AssertHasAllLocales = true;
void _assertHasAllLocales;

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["vi"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
