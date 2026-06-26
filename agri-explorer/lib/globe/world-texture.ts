/**
 * lib/globe/world-texture.ts
 *
 * Vẽ texture canvas equirectangular (lục địa + lưới kinh/vĩ tuyến) để bọc
 * lên quả địa cầu 3D — vẽ trực tiếp trong browser bằng Canvas 2D API, KHÔNG
 * tải ảnh từ server/CDN nào (tuân thủ CSP `img-src 'self' ...` hiện có của
 * dự án, không cần whitelist domain mới).
 *
 * Chỉ dùng phía client (gọi `document.createElement('canvas')`) — file này
 * không có "use client" vì không phải React component, chỉ được gọi từ
 * `WorldGlobeScene.tsx` (đã ở trong client boundary).
 */

import * as THREE from "three";
import { buildCoastlineSegments, type CoastlineSegment, type LonLat } from "./world-geo";

export interface WorldTexturePalette {
  ocean: string;
  land: string;
  coastline: string;
  graticule: string;
}

function lonLatToXY(lon: number, lat: number, width: number, height: number): [number, number] {
  return [((lon + 180) / 360) * width, ((90 - lat) / 180) * height];
}

function drawGraticule(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let lon = -180; lon <= 180; lon += 30) {
    const [x] = lonLatToXY(lon, 0, width, height);
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const [, y] = lonLatToXY(0, lat, width, height);
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
}

function tracePath(ctx: CanvasRenderingContext2D, ring: readonly LonLat[], width: number, height: number) {
  ctx.beginPath();
  ring.forEach(([lon, lat], i) => {
    const [x, y] = lonLatToXY(lon, lat, width, height);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
}

export function paintWorldTexture(
  canvas: HTMLCanvasElement,
  palette: WorldTexturePalette,
  segments: CoastlineSegment[] = buildCoastlineSegments(),
) {
  const { width, height } = canvas;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = palette.ocean;
  ctx.fillRect(0, 0, width, height);
  drawGraticule(ctx, width, height, palette.graticule);
  ctx.lineJoin = "round";

  // Pass 1: lục địa (ring ngoài, đã cắt antimeridian).
  ctx.fillStyle = palette.land;
  ctx.strokeStyle = palette.coastline;
  ctx.lineWidth = Math.max(1, width / 1200);
  for (const seg of segments) {
    if (seg.kind !== "land") continue;
    tracePath(ctx, seg.ring, width, height);
    ctx.fill();
    ctx.stroke();
  }

  // Pass 2: hồ lớn (ring lỗ) — tô màu nước đè lên để "khoét" đúng vị trí.
  ctx.fillStyle = palette.ocean;
  ctx.lineWidth = Math.max(0.75, width / 1600);
  for (const seg of segments) {
    if (seg.kind !== "water") continue;
    tracePath(ctx, seg.ring, width, height);
    ctx.fill();
    ctx.stroke();
  }
}

const TEXTURE_SIZE = { width: 2048, height: 1024 };

/** Tạo `THREE.CanvasTexture` đã vẽ sẵn bản đồ thế giới — gọi 1 lần lúc mount. */
export function createWorldTexture(palette: WorldTexturePalette): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_SIZE.width;
  canvas.height = TEXTURE_SIZE.height;
  paintWorldTexture(canvas, palette);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Texture sprite hình tròn mờ dần (radial gradient) — dùng làm hào quang
 * (glow) phía sau marker khi hover/active. Vẽ 1 lần, dùng chung cho mọi
 * marker (chỉ đổi `Sprite.material.color` theo từng điểm).
 */
export function createGlowSpriteTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.35)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
