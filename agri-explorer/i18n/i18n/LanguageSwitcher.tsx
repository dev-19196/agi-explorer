"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, type Locale } from "./config";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  lang: Locale;
  labels: Record<Locale, string>;
  className?: string;
}

/**
 * Giữ nguyên phần path sau locale khi đổi ngôn ngữ (ví dụ đang ở
 * `/vi/plants/lua` bấm "English" → `/en/plants/lua`).
 *
 * Giới hạn: `usePathname()` không gồm query string, nên nếu trang hiện tại
 * có `?q=...` (ví dụ /search) thì sẽ mất khi đổi ngôn ngữ — chấp nhận được
 * ở phạm vi 6c, không phải luồng chính.
 */
export function LanguageSwitcher({ lang, labels, className }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center gap-2">
          {i > 0 && <span className="text-ink-faint/50">·</span>}
          <NextLink
            href={`/${l}${rest ? `/${rest}` : ""}`}
            aria-current={l === lang ? "true" : undefined}
            className={cn(
              "transition-colors",
              l === lang ? "font-semibold text-pine" : "text-ink-faint hover:text-pine",
            )}
          >
            {labels[l]}
          </NextLink>
        </span>
      ))}
    </div>
  );
}
