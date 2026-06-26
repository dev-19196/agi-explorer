/**
 * lib/globe/world-geo.ts
 *
 * Dữ liệu & hình học đường bờ lục địa dùng chung cho quả địa cầu 3D
 * (`WorldGlobeScene`) và bản đồ 2D dự phòng (`WorldMap`).
 *
 * Dữ liệu lấy từ Natural Earth (độ phân giải 110m) qua `world-atlas` +
 * `topojson-client`, sinh 1 lần lúc build bằng
 * `scripts/generate-world-geo.mts` (xem `npm run geo:generate`) — KHÔNG
 * fetch lại lúc runtime, không phụ thuộc 2 package đó trong bundle client.
 */

import landPolygonsRaw from "./world-land-110m.json";

/** [kinh độ, vĩ độ] — đúng thứ tự GeoJSON (lon trước, lat sau). */
export type LonLat = readonly [lon: number, lat: number];
export type Ring = readonly LonLat[];
/** ring[0] = đường viền ngoài lục địa, ring[1+] = lỗ (hồ lớn, VD biển Caspi). */
export type Polygon = readonly Ring[];

export const WORLD_LAND_POLYGONS = landPolygonsRaw as unknown as Polygon[];

export interface CoastlineSegment {
  kind: "land" | "water";
  ring: LonLat[];
}

/**
 * Cắt 1 ring tại điểm kinh độ nhảy >180° — tránh vẽ 1 đường thẳng xuyên
 * ngang bản đồ khi 1 lục địa nằm vắt qua kinh tuyến ±180° (Nga, đảo Fiji,
 * Nam Cực). Bỏ các đoạn còn lại quá ngắn (<3 điểm, không tạo được đa giác).
 */
function splitAtAntimeridian(ring: Ring): LonLat[][] {
  const segments: LonLat[][] = [];
  let current: LonLat[] = [ring[0]];
  for (let i = 1; i < ring.length; i++) {
    const prevLon = ring[i - 1][0];
    const lon = ring[i][0];
    if (Math.abs(lon - prevLon) > 180) {
      segments.push(current);
      current = [];
    }
    current.push(ring[i]);
  }
  if (current.length) segments.push(current);
  return segments.filter((seg) => seg.length >= 3);
}

/**
 * Build danh sách đoạn sẵn sàng để vẽ (canvas hoặc SVG):
 * - ring ngoài → cắt theo antimeridian → tô màu lục địa.
 * - ring lỗ (hồ) → tô màu nước, vẽ ĐÈ LÊN sau cùng để "khoét" đúng vị trí.
 *   Không cần cắt antimeridian vì hồ trong dữ liệu 110m này không nằm gần
 *   kinh tuyến ±180°. Cách này đơn giản hơn dùng `fill-rule: evenodd` với
 *   path ghép (outer+hole), vì outer ring đôi khi đã bị tách làm 2 đoạn.
 */
export function buildCoastlineSegments(
  polygons: Polygon[] = WORLD_LAND_POLYGONS,
): CoastlineSegment[] {
  const segments: CoastlineSegment[] = [];
  for (const polygon of polygons) {
    const [outer, ...holes] = polygon;
    for (const seg of splitAtAntimeridian(outer)) {
      segments.push({ kind: "land", ring: seg });
    }
    for (const hole of holes) {
      segments.push({ kind: "water", ring: [...hole] });
    }
  }
  return segments;
}

/**
 * Chiếu kinh độ/vĩ độ → vị trí 3D trên mặt cầu bán kính `radius`.
 *
 * Công thức khớp đúng UV mapping mặc định của `THREE.SphereGeometry`
 * (đã verify trực tiếp với source code three@0.184 — xem PLAN.md) để
 * texture equirectangular vẽ ở `world-texture.ts` nằm đúng vị trí thực tế,
 * không bị lệch/ngược so với marker.
 */
export function lonLatToVector3(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}
