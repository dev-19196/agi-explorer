import { NextResponse, type NextRequest } from "next/server";
import { LOCALES, DEFAULT_LOCALE } from "./i18n/config";

/**
 * proxy.ts (Mục 6c)
 *
 * Next.js 16 đổi tên `middleware.ts` → `proxy.ts` (hành vi giữ nguyên — xem
 * `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`).
 * File này PHẢI nằm ở project root (cùng cấp với `app/`), không phải trong
 * `app/`.
 *
 * Việc duy nhất: nếu path chưa có tiền tố `/vi` hoặc `/en`, suy ra locale
 * từ header `Accept-Language` (tự viết, không thêm dependency
 * `negotiator`/`@formatjs/intl-localematcher` cho 2 locale đơn giản) rồi
 * redirect. Không xử lý gì khác (không auth, không rewrite phức tạp).
 */

function detectLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .filter(Boolean);

  for (const lang of preferred) {
    if (lang.startsWith("en")) return "en";
    if (lang.startsWith("vi")) return "vi";
  }

  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocalePrefix = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocalePrefix) return;

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
