import type { Plant } from "@/types/content";

/**
 * Nguồn dữ liệu chính: AgriExplorerApi (.NET, MSSQL), bảng `plants` (xem `supabase/schema.sql`).
 * File này sinh lại bằng `npm run content:sync` sau khi nội dung được biên
 * biên tập qua admin script/Swagger của AgriExplorerApi. Hiện vẫn là dữ liệu seed gốc viết tay vì chưa
 * có AgriExplorerApi nào kết nối — sửa trực tiếp ở đây vẫn an toàn cho tới
 * lúc đó, nhớ `npm run content:seed` lại nếu không muốn mất khi sync.
 */
export const plants: Plant[] = [
  {
    slug: "lua",
    name: "Lúa",
    scientificName: "Oryza sativa",
    category: "vegetable",
    biome: "plains",
    country: "Việt Nam",
    tagline: "Cây lương thực nuôi sống hơn nửa dân số châu Á.",
  },
  {
    slug: "ca-phe-robusta",
    name: "Cà phê Robusta",
    scientificName: "Coffea canephora",
    category: "industrial",
    biome: "tropical",
    country: "Việt Nam",
    tagline: "Hạt cà phê chiếm sản lượng xuất khẩu hàng đầu Tây Nguyên.",
  },
  {
    slug: "sau-rieng",
    name: "Sầu riêng",
    scientificName: "Durio zibethinus",
    category: "fruit",
    biome: "tropical",
    country: "Việt Nam",
    tagline: "\"Vua trái cây\" với lớp vỏ gai và mùi hương gây tranh cãi.",
    detail: {
      overview:
        "Sầu riêng là loài cây ăn quả thân gỗ lớn thuộc họ Cẩm quỳ (Malvaceae), bản địa vùng Đông Nam Á và được xem là \"vua của các loại trái cây\" nhờ kích thước, hương vị béo ngậy và lớp vỏ gai đặc trưng. Quả chín tự rụng khỏi cây, vỏ ngoài cứng phủ đầy gai nhọn, bên trong chia thành 5 múi chứa các múi cơm vàng kem bao quanh hạt. Mùi hương mạnh của sầu riêng — pha trộn giữa lưu huỳnh, hành và mật ngọt — là điều khiến nó bị cấm mang vào nhiều phương tiện công cộng ở Đông Nam Á, nhưng cũng chính là dấu hiệu nhận biết độ chín hoàn hảo đối với người sành ăn. Tại Việt Nam, sầu riêng là cây trồng chủ lực ở Tây Nguyên, Đông Nam Bộ và Đồng bằng sông Cửu Long, mang lại giá trị xuất khẩu hàng tỷ USD mỗi năm, đặc biệt sang thị trường Trung Quốc.",
      classification: {
        kingdom: "Plantae (Thực vật)",
        family: "Malvaceae (Cẩm quỳ)",
        genus: "Durio",
        order: "Malvales (Bông)",
      },
      characteristics: [
        "Cây gỗ lớn, cao 25–50m khi mọc tự nhiên trong rừng, thường được tạo hình thấp hơn (8–15m) khi canh tác để dễ thu hoạch.",
        "Lá đơn, mọc cách, hình elip, mặt trên xanh đậm bóng, mặt dưới có lớp vảy màu đồng/bạc đặc trưng.",
        "Hoa lớn màu trắng kem, mọc thành chùm trực tiếp trên thân và cành lớn (hiện tượng \"hoa thân\"), nở về đêm và thụ phấn chủ yếu nhờ dơi.",
        "Quả hình trái xoan đến tròn, nặng 1–5kg, vỏ ngoài cứng phủ gai hình chóp nhọn, chia 5 múi (carpel).",
        "Cơm quả (thịt) màu vàng kem đến vàng đậm tuỳ giống, kết cấu béo mịn như kem, mỗi múi chứa 1–6 hạt lớn.",
      ],
      habitat: {
        climate: "Nhiệt đới ẩm, lượng mưa 1.500–2.500mm/năm, độ ẩm không khí 75–80%, không chịu được sương giá.",
        terrain: "Đất phù sa hoặc đất đỏ bazan tơi xốp, thoát nước tốt, tầng canh tác sâu trên 1m, độ pH 5,5–6,5.",
        distribution:
          "Bản địa Borneo và Sumatra (Indonesia, Malaysia); hiện được trồng rộng khắp Đông Nam Á — Việt Nam (Tây Nguyên, Tiền Giang, Bến Tre, Đắk Lắk), Thái Lan, Philippines.",
        temperatureRange: "24–32°C, sinh trưởng tối ưu quanh 27°C, ngừng phát triển dưới 15°C.",
      },
      care: {
        watering:
          "Cần tưới đều trong giai đoạn cây non và ra hoa-đậu quả; giảm tưới 4–6 tuần trước thu hoạch để tăng độ ngọt, tránh úng vì rễ rất nhạy với ngập nước.",
        light: "Ưa sáng hoàn toàn khi trưởng thành; cây con cần che bóng 30–50% trong 1–2 năm đầu.",
        soil: "Đất tơi xốp, giàu mùn, thoát nước nhanh; lên mô/líp cao ở vùng đất thấp để tránh ngập rễ.",
        fertilizing:
          "Bón phân hữu cơ hoai mục kết hợp NPK theo từng giai đoạn: thúc đọt sau thu hoạch, thúc hoa trước khi ra hoa, và bổ sung Kali-Canxi giai đoạn nuôi quả để hạn chế sượng cơm.",
        pests:
          "Sâu đục thân, rầy phấn trắng, bệnh nứt thân xì mủ (do nấm Phytophthora) và bệnh thán thư trên lá là các vấn đề phổ biến nhất, cần thoát nước tốt và phun phòng định kỳ.",
      },
      growthStages: [
        { label: "Hạt giống / cây ghép", duration: "0–2 năm", description: "Trồng bằng cây ghép để giữ đặc tính giống và rút ngắn thời gian cho quả so với gieo hạt." },
        { label: "Cây tơ", duration: "2–5 năm", description: "Cây phát triển khung thân, cành; cần che bóng giai đoạn đầu và tạo hình để có bộ khung khỏe." },
        { label: "Ra hoa lần đầu", duration: "Năm 4–6", description: "Hoa mọc trên thân và cành lớn, nở đêm, thụ phấn chủ yếu nhờ dơi ăn mật và một số loài côn trùng." },
        { label: "Đậu quả – phát triển quả", duration: "90–120 ngày sau đậu", description: "Quả lớn dần qua các tuần, cần cung cấp đủ Kali-Canxi để cơm không bị sượng hoặc cháy múi." },
        { label: "Quả chín – thu hoạch", duration: "Tự rụng khi chín", description: "Quả chín tự tách nhẹ ở đáy và rụng khỏi cây; nông dân thường hứng bằng lưới hoặc thu khi vừa chín tới để vận chuyển xa." },
      ],
      funFacts: [
        "Một cây sầu riêng trưởng thành có thể cho hơn 100–200 quả mỗi mùa, mỗi quả nặng trung bình 2–4kg.",
        "Sầu riêng bị cấm mang vào nhiều khách sạn, tàu điện và máy bay ở Singapore, Thái Lan do mùi hương đậm và lan rất xa.",
        "Giống Musang King (Malaysia) và Ri6, Dona (Việt Nam) là những giống được ưa chuộng nhất hiện nay nhờ cơm dày, hạt lép, vị béo ngọt cân bằng.",
        "Hoa sầu riêng chỉ nở và toả mùi mạnh vào ban đêm để thu hút dơi ăn mật — loài thụ phấn chính của cây trong tự nhiên.",
      ],
      uses: [
        "Ăn tươi trực tiếp khi quả vừa chín, là cách phổ biến và được ưa chuộng nhất.",
        "Chế biến thành kem, bánh, chè, xôi, kẹo và các món tráng miệng mang hương vị đặc trưng.",
        "Sầu riêng đông lạnh nguyên múi hoặc cấp đông nguyên trái phục vụ xuất khẩu đường dài sang Trung Quốc, Mỹ, châu Âu.",
        "Hạt sầu riêng có thể luộc hoặc rang ăn như một loại hạt bổ sung tinh bột ở một số vùng.",
      ],
      distribution: [
        { label: "Việt Nam (Tây Nguyên, ĐBSCL)", lat: 16.0, lon: 107.8 },
        { label: "Indonesia (Borneo, Sumatra — quê hương gốc)", lat: -2.5, lon: 118.0 },
        { label: "Malaysia", lat: 4.2, lon: 101.9 },
        { label: "Thái Lan", lat: 15.9, lon: 100.9 },
      ],
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1506212928588-93568581fb14?q=80&w=1600&auto=format&fit=crop",
          kind: "image",
          caption: "Quả sầu riêng chín tách múi, lộ rõ cơm vàng béo ngậy bên trong.",
          credit: "Gliezl Bancal / Unsplash",
        },
        {
          url: "https://images.unsplash.com/photo-1780887333912-72313aa0b6c3?q=80&w=1600&auto=format&fit=crop",
          kind: "image",
          caption: "Lớp vỏ gai nhọn đặc trưng — \"áo giáp\" bảo vệ quả sầu riêng.",
          credit: "Jonny Clow / Unsplash",
        },
        {
          url: "https://images.unsplash.com/photo-1705915892545-e3403b80c34a?q=80&w=1600&auto=format&fit=crop",
          kind: "image",
          caption: "Những quả sầu riêng vừa thu hoạch, chờ phân loại tại vườn.",
          credit: "Markus Winkler / Unsplash",
        },
        {
          url: "v_5kwTTmiEg",
          kind: "youtube",
          caption: "Vì sao sầu riêng được mệnh danh \"vua của các loại trái cây\"?",
        },
      ],
    },
  },
  {
    slug: "nhan-sam",
    name: "Nhân sâm",
    scientificName: "Panax ginseng",
    category: "herbal",
    biome: "mountain",
    country: "Hàn Quốc",
    tagline: "Dược liệu quý mọc chậm trên sườn núi lạnh.",
  },
  {
    slug: "xuong-rong-tai",
    name: "Xương rồng tai voi",
    scientificName: "Opuntia ficus-indica",
    category: "industrial",
    biome: "desert",
    country: "Mexico",
    tagline: "Tích nước trong thân để sống sót qua hạn hán kéo dài.",
  },
  {
    slug: "sen",
    name: "Sen",
    scientificName: "Nelumbo nucifera",
    category: "vegetable",
    biome: "wetland",
    country: "Việt Nam",
    tagline: "Mọc giữa bùn lầy nhưng cho hoa thanh khiết bậc nhất.",
  },
  {
    slug: "ngo",
    name: "Ngô",
    scientificName: "Zea mays",
    category: "vegetable",
    biome: "plains",
    country: "Mexico",
    tagline: "Cây lương thực có sản lượng toàn cầu lớn nhất.",
  },
  {
    slug: "tra-shan-tuyet",
    name: "Trà Shan Tuyết",
    scientificName: "Camellia sinensis var. assamica",
    category: "industrial",
    biome: "mountain",
    country: "Việt Nam",
    tagline: "Cây trà cổ thụ trăm năm tuổi trên núi cao Tây Bắc.",
  },
];
