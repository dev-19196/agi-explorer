/** Toạ độ trung tâm xấp xỉ của các quốc gia xuất hiện trong dữ liệu loài. */
export const COUNTRY_COORDS: Record<string, { lat: number; lon: number }> = {
  "Việt Nam": { lat: 16.0, lon: 107.8 },
  "Hàn Quốc": { lat: 36.5, lon: 127.8 },
  Mexico: { lat: 23.6, lon: -102.5 },
  "Tây Tạng": { lat: 31.7, lon: 88.0 },
  "Ả Rập Saudi": { lat: 23.9, lon: 45.1 },
  Brazil: { lat: -10.3, lon: -53.2 },
  Indonesia: { lat: -2.5, lon: 118.0 },
  Malaysia: { lat: 4.2, lon: 101.9 },
  "Thái Lan": { lat: 15.9, lon: 100.9 },
  "Sri Lanka": { lat: 7.9, lon: 80.8 },
  "Ấn Độ": { lat: 20.6, lon: 79.0 },
};

/** Chiếu equirectangular: lon/lat -> phần trăm (x%, y%) trong khung 0-100. */
export function projectToPercent(lat: number, lon: number) {
  return {
    xPct: ((lon + 180) / 360) * 100,
    yPct: ((90 - lat) / 180) * 100,
  };
}
