import { WorldGlobe } from "@/components/map/WorldGlobe";
import type { GeoPoint } from "@/types/content";

export function SpeciesDistributionMap({ points }: { points: GeoPoint[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_220px]">
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-line">
        <WorldGlobe
          markers={points.map((p) => ({ lat: p.lat, lon: p.lon, label: p.label, active: true }))}
          className="aspect-[2/1] w-full"
        />
      </div>
      <ul className="space-y-2">
        {points.map((p) => (
          <li key={p.label} className="flex items-start gap-2 text-sm text-ink-soft">
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-honey-dark" />
            {p.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
