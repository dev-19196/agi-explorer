/**
 * Tái hiện đúng motif đã có ở components/cards/SpecimenPlate.tsx (lưới chấm +
 * viền nét đứt, tint theo màu pine) — dùng làm "chữ ký" thị giác duy nhất của
 * admin, để khu vực quản trị vẫn đọc được là cùng 1 sản phẩm với trang khai
 * thác, dùng nhất quán ở: sidebar, login, modal form.
 */
export function SpecimenBadgeIcon({
  children,
  size = 40,
}: {
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-[calc(var(--radius-card)-0.3rem)]"
      style={{
        width: size,
        height: size,
        background:
          "linear-gradient(155deg, color-mix(in srgb, var(--color-pine) 22%, transparent) 0%, color-mix(in srgb, var(--color-pine) 6%, transparent) 60%, transparent 100%)",
      }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-50" preserveAspectRatio="none">
        <pattern id="admin-dot-grid" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="var(--color-pine)" fillOpacity="0.4" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#admin-dot-grid)" />
      </svg>
      <div
        className="absolute inset-1 rounded-[calc(var(--radius-card)-0.5rem)] border border-dashed"
        style={{ borderColor: "color-mix(in srgb, var(--color-pine) 35%, transparent)" }}
      />
      <div className="relative text-pine">{children}</div>
    </div>
  );
}

/** Dải eyebrow honey, đúng pattern dùng ở EnvironmentSection/Hero/ArticleRenderer của trang khai thác. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-honey-dark">{children}</p>
  );
}
