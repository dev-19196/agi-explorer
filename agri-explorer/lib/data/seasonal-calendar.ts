import type { SeasonalEvent, WeatherAlert } from "@/types/content";

/**
 * Nguồn dữ liệu chính: Supabase, bảng `seasonal_events` + `weather_alerts`
 * (xem `supabase/schema.sql`). File này sinh lại bằng `npm run content:sync`
 * sau khi nội dung được biên tập trong Supabase Studio. Hiện vẫn là dữ liệu
 * seed gốc viết tay vì chưa có project Supabase nào kết nối.
 *
 * Lịch mùa vụ mock cho 8 cây trồng đã có trong lib/data/plants.ts.
 * Với cây không có nguồn gốc Việt Nam (nhân sâm, xương rồng), dữ liệu phản
 * ánh các vùng đã có canh tác thử nghiệm/thích nghi thực tế, ghi chú rõ
 * trong trường `note`. Vùng nào không phù hợp khí hậu thì bỏ qua, không
 * cố nhồi đủ 3 vùng cho mọi cây.
 *
 * `plantingMonths` / `harvestMonths` dùng MonthRange (1–12), có thể "vòng"
 * qua năm mới (ví dụ start=11, end=2).
 */
export const seasonalEvents: SeasonalEvent[] = [
  // ─── Lúa (lua) — plains ──────────────────────────────────────────────────
  {
    id: "lua-bac-dong-xuan",
    plantSlug: "lua",
    region: "bac",
    plantingMonths: { start: 1, end: 2 },
    harvestMonths: { start: 5, end: 6 },
    note: "Vụ Xuân chính — gieo mạ đầu tháng 1, cấy khi qua rét đậm, thu hoạch trước mùa mưa bão.",
  },
  {
    id: "lua-bac-mua",
    plantSlug: "lua",
    region: "bac",
    plantingMonths: { start: 6, end: 7 },
    harvestMonths: { start: 9, end: 10 },
    note: "Vụ Mùa — gieo cấy ngay sau khi thu Xuân, tránh để lúa trổ trúng đợt bão tháng 8–9.",
  },
  {
    id: "lua-trung-dong-xuan",
    plantSlug: "lua",
    region: "trung",
    plantingMonths: { start: 12, end: 1 },
    harvestMonths: { start: 4, end: 5 },
    note: "Gieo sớm hơn miền Bắc để thu hoạch trước cao điểm nắng hạn tháng 6–7.",
  },
  {
    id: "lua-nam-dong-xuan",
    plantSlug: "lua",
    region: "nam",
    plantingMonths: { start: 11, end: 12 },
    harvestMonths: { start: 2, end: 3 },
    note: "Vụ Đông Xuân ĐBSCL — vụ năng suất cao nhất năm nhờ nước ngọt dồi dào sau mùa lũ.",
  },
  {
    id: "lua-nam-he-thu",
    plantSlug: "lua",
    region: "nam",
    plantingMonths: { start: 4, end: 5 },
    harvestMonths: { start: 7, end: 8 },
    note: "Vụ Hè Thu — xuống giống ngay sau khi đất nghỉ, cần chủ động bơm tiêu nước đầu vụ mưa.",
  },

  // ─── Cà phê Robusta (ca-phe-robusta) — tropical ─────────────────────────
  {
    id: "ca-phe-trung-vu",
    plantSlug: "ca-phe-robusta",
    region: "trung",
    plantingMonths: { start: 5, end: 6 },
    harvestMonths: { start: 10, end: 12 },
    note: "Tây Nguyên — trồng mới/dặm đầu mùa mưa; thu hoạch rộ tháng 11, kết thúc trước Tết.",
  },
  {
    id: "ca-phe-nam-vu",
    plantSlug: "ca-phe-robusta",
    region: "nam",
    plantingMonths: { start: 5, end: 6 },
    harvestMonths: { start: 11, end: 12 },
    note: "Diện tích nhỏ ở Đông Nam Bộ (Bình Phước, Đồng Nai), lịch vụ gần giống Tây Nguyên.",
  },

  // ─── Sầu riêng (sau-rieng) — tropical ────────────────────────────────────
  {
    id: "sau-rieng-nam-vu",
    plantSlug: "sau-rieng",
    region: "nam",
    plantingMonths: { start: 1, end: 2 },
    harvestMonths: { start: 5, end: 8 },
    note: "ĐBSCL — xử lý ra hoa cuối mùa khô (tháng 12–1), thu hoạch kéo dài 4 tháng nhờ rải vụ.",
  },
  {
    id: "sau-rieng-trung-vu",
    plantSlug: "sau-rieng",
    region: "trung",
    plantingMonths: { start: 2, end: 3 },
    harvestMonths: { start: 7, end: 9 },
    note: "Tây Nguyên (Đắk Lắk) — vụ muộn hơn ĐBSCL khoảng 1–2 tháng do nền nhiệt thấp hơn.",
  },

  // ─── Nhân sâm (nhan-sam) — mountain ──────────────────────────────────────
  {
    id: "nhan-sam-bac-vu",
    plantSlug: "nhan-sam",
    region: "bac",
    plantingMonths: { start: 9, end: 10 },
    harvestMonths: { start: 10, end: 11 },
    note: "Thử nghiệm tại Sa Pa, Bắc Hà — gieo hạt cuối thu, thu hoạch rễ sau 4–6 năm trồng cùng tháng.",
  },
  {
    id: "nhan-sam-trung-vu",
    plantSlug: "nhan-sam",
    region: "trung",
    plantingMonths: { start: 10, end: 11 },
    harvestMonths: { start: 11, end: 12 },
    note: "Mô hình nhà lưới khí hậu lạnh tại Đà Lạt — chi phí cao, sản lượng còn rất hạn chế.",
  },

  // ─── Xương rồng tai voi (xuong-rong-tai) — desert ──────────────────────
  {
    id: "xuong-rong-trung-vu",
    plantSlug: "xuong-rong-tai",
    region: "trung",
    plantingMonths: { start: 3, end: 4 },
    harvestMonths: { start: 8, end: 10 },
    note: "Ninh Thuận — vùng khô hạn nhất Việt Nam, trồng làm thức ăn gia súc và rau (nồng).",
  },
  {
    id: "xuong-rong-nam-vu",
    plantSlug: "xuong-rong-tai",
    region: "nam",
    plantingMonths: { start: 2, end: 3 },
    harvestMonths: { start: 6, end: 9 },
    note: "Trồng chậu/cảnh quy mô nhỏ — không phải vùng canh tác thương mại chính.",
  },

  // ─── Sen (sen) — wetland ──────────────────────────────────────────────────
  {
    id: "sen-bac-vu",
    plantSlug: "sen",
    region: "bac",
    plantingMonths: { start: 2, end: 3 },
    harvestMonths: { start: 6, end: 8 },
    note: "Hồ Tây, Hà Nội — trồng đầu xuân, hoa nở rộ và thu hạt/củ chính vào hè.",
  },
  {
    id: "sen-trung-vu",
    plantSlug: "sen",
    region: "trung",
    plantingMonths: { start: 1, end: 2 },
    harvestMonths: { start: 5, end: 7 },
    note: "Hồ sen Tịnh Tâm và vùng đầm phá Huế — thu hoạch sớm hơn miền Bắc nhờ nắng ấm hơn.",
  },
  {
    id: "sen-nam-vu",
    plantSlug: "sen",
    region: "nam",
    plantingMonths: { start: 11, end: 12 },
    harvestMonths: { start: 3, end: 5 },
    note: "Đồng Tháp Mười — trồng ngay sau mùa lũ rút, tận dụng đất phù sa giàu dinh dưỡng.",
  },

  // ─── Ngô (ngo) — plains ───────────────────────────────────────────────────
  {
    id: "ngo-bac-vu",
    plantSlug: "ngo",
    region: "bac",
    plantingMonths: { start: 2, end: 3 },
    harvestMonths: { start: 5, end: 6 },
    note: "Vụ Xuân trên đất bãi ven sông — xen canh phổ biến trước vụ lúa Mùa.",
  },
  {
    id: "ngo-trung-vu",
    plantSlug: "ngo",
    region: "trung",
    plantingMonths: { start: 12, end: 1 },
    harvestMonths: { start: 4, end: 5 },
    note: "Tránh gieo trùng mùa mưa bão; thu hoạch trước cao điểm nắng hạn miền Trung.",
  },
  {
    id: "ngo-nam-vu",
    plantSlug: "ngo",
    region: "nam",
    plantingMonths: { start: 6, end: 7 },
    harvestMonths: { start: 9, end: 10 },
    note: "Tây Nguyên & Đông Nam Bộ — gieo đầu mùa mưa, làm thức ăn chăn nuôi là chính.",
  },

  // ─── Trà Shan Tuyết (tra-shan-tuyet) — mountain ────────────────────────
  {
    id: "tra-bac-vu",
    plantSlug: "tra-shan-tuyet",
    region: "bac",
    plantingMonths: { start: 2, end: 3 },
    harvestMonths: { start: 3, end: 10 },
    note: "Hà Giang, Yên Bái, Sơn La — cây cổ thụ thu hái búp quanh 7 tháng, rộ nhất tháng 3–5.",
  },
  {
    id: "tra-trung-vu",
    plantSlug: "tra-shan-tuyet",
    region: "trung",
    plantingMonths: { start: 3, end: 4 },
    harvestMonths: { start: 4, end: 9 },
    note: "Diện tích nhỏ ở vùng núi Nghệ An, Hà Tĩnh — khí hậu tương tự Tây Bắc nhưng ít cổ thụ.",
  },
  {
    id: "tra-nam-vu",
    plantSlug: "tra-shan-tuyet",
    region: "nam",
    plantingMonths: { start: 3, end: 4 },
    harvestMonths: { start: 4, end: 11 },
    note: "Cao nguyên Lâm Đồng — phổ biến hơn là trà Olong/Atiso; Shan Tuyết chỉ trồng thử nghiệm.",
  },
];

