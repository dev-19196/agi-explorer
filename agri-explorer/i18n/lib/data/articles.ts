import type { Article } from "@/types/content";

/**
 * Nguồn dữ liệu chính: AgriExplorerApi (.NET, MSSQL), bảng `articles` (xem `supabase/schema.sql`).
 * File này sinh lại bằng `npm run content:sync` sau khi nội dung được biên
 * biên tập qua admin script/Swagger của AgriExplorerApi. Hiện vẫn là dữ liệu seed gốc viết tay vì chưa
 * có AgriExplorerApi nào kết nối — sửa trực tiếp ở đây vẫn an toàn cho tới
 * lúc đó, nhưng nhớ `npm run content:seed` lại nếu không muốn mất khi sync.
 */
export const articles: Article[] = [
  // ─────────────────────────────────────────────────────────────────
  // 1. Phân biệt 5 giống sầu riêng
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "phan-biet-5-giong-sau-rieng",
    title: "Cách phân biệt 5 giống sầu riêng phổ biến nhất Việt Nam",
    description:
      "Ri 6, Monthong, Musang King, Chuồng Bò, Dona — mỗi giống có vỏ gai, múi và hương vị khác nhau rõ rệt. Đây là cẩm nang giúp bạn chọn đúng giống ngay từ lần nhìn đầu tiên.",
    category: "canh-tac",
    biome: "tropical",
    readingTimeMin: 7,
    publishedAt: "2025-03-10",
    coverImage:
      "https://images.unsplash.com/photo-1592421618433-7929a1dfdef4?w=1200&auto=format&fit=crop",
    coverCaption: "Sầu riêng Monthong tại vườn Tiền Giang",
    tags: ["sầu riêng", "trái cây", "nhận dạng", "nhiệt đới"],
    relatedSlugs: ["sau-rieng"],
    sections: [
      {
        type: "paragraph",
        content:
          "Sầu riêng (Durio zibethinus) không phải một loài đơn nhất — hàng chục giống thương mại đang cạnh tranh trên thị trường, với giá chênh nhau 2–5 lần. Biết phân biệt giống không chỉ giúp người mua chọn đúng sở thích mà còn giúp nhà vườn định giá và xuất khẩu đúng hướng.",
      },
      {
        type: "heading",
        content: "1. Ri 6 — giống bản địa được yêu thích nhất miền Nam",
      },
      {
        type: "paragraph",
        content:
          "Ri 6 có nguồn gốc từ Cái Mơn (Bến Tre), vỏ mỏng, gai ngắn và thưa. Múi vàng nhạt, cơm ráo, vị ngọt thanh ít béo — phù hợp người không quen mùi sầu riêng nồng. Trọng lượng trung bình 2–3 kg. Mùa chính tháng 5–7.",
      },
      {
        type: "tip",
        content:
          "Mẹo nhận Ri 6: cuống ngắn và thẳng, đáy trái có hình sao 5 cánh rõ ràng, gai đỉnh nhọn nhưng thân gai phẳng.",
      },
      {
        type: "heading",
        content: "2. Monthong — 'ông vua xuất khẩu' gốc Thái",
      },
      {
        type: "paragraph",
        content:
          "Monthong (แมลงทอง — 'vàng rồng') nhập từ Thái Lan, chiếm phần lớn kim ngạch xuất khẩu sầu riêng Việt Nam sang Trung Quốc. Trái to 4–8 kg, vỏ dày, múi vàng đậm, cơm khô cứng hơn, vị ngọt béo nhưng mùi nhẹ hơn các giống bản địa.",
      },
      {
        type: "warning",
        content:
          "Monthong thường bị hái non để vận chuyển — mua cần kiểm tra âm thanh khi gõ nhẹ (tiếng bộp = chín) và mùi thoảng ở cuống.",
      },
      {
        type: "heading",
        content: "3. Musang King — giống cao cấp Malaysia đang 'xâm chiếm'",
      },
      {
        type: "paragraph",
        content:
          "Musang King (Mao Shan Wang — 'Vua Mèo Núi') có múi màu vàng nghệ đậm, vị đắng nhẹ đặc trưng xen kẽ béo ngậy — được giới sành ăn đánh giá cao nhất. Vỏ mỏng hơn Monthong, gai hình ngôi sao dẹt ở đáy trái là dấu hiệu nhận dạng nhanh.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&auto=format&fit=crop",
        caption: "Múi Musang King với màu vàng nghệ đặc trưng",
        credit: "Unsplash",
      },
      {
        type: "heading",
        content: "4. Chuồng Bò (Sữa Hạt Lép) — đặc sản Bình Phước",
      },
      {
        type: "paragraph",
        content:
          "Tên dân gian từ hương vị gợi mùi sữa bò tươi. Hạt lép chiếm trên 80%, múi dày, cơm ướt mềm tan. Gai thưa và cong về phía cuống. Hiếm và khó canh tác — mùa cho trái ngắn (tháng 4–5) nên giá thường cao nhất trong các giống nội địa.",
      },
      {
        type: "tip",
        content:
          "Nếu thấy sầu riêng gai cong về phía cuống trái (như móng cào ngược), nhiều khả năng là Chuồng Bò hoặc biến thể của dòng này.",
      },
      {
        type: "heading",
        content: "5. Dona (Dona 1, Dona 29) — giống lai kháng bệnh",
      },
      {
        type: "paragraph",
        content:
          "Dona là giống lai tạo trong nước, được Viện Cây ăn quả miền Nam chọn lọc để kháng bệnh xì mủ và phù hợp vùng đất thấp. Múi kem ngà, vị ngọt đều, ít xơ. Năng suất ổn định hơn — lựa chọn phổ biến của nông hộ quy mô nhỏ.",
      },
      {
        type: "heading",
        content: "Bảng so sánh nhanh",
      },
      {
        type: "paragraph",
        content:
          "Ri 6: vỏ mỏng, múi vàng nhạt, vị thanh, 2–3 kg, tháng 5–7. | Monthong: vỏ dày, múi vàng đậm, vị béo nhẹ mùi, 4–8 kg, tháng 6–8. | Musang King: vỏ trung, múi vàng nghệ, vị béo + đắng nhẹ, 2–4 kg, quanh năm (nhập). | Chuồng Bò: vỏ mỏng, múi ướt, vị sữa, 1.5–3 kg, tháng 4–5. | Dona: vỏ trung, múi kem ngà, vị ngọt đều, 3–5 kg, tháng 5–7.",
      },
      {
        type: "lifecycle",
        stages: [
          {
            label: "Phân hoá hoa",
            duration: "Tháng 11–1",
            description: "Giai đoạn cây ngừng tăng trưởng, cần hạn chế nước 15–20 ngày để kích hoa.",
          },
          {
            label: "Ra hoa & thụ phấn",
            duration: "Tháng 1–3",
            description: "Hoa nở ban đêm, thụ phấn nhờ dơi và côn trùng. Mưa đêm làm giảm đậu trái.",
          },
          {
            label: "Phát triển trái",
            duration: "Tháng 3–6",
            description: "Trái phát triển 90–120 ngày. Cần bón kali để múi chắc và vị ngọt.",
          },
          {
            label: "Thu hoạch",
            duration: "Tháng 5–8 (tuỳ giống)",
            description: "Trái chín rụng tự nhiên là chất lượng tốt nhất. Xuất khẩu thường hái trước 3–5 ngày.",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 2. Vì sao voi sợ ong?
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "vi-sao-voi-so-ong",
    title: "Vì sao voi sợ ong — và cách khoa học tận dụng điều đó",
    description:
      "Một con voi nặng 4 tấn chạy tán loạn vì bầy ong. Không phải chuyện lạ — đây là sự thật sinh học được các nhà khoa học tận dụng để bảo vệ cả voi lẫn mùa màng.",
    category: "dong-vat",
    biome: "tropical",
    readingTimeMin: 5,
    publishedAt: "2025-04-22",
    coverImage:
      "https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=1200&auto=format&fit=crop",
    coverCaption: "Voi châu Phi tại Kenya",
    tags: ["voi", "ong", "bảo tồn", "xung đột người-voi", "sinh thái"],
    relatedSlugs: ["voi-chau-a"],
    sections: [
      {
        type: "paragraph",
        content:
          "Voi châu Á (Elephas maximus) và châu Phi (Loxodonta africana) đều thể hiện phản ứng sợ hãi rõ rệt khi tiếp xúc với ong — co tai, lắc đầu, phun cát vào vòi và bỏ chạy. Nghiên cứu năm 2007 của tiến sĩ Lucy King (Đại học Oxford) là nghiên cứu hệ thống đầu tiên ghi nhận hiện tượng này.",
      },
      {
        type: "heading",
        content: "Giải phẫu học: da dày nhưng không phải ở mọi nơi",
      },
      {
        type: "paragraph",
        content:
          "Da voi ở lưng và hông dày 2,5–3 cm, nhưng vùng quanh mắt, bên trong tai, miệng và dưới vòi chỉ dày vài mm — rất nhạy cảm với đốt của ong. Ong mật châu Phi (Apis mellifera scutellata) đặc biệt hung hăng và có thể tấn công hàng trăm con cùng lúc, nhắm thẳng vào các vùng mỏng này.",
      },
      {
        type: "tip",
        content:
          "Vòi voi có hơn 40.000 cơ — tinh tế nhất trong vương quốc động vật. Đây là lý do ong đốt vào miệng và vòi đặc biệt gây đau đớn và hoảng loạn.",
      },
      {
        type: "heading",
        content: "Tiếng ong — tín hiệu cảnh báo cấp 1 của voi",
      },
      {
        type: "paragraph",
        content:
          "King và cộng sự phát hiện voi phản ứng với chính âm thanh của bầy ong, dù không thấy chúng. Khi phát tiếng ong qua loa trong 10 giây, 94% đàn voi bắt đầu di chuyển ra xa trong vòng 80 giây. Voi còn phát âm thanh hạ âm (rumble) tần số thấp — được gọi là \"bee rumble\" — để cảnh báo đồng loại.",
      },
      {
        type: "heading",
        content: "Ứng dụng thực tế: hàng rào tổ ong bảo vệ mùa màng",
      },
      {
        type: "paragraph",
        content:
          "Xung đột người–voi là nguyên nhân hàng đầu khiến nông dân Kenya và Ấn Độ thù địch với voi hoang dã. Nhóm của King đã thử nghiệm hàng rào gồm các tổ ong thật treo trên dây thép xung quanh nương rẫy. Kết quả: giảm 80% số lần voi phá mùa, đồng thời tạo thêm thu nhập từ mật ong cho nông hộ.",
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop",
        caption: "Tổ ong trên hàng rào bảo vệ nông trại tại Kenya",
        credit: "Unsplash",
      },
      {
        type: "warning",
        content:
          "Hàng rào tổ ong chỉ hiệu quả với ong còn sống và hoạt động. Tổ bỏ trống hoặc âm thanh giả lặp lại liên tục sẽ khiến voi quen dần và mất tác dụng sau 2–3 tuần.",
      },
      {
        type: "heading",
        content: "Tại sao không chỉ dùng âm thanh giả?",
      },
      {
        type: "paragraph",
        content:
          "Nghiên cứu năm 2019 cho thấy voi có khả năng phân biệt tiếng ong thật và tiếng phát lại sau vài lần tiếp xúc. Voi nhớ vị trí nguy hiểm trong nhiều năm và truyền thông tin cho đàn qua hạ âm. Giải pháp bền vững phải kết hợp tổ ong thật, thực vật xua đuổi (cây ớt, hướng dương) và hành lang di cư phù hợp.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 3. Lúa nước và lịch sử 10.000 năm
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "lua-nuoc-lich-su-10000-nam",
    title: "Lúa nước: 10.000 năm nuôi sống một nửa nhân loại",
    description:
      "Từ đầm lầy Dương Tử đến đồng bằng sông Cửu Long — lúa nước là cây lương thực định hình nền văn minh lớn nhất lịch sử loài người.",
    category: "sinh-thai",
    biome: "wetland",
    readingTimeMin: 8,
    publishedAt: "2025-02-14",
    coverImage:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop",
    coverCaption: "Ruộng lúa bậc thang tại Sa Pa, Việt Nam",
    tags: ["lúa", "lịch sử", "đồng bằng", "canh tác", "văn hoá"],
    relatedSlugs: ["lua"],
    sections: [
      {
        type: "paragraph",
        content:
          "Oryza sativa — cây lúa trồng — xuất hiện trong hồ sơ khảo cổ khoảng 9.000 năm trước tại lưu vực sông Dương Tử (Trung Quốc). Từ đó, nó lan ra toàn châu Á, châu Phi rồi châu Mỹ, trở thành nguồn calo chính của hơn 3,5 tỷ người hôm nay.",
      },
      {
        type: "heading",
        content: "Hai nhánh, hai nền văn minh",
      },
      {
        type: "paragraph",
        content:
          "Lúa trồng chia thành hai nhánh di truyền chính: Japonica (hạt tròn, dẻo — phổ biến ở Nhật, Hàn, miền Bắc Trung Quốc và Bắc Việt Nam) và Indica (hạt dài, rời — phổ biến ở Đông Nam Á và Nam Á). Hai nhánh này đã được thuần hoá độc lập — nghiên cứu DNA cho thấy Japonica xuất hiện trước ở vùng Dương Tử, Indica xuất hiện sau ở vùng Đông Nam Á lục địa.",
      },
      {
        type: "tip",
        content:
          "Cách phân biệt nhanh: nhúng hạt gạo vào nước — Japonica nặng hơn, chìm thẳng; Indica nhẹ hơn, nổi nghiêng. Không chính xác tuyệt đối nhưng đúng trong khoảng 80% trường hợp.",
      },
      {
        type: "heading",
        content: "Ruộng lúa nước — công trình thuỷ lợi vĩ đại nhất tiền công nghiệp",
      },
      {
        type: "paragraph",
        content:
          "Canh tác lúa nước đòi hỏi hệ thống thuỷ lợi phức tạp: kênh dẫn nước, bờ ruộng giữ nước ngập 5–10 cm, và lịch thau chua rửa mặn theo mùa. Ở Việt Nam, hệ thống đê điều đồng bằng sông Hồng có từ thế kỷ 11 — một trong những công trình quản lý nước phức tạp nhất châu Á thời trung cổ.",
      },
      {
        type: "lifecycle",
        stages: [
          {
            label: "Gieo mạ",
            duration: "15–25 ngày",
            description: "Hạt giống ngâm ủ 24–36 giờ, gieo trên mạ bed hoặc gieo thẳng tuỳ giống và mùa vụ.",
          },
          {
            label: "Cấy & đẻ nhánh",
            duration: "25–40 ngày",
            description: "Mạ nhổ, cấy thành hàng cách 20–25 cm. Cây đẻ nhánh tối đa, cần bón đạm và giữ nước 5 cm.",
          },
          {
            label: "Làm đòng & trổ bông",
            duration: "30–35 ngày",
            description: "Giai đoạn quyết định năng suất. Cần ánh sáng đủ, không bị ngập quá sâu, phòng đạo ôn.",
          },
          {
            label: "Chín & thu hoạch",
            duration: "25–30 ngày",
            description: "Bông chuyển vàng từ đỉnh xuống. Thu hoạch khi 85–90% hạt chín để giảm tổn thất.",
          },
        ],
      },
      {
        type: "heading",
        content: "Cách mạng Xanh và bóng tối đi kèm",
      },
      {
        type: "paragraph",
        content:
          "Thập niên 1960–1970, giống IR8 (lúa thần nông) từ Viện Nghiên cứu Lúa Quốc tế (IRRI) tăng năng suất gấp 3 lần, cứu hàng chục triệu người khỏi đói. Nhưng nó cũng kéo theo phụ thuộc vào phân bón hoá học, thuốc trừ sâu và suy giảm đa dạng giống bản địa. Ngày nay, IRRI lưu trữ hơn 140.000 mẫu giống lúa trong ngân hàng gen để bảo tồn đa dạng di truyền.",
      },
      {
        type: "warning",
        content:
          "Biến đổi khí hậu đang đe doạ vùng trồng lúa đồng bằng sông Cửu Long: nước biển dâng + xâm nhập mặn có thể làm mất 40% diện tích canh tác vào 2050 theo kịch bản trung bình của IPCC.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // 4. Cà phê Robusta và hành trình lên đỉnh thế giới
  // ─────────────────────────────────────────────────────────────────
  {
    slug: "ca-phe-robusta-hanh-trinh",
    title: "Robusta Việt Nam: từ 'hạng hai' đến ngôi vương thị trường cà phê thế giới",
    description:
      "Coffea canephora từng bị coi là cà phê cấp thấp hơn Arabica. Nhưng Tây Nguyên Việt Nam đang viết lại câu chuyện đó — bằng nông nghiệp chính xác, rang đặc sản và câu chuyện origin.",
    category: "canh-tac",
    biome: "mountain",
    readingTimeMin: 6,
    publishedAt: "2025-05-05",
    coverImage:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop",
    coverCaption: "Vườn cà phê Robusta tại Đắk Lắk",
    tags: ["cà phê", "Robusta", "Tây Nguyên", "xuất khẩu", "đặc sản"],
    relatedSlugs: ["ca-phe-robusta"],
    sections: [
      {
        type: "paragraph",
        content:
          "Việt Nam là nước xuất khẩu Robusta lớn nhất thế giới — chiếm 40% sản lượng toàn cầu. Nhưng trong nhiều thập kỷ, phần lớn hạt xanh được bán nguyên liệu thô với giá chỉ bằng 60–70% giá Arabica. Làn sóng cà phê thứ ba (Third Wave Coffee) đang thay đổi điều đó.",
      },
      {
        type: "heading",
        content: "Arabica vs Robusta: sự thật về 'đẳng cấp'",
      },
      {
        type: "paragraph",
        content:
          "Arabica (C. arabica) chứa 1–1.5% caffeine, nhiều đường và axit hơn — hương hoa quả phức tạp. Robusta (C. canephora) chứa 2–2.7% caffeine, ít axit, nhiều chlorogenic acid — đắng mạnh, body đậm đặc. Trong espresso blend cao cấp châu Âu, 20–30% Robusta chất lượng cao tạo crema dày hơn và chiều sâu vị mà Arabica thiếu.",
      },
      {
        type: "tip",
        content:
          "Cách phân biệt hạt Arabica và Robusta chưa rang: Arabica hạt oval, rãnh giữa hình chữ S cong; Robusta hạt tròn nhỏ hơn, rãnh thẳng. Sau khi rang — Arabica thường có bề mặt hơi sần, Robusta trơn bóng hơn.",
      },
      {
        type: "heading",
        content: "Terroir Tây Nguyên — lý do Robusta Việt Nam khác biệt",
      },
      {
        type: "paragraph",
        content:
          "Đắk Lắk (độ cao 500–800 m), Lâm Đồng (800–1200 m) và Gia Lai có sự kết hợp đất bazan giàu khoáng, biên độ nhiệt ngày–đêm 10–15°C và mùa khô rõ rệt — tạo điều kiện lý tưởng để Robusta tích tụ đường và giảm tỷ lệ hạt lỗi. Đây là điều mà vùng Robusta Congo hay Uganda khó tái tạo.",
      },
      {
        type: "lifecycle",
        stages: [
          {
            label: "Trồng và kiến thiết vườn",
            duration: "Năm 1–3",
            description: "Cây con ghép giống chịu hạn, trồng dưới tán cây che bóng (mắc ca, muồng đen). Chưa cho thu hoạch.",
          },
          {
            label: "Bói quả",
            duration: "Năm 3–4",
            description: "Thu hoạch nhỏ 1–2 kg/cây. Giai đoạn quan trọng để định hình cấu trúc cành cho năm sau.",
          },
          {
            label: "Kinh doanh ổn định",
            duration: "Năm 5–25",
            description: "Năng suất 3–5 kg quả tươi/cây/năm (khoảng 0.6–1 kg nhân khô). Tưới nhỏ giọt + bón hữu cơ tăng chất lượng.",
          },
          {
            label: "Tái canh",
            duration: "Năm 25–30",
            description: "Vườn già, năng suất giảm. Chặt phục hồi hoặc ghép cải tạo bằng giống mới kháng bệnh gỉ sắt.",
          },
        ],
      },
      {
        type: "heading",
        content: "Specialty Robusta — hướng đi mới",
      },
      {
        type: "paragraph",
        content:
          "Từ 2020, một số nông hộ Đắk Lắk bắt đầu hái chọn (hand-pick cherry đỏ), chế biến mật (honey process) hoặc lên men tự nhiên (natural process) — đạt điểm cupping 80–84/100 theo thang SCA, đủ chuẩn 'specialty'. Giá bán tăng 3–5 lần so với Robusta thông thường.",
      },
      {
        type: "warning",
        content:
          "Lên men quá 72 giờ trong điều kiện nhiệt độ cao (>35°C) tạo vị dấm hoặc vị thối không thể khắc phục sau khi rang. Cần kiểm soát nhiệt độ và pH trong suốt quá trình.",
      },
    ],
  },
];

