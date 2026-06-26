import { Leaf, PawPrint, Image as ImageIcon, Video, BarChart3 } from "lucide-react";
import type { Biome, MediaType } from "@/types/content";
import { cn } from "@/lib/utils";

const BIOME_COLOR: Record<Biome, string> = {
  tropical: "var(--biome-tropical)",
  plains: "var(--biome-plains)",
  mountain: "var(--biome-mountain)",
  desert: "var(--biome-desert)",
  wetland: "var(--biome-wetland)",
};

interface SpecimenPlateProps {
  biome: Biome;
  icon?: "plant" | "animal" | "media";
  mediaType?: MediaType;
  className?: string;
}

/**
 * Thẻ minh hoạ phong cách "tiêu bản herbarium" — dùng nhất quán cho mọi
 * card thay vì ảnh chụp thật. Đây là lựa chọn thiết kế có chủ đích (không
 * phải placeholder tạm), vì Sprint 1 chưa kết nối nguồn ảnh/CMS thật.
 * Khi có ảnh thật, thay thế bằng <Image> ngay trong từng *Card component
 * mà không cần đổi layout xung quanh.
 */
export function SpecimenPlate({ biome, icon = "plant", mediaType, className }: SpecimenPlateProps) {
  const color = BIOME_COLOR[biome];
  const IconComp =
    icon === "animal"
      ? PawPrint
      : icon === "media"
        ? mediaType === "video"
          ? Video
          : mediaType === "infographic"
            ? BarChart3
            : ImageIcon
        : Leaf;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-[var(--radius-card)]",
        className
      )}
      style={{
        background: `linear-gradient(155deg, ${color}26 0%, ${color}0d 60%, transparent 100%)`,
      }}
      aria-hidden="true"
    >
      {/* lưới chấm nhẹ gợi cảm giác "bản đồ phân bố" */}
      <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none">
        <pattern id={`dots-${biome}`} width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1.4" cy="1.4" r="1.4" fill={color} fillOpacity="0.35" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#dots-${biome})`} />
      </svg>

      <div
        className="absolute inset-3 rounded-[calc(var(--radius-card)-0.4rem)] border border-dashed"
        style={{ borderColor: `${color}55` }}
      />

      <IconComp className="relative size-9 stroke-[1.4]" style={{ color }} />
    </div>
  );
}
