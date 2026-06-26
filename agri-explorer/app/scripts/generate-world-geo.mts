/**
 * scripts/generate-world-geo.mts
 *
 * Sinh `lib/globe/world-land-110m.json` — toạ độ đường bờ lục địa thế giới,
 * lấy từ Natural Earth (độ phân giải 110m, phù hợp quả địa cầu cách điệu,
 * không cần chi tiết cấp quốc gia) qua 2 package `world-atlas` +
 * `topojson-client`.
 *
 * Đây là script BUILD-TIME chạy 1 lần (giống `seed-content.mts`,
 * `sync-content.mts`) — kết quả là 1 file JSON tĩnh được commit vào repo.
 * `world-atlas` và `topojson-client` CHỈ là devDependency dùng cho chính
 * script này, KHÔNG xuất hiện trong bundle phía client (WorldGlobe/WorldMap
 * chỉ import file JSON kết quả, không import 2 package này).
 *
 * Cách dùng:
 *   npm run geo:generate
 *
 * Chạy lại khi nào cần đổi độ phân giải (VD land-50m.json để chi tiết hơn)
 * hoặc Natural Earth cập nhật dữ liệu.
 */

import { writeFileSync } from "node:fs";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import landTopology from "world-atlas/land-110m.json" with { type: "json" };

const OUTPUT_FILE = new URL("../lib/globe/world-land-110m.json", import.meta.url);

/** [kinh độ, vĩ độ] — đúng thứ tự GeoJSON (lon trước, lat sau). */
type LonLat = [number, number];
type Ring = LonLat[];
/** Đa giác 1 lục địa: ring[0] = đường viền ngoài, ring[1+] = lỗ (hồ lớn, VD biển Caspi). */
type Polygon = Ring[];

/** Làm tròn 1 chữ số thập phân (~11km ở xích đạo) — đủ chi tiết cho quả địa
 * cầu cách điệu, giảm ~15% kích thước file so với 2 chữ số thập phân. */
function round(n: number): number {
  return Math.round(n * 10) / 10;
}

function main() {
  const topology = landTopology as unknown as Topology;
  const geo = feature(topology, topology.objects.land);

  // topojson-client trả về FeatureCollection (mỗi lục địa/đảo riêng là 1
  // feature Polygon hoặc MultiPolygon) — gộp lại thành 1 danh sách Polygon
  // duy nhất, đơn giản hoá cho phía dùng dữ liệu (WorldGlobe/WorldMap không
  // cần quan tâm Polygon vs MultiPolygon).
  if (geo.type !== "FeatureCollection") {
    throw new Error(`Kết quả topojson-client không như mong đợi: ${geo.type}`);
  }

  const polygons: Polygon[] = [];
  for (const f of geo.features) {
    const g = f.geometry;
    if (g.type === "Polygon") {
      polygons.push(g.coordinates as Polygon);
    } else if (g.type === "MultiPolygon") {
      polygons.push(...(g.coordinates as Polygon[]));
    }
  }

  const rounded: Polygon[] = polygons.map((polygon) =>
    polygon.map((ring) => ring.map(([lon, lat]): LonLat => [round(lon), round(lat)])),
  );

  writeFileSync(OUTPUT_FILE, JSON.stringify(rounded));

  const totalPoints = rounded.reduce(
    (sum, poly) => sum + poly.reduce((s, ring) => s + ring.length, 0),
    0,
  );
  const holeCount = rounded.reduce((sum, poly) => sum + (poly.length - 1), 0);
  console.log(`✅ Đã sinh ${OUTPUT_FILE.pathname}`);
  console.log(`   ${rounded.length} lục địa/đảo, ${totalPoints} điểm, ${holeCount} hồ (lỗ).`);
}

main();
