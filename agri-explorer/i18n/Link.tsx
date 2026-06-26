"use client";

import NextLink, { type LinkProps } from "next/link";
import { useParams } from "next/navigation";
import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from "react";
import { DEFAULT_LOCALE } from "./config";

/**
 * i18n/Link.tsx
 *
 * Thay thế trực tiếp cho `next/link` — tự thêm `/vi` hoặc `/en` vào đầu
 * `href` dựa theo locale hiện tại (đọc qua `useParams()`, không cần
 * Context provider vì giá trị đã có sẵn trong route param `[lang]`).
 *
 * Migrate 1 file: chỉ đổi `import Link from "next/link"` thành
 * `import { Link } from "@/i18n/Link"` — không cần sửa gì khác, vì props
 * giữ nguyên 100% so với `next/link`.
 *
 * Giới hạn: chỉ xử lý `href` dạng string bắt đầu bằng "/" (route nội bộ).
 * Link ngoài (`https://...`), `mailto:`, `#anchor`, hoặc `href` dạng
 * `UrlObject` được giữ nguyên, không thêm locale — toàn bộ usage hiện tại
 * trong app đều dùng string nội bộ nên không bị ảnh hưởng.
 */

function localizeHref(href: LinkProps["href"], lang: string): LinkProps["href"] {
  if (typeof href !== "string" || !href.startsWith("/")) return href;
  return href === "/" ? `/${lang}` : `/${lang}${href}`;
}

type Props = LinkProps & {
  children?: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

export const Link = forwardRef<HTMLAnchorElement, Props>(function Link(
  { href, ...props },
  ref,
) {
  const params = useParams<{ lang?: string }>();
  const lang = params.lang ?? DEFAULT_LOCALE;
  return <NextLink ref={ref} href={localizeHref(href, lang)} {...props} />;
});
