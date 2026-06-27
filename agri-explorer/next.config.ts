import type { NextConfig } from "next";

/**
 * Content-Security-Policy cho production.
 * - script-src chỉ 'self': toàn bộ JS đều build & host nội bộ (Next bundle),
 *   không nhúng script bên thứ 3 nào ở giai đoạn này.
 * - Khi thêm analytics / CDN / font ngoài ở các sprint sau, bổ sung domain
 *   cụ thể vào đây — KHÔNG dùng "*" hoặc "unsafe-inline" cho script-src.
 * - Mục 7 (Admin Dashboard): connect-src cần thêm origin của AgriExplorerApi
 *   (NEXT_PUBLIC_API_URL) vì admin gọi fetch() trực tiếp từ browser sang đó
 *   — "connect-src 'self'" mặc định sẽ chặn toàn bộ gọi API admin.
 */
const isDev = process.env.NODE_ENV !== "production";
const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").origin;
  } catch {
    return "";
  }
})();

const cspDirectives = [
  `default-src 'self'`,
  `script-src 'self'${isDev ? " 'unsafe-eval' 'unsafe-inline'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https://images.unsplash.com`,
  `font-src 'self' data:`,
  `media-src 'self'`,
  `connect-src 'self'${apiOrigin ? ` ${apiOrigin}` : ""}`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false, // không tiết lộ "X-Powered-By: Next.js"
  reactStrictMode: true,

  images: {
    // Sprint 4 (Mục 6a) — đã nối nguồn ảnh thật từ Unsplash cho gallery loài.
    // Chỉ khai báo chính xác domain cần dùng, không dùng wildcard "*" để
    // tránh bị lợi dụng làm SSRF qua image optimization endpoint.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
