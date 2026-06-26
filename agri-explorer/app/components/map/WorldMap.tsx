"use client";

import { projectToPercent } from "@/lib/geo";
import { buildCoastlineSegments } from "@/lib/globe/world-geo";
import { useDictionary } from "@/i18n/use-dictionary";

/** Đường bờ lục địa thật (Natural Earth 110m) — xem lib/globe/world-geo.ts.
 * Tính 1 lần ở module scope vì dữ liệu tĩnh, không đổi giữa các lần render. */
const COASTLINE_SEGMENTS = buildCoastlineSegments();

function toViewBoxPoints(ring: readonly (readonly [number, number])[]) {
  return ring
    .map(([lon, lat]) => {
      const { xPct, yPct } = projectToPercent(lat, lon);
      return `${(xPct * 10).toFixed(1)},${(yPct * 5).toFixed(1)}`;
    })
    .join(" ");
}

export interface MapMarker {
  lat: number;
  lon: number;
  label: string;
  color?: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

interface WorldMapProps {
  markers: MapMarker[];
  className?: string;
}

/** Bản đồ thế giới 2D bằng SVG (đường bờ lục địa thật) — dùng làm phương án
 * dự phòng khi thiết bị không hỗ trợ WebGL, xem `WorldGlobe`. */
export function WorldMap({ markers, className }: WorldMapProps) {
  const dict = useDictionary();
  return (
    <svg
      viewBox="0 0 1000 500"
      className={className}
      role="img"
      aria-label={dict.worldMap.ariaLabel}
    >
      <rect x="0" y="0" width="1000" height="500" fill="var(--color-pine-soft)" />

      {COASTLINE_SEGMENTS.map((seg, i) => (
        <polygon
          key={i}
          points={toViewBoxPoints(seg.ring)}
          fill={seg.kind === "land" ? "var(--color-canvas-deep)" : "var(--color-pine-soft)"}
          stroke="var(--color-line)"
          strokeWidth={seg.kind === "land" ? 1.2 : 0.8}
          strokeLinejoin="round"
        />
      ))}

      {markers.map((m, i) => {
        const { xPct, yPct } = projectToPercent(m.lat, m.lon);
        const cx = xPct * 10;
        const cy = yPct * 5;
        const color = m.color ?? "var(--color-honey-dark)";
        const content = (
          <g
            key={`${m.label}-${i}`}
            transform={`translate(${cx} ${cy})`}
            className={m.href || m.onClick ? "cursor-pointer" : undefined}
            onClick={m.onClick}
          >
            {m.active && (
              <circle r={14} fill={color} opacity={0.25}>
                <animate attributeName="r" values="10;18;10" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.35;0.05;0.35" dur="2.4s" repeatCount="indefinite" />
              </circle>
            )}
            <circle r={6} fill={color} stroke="var(--color-canvas)" strokeWidth={2} />
            <title>{m.label}</title>
          </g>
        );
        return m.href ? (
          <a key={`a-${m.label}-${i}`} href={m.href}>
            {content}
          </a>
        ) : (
          content
        );
      })}
    </svg>
  );
}