/**
 * Mock cảnh báo thời tiết/mùa theo biome + vùng — skeleton tĩnh, sau này
 * thay bằng dữ liệu thật từ API khí tượng (ví dụ NCHMF).
 */
export const weatherAlerts: WeatherAlert[] = [
  {
    id: "bao-bac-trung",
    biome: "plains",
    region: "bac",
    months: [7, 8, 9],
    level: "warning",
    title: "Cao điểm bão, áp thấp nhiệt đới",
    description:
      "Tháng 7–9 là giai đoạn bão đổ bộ nhiều nhất ở Bắc Bộ — cần thu hoạch sớm lúa Mùa nếu dự báo bão gần bờ.",
  },
  {
    id: "ret-dam-bac",
    biome: "mountain",
    region: "bac",
    months: [12, 1, 2],
    level: "caution",
    title: "Rét đậm, rét hại vùng núi",
    description:
      "Sương muối và rét hại có thể xảy ra ở vùng núi cao Tây Bắc — cây non cần che chắn, hạn chế xuống giống mới.",
  },
  {
    id: "bao-lu-trung",
    biome: "wetland",
    region: "trung",
    months: [9, 10, 11],
    level: "warning",
    title: "Mùa mưa lũ miền Trung",
    description:
      "Lũ lụt tập trung tháng 9–11 do bão và áp thấp dồn về — tránh xuống giống cây ngắn ngày trong giai đoạn này.",
  },
  {
    id: "nang-han-trung",
    biome: "desert",
    region: "trung",
    months: [5, 6, 7],
    level: "warning",
    title: "Nắng hạn gay gắt Nam Trung Bộ",
    description:
      "Ninh Thuận, Bình Thuận thường thiếu nước nghiêm trọng tháng 5–7 — ưu tiên cây chịu hạn, tưới tiết kiệm.",
  },
  {
    id: "han-man-nam",
    biome: "wetland",
    region: "nam",
    months: [3, 4],
    level: "warning",
    title: "Xâm nhập mặn ĐBSCL",
    description:
      "Nước mặn lấn sâu vào kênh rạch tháng 3–4 trong mùa khô — cần đo độ mặn trước khi lấy nước tưới cho sen, lúa.",
  },
  {
    id: "mua-lu-nam",
    biome: "plains",
    region: "nam",
    months: [9, 10],
    level: "info",
    title: "Mùa lũ (nước nổi) ĐBSCL",
    description:
      "Lũ về mang theo phù sa bồi đắp đồng ruộng — thời điểm lý tưởng để chuẩn bị đất cho vụ Đông Xuân sắp tới.",
  },
  {
    id: "suong-mu-trung",
    biome: "tropical",
    region: "trung",
    months: [11, 12, 1],
    level: "info",
    title: "Sương mù, ẩm độ cao Tây Nguyên",
    description:
      "Độ ẩm cao kéo dài dễ phát sinh nấm bệnh trên cà phê, sầu riêng — cần phun phòng nấm sau mùa thu hoạch.",
  },
];

