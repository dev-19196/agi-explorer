"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { Globe2 } from "lucide-react";
import { WorldMap, type MapMarker } from "@/components/map/WorldMap";
import { supportsWebGL } from "@/lib/globe/webgl-support";

const WorldGlobeScene = dynamic(
  () => import("@/components/map/WorldGlobeScene").then((mod) => mod.WorldGlobeScene),
  {
    ssr: false,
    loading: () => <GlobeSkeleton />,
  },
);

function GlobeSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`flex aspect-[2/1] w-full animate-pulse items-center justify-center rounded-[var(--radius-card)] bg-canvas-deep/50 ${className ?? ""}`}
    >
      <Globe2 className="size-8 text-ink-faint" aria-hidden />
    </div>
  );
}

// Khả năng hỗ trợ WebGL không đổi trong 1 phiên, nên đây là "external store"
// không bao giờ thông báo thay đổi — chỉ cần đọc đúng giá trị, tránh tạo lại
// canvas/WebGL context kiểm tra mỗi lần render.
let cachedWebglSupport: boolean | null = null;
function getWebglSnapshot() {
  if (cachedWebglSupport === null) cachedWebglSupport = supportsWebGL();
  return cachedWebglSupport;
}
function subscribeNever() {
  return () => {};
}
// Lạc quan ở lần render đầu (SSR + hydrate đầu tiên) — giả định trình duyệt
// hỗ trợ WebGL để quả địa cầu hiển thị ngay, không giật qua bản đồ 2D rồi
// đổi lại. `useSyncExternalStore` tự kiểm tra lại đúng giá trị ngay sau khi
// hydrate (đây là đúng mục đích thiết kế của hook này: đọc API chỉ có ở
// client mà không lệch hydrate, không cần tự gọi setState trong effect).
function getWebglServerSnapshot() {
  return true;
}

interface WorldGlobeProps {
  markers: MapMarker[];
  className?: string;
}

/**
 * Quả địa cầu 3D xoay được (Three.js), hiển thị vị trí phân bố loài bằng
 * toạ độ thật trên mặt cầu — rõ ràng hơn bản đồ 2D cũ vì người dùng có thể
 * xoay/zoom để định vị quốc gia chính xác.
 *
 * Tự động lùi về `WorldMap` (SVG 2D, cùng dữ liệu địa lý) nếu:
 * - Thiết bị/trình duyệt không hỗ trợ WebGL (kiểm tra trước khi tải).
 * - Việc khởi tạo WebGLRenderer vẫn lỗi sau đó (qua callback `onUnsupported`).
 *
 * Three.js được tải lười (`next/dynamic`, `ssr:false`) — không ảnh hưởng
 * bundle của các trang không hiển thị bản đồ.
 */
export function WorldGlobe({ markers, className }: WorldGlobeProps) {
  const webglLikelySupported = useSyncExternalStore(
    subscribeNever,
    getWebglSnapshot,
    getWebglServerSnapshot,
  );
  const [forcedFallback, setForcedFallback] = useState(false);
  const handleUnsupported = useCallback(() => setForcedFallback(true), []);

  if (!webglLikelySupported || forcedFallback) {
    return <WorldMap markers={markers} className={className} />;
  }

  return (
    <WorldGlobeScene markers={markers} className={className} onUnsupported={handleUnsupported} />
  );
}
