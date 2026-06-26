import { Info } from "lucide-react";

/**
 * Hiện ở locale `en` ngay trước nội dung detail loài / bài viết Kiến thức
 * — phần này có chủ đích KHÔNG dịch ở Mục 6c (xem PLAN.md). Component
 * server-safe, không cần "use client".
 */
export function VietnameseOnlyNote({ text }: { text: string }) {
  return (
    <div className="mt-6 flex items-start gap-2 rounded-[var(--radius-card)] border border-line bg-canvas-soft px-4 py-3 text-sm text-ink-faint">
      <Info className="mt-0.5 size-4 shrink-0" />
      <p>{text}</p>
    </div>
  );
}
