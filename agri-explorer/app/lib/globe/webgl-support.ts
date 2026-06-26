/**
 * lib/globe/webgl-support.ts
 *
 * Kiểm tra nhanh trình duyệt có hỗ trợ WebGL không — dùng để quyết định
 * hiển thị quả địa cầu 3D (`WorldGlobeScene`) hay lùi về bản đồ 2D
 * (`WorldMap`). Chỉ là bước kiểm tra SƠ BỘ, nhẹ (không tải Three.js); nếu
 * việc khởi tạo `WebGLRenderer` thật sự vẫn lỗi sau đó, `WorldGlobeScene`
 * tự gọi callback `onUnsupported` để lùi về 2D — xem `WorldGlobe.tsx`.
 */
export function supportsWebGL(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}
