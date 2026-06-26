"use client";

import { useParams } from "next/navigation";
import vi from "./dictionaries/vi.json";
import en from "./dictionaries/en.json";
import { DEFAULT_LOCALE, type Locale } from "./config";
import type { Dictionary } from "./get-dictionary";

// Import tĩnh (không qua getDictionary/server-only) — 2 file JSON đều nhỏ,
// chấp nhận được trong bundle client. Dùng cho Client Component lồng sâu
// (Hero → HeroSearch → LuckyButton) để tránh phải truyền `dict` qua nhiều
// lớp props từ Server Component cha.
const DICTIONARIES: Record<Locale, Dictionary> = { vi, en };

export function useLocale(): Locale {
  const params = useParams<{ lang?: string }>();
  return (params.lang as Locale | undefined) ?? DEFAULT_LOCALE;
}

export function useDictionary(): Dictionary {
  const locale = useLocale();
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}
