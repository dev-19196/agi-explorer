"use client";

import { useRouter, useParams } from "next/navigation";
import { DEFAULT_LOCALE } from "./config";

/**
 * i18n/useLocaleRouter.ts
 *
 * Thay thế trực tiếp cho `useRouter()` của `next/navigation` — `push`/
 * `replace` tự thêm tiền tố locale hiện tại. Migrate 1 file: đổi import +
 * đổi tên hook gọi, giữ nguyên cách dùng `router.push(...)`.
 */
export function useLocaleRouter() {
  const router = useRouter();
  const params = useParams<{ lang?: string }>();
  const lang = params.lang ?? DEFAULT_LOCALE;

  function localize(href: string): string {
    if (!href.startsWith("/")) return href;
    return href === "/" ? `/${lang}` : `/${lang}${href}`;
  }

  return {
    ...router,
    push: (href: string, options?: Parameters<typeof router.push>[1]) =>
      router.push(localize(href), options),
    replace: (href: string, options?: Parameters<typeof router.replace>[1]) =>
      router.replace(localize(href), options),
  };
}
