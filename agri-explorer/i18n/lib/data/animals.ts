import type { Animal } from "@/types/content";

/**
 * Nguồn dữ liệu chính: AgriExplorerApi (.NET, MSSQL), bảng `animals` (xem `supabase/schema.sql`).
 * File này sinh lại bằng `npm run content:sync`. Xem chú thích đầy đủ ở
 * đầu `lib/data/plants.ts`.
 */
export const animals: Animal[] = [
  {
    slug: "voi-chau-a",
    name: "Voi châu Á",
    scientificName: "Elephas maximus",
    biome: "tropical",
    country: "Việt Nam",
    tagline: "Loài thú đất liền lớn nhất Đông Nam Á, sống theo bầy đàn mẫu hệ.",
    detail: {
      overview:
        "Voi châu Á là loài thú có vú trên đất liền lớn nhất ở châu Á, phân bố từ Ấn Độ, Sri Lanka, Đông Nam Á đến đảo Borneo và Sumatra. Khác với voi châu Phi, voi châu Á có tai nhỏ hơn, lưng cong và chỉ voi đực mới có ngà phát triển rõ (một số con đực và phần lớn con cái không có ngà hoặc ngà rất nhỏ gọi là \"tush\"). Chúng sống theo đàn mẫu hệ do một con voi cái lớn tuổi và giàu kinh nghiệm — gọi là \"voi đầu đàn\" — dẫn dắt, trong khi voi đực trưởng thành thường sống đơn độc hoặc theo nhóm nhỏ tách biệt khỏi đàn cái. Tại Việt Nam, voi châu Á được xem là loài cực kỳ nguy cấp với số lượng còn lại rất ít, tập trung chủ yếu ở Đắk Lắk (Vườn quốc gia Yok Đôn) và một số khu vực Đồng Nai, Nghệ An. Voi gắn bó lâu đời với đời sống văn hoá và nông nghiệp của nhiều dân tộc Tây Nguyên, từng được thuần hoá để kéo gỗ, vận chuyển và lễ hội.",
      classification: {
        kingdom: "Animalia (Động vật)",
        family: "Elephantidae (Voi)",
        genus: "Elephas",
        order: "Proboscidea (Vòi)",
      },
      characteristics: [
        "Chiều cao vai 2–3,5m, cân nặng 2.700–5.000kg tuỳ giới tính và độ tuổi; voi đực thường lớn hơn voi cái rõ rệt.",
        "Tai nhỏ hơn voi châu Phi, hình bầu dục, dùng để toả nhiệt và biểu đạt cảm xúc.",
        "Vòi là cơ quan đa năng gồm hơn 40.000 bó cơ, dùng để hít thở, ăn uống, giao tiếp, tắm bụi và thể hiện tình cảm trong đàn.",
        "Ngà chỉ phát triển rõ ở phần lớn voi đực; nhiều voi cái và một số voi đực không có ngà hoặc chỉ có \"tush\" (ngà cộc) rất ngắn.",
        "Da dày 2–3cm, màu xám đến nâu xám, có lớp lông thưa cứng, dễ bị cháy nắng nên thường tắm bùn để bảo vệ da.",
      ],
      habitat: {
        climate: "Nhiệt đới và cận nhiệt đới ẩm, chịu được biến động nhiệt độ theo mùa khô-mưa rõ rệt.",
        terrain: "Rừng thưa, rừng khô rụng lá, savan cây gỗ và vùng đệm gần sông suối; cần diện tích sinh sống rất lớn (hàng trăm km² mỗi đàn).",
        distribution: "Ấn Độ, Sri Lanka, Nepal, Đông Nam Á lục địa (Việt Nam, Lào, Thái Lan, Myanmar, Campuchia) và các đảo Sumatra, Borneo.",
        temperatureRange: "18–34°C; voi điều nhiệt chủ yếu qua tai và việc tắm nước/bùn thường xuyên.",
      },
      behavior: {
        diet:
          "Ăn cỏ là chủ yếu (động vật ăn cỏ - herbivore), tiêu thụ 150–300kg thực vật mỗi ngày gồm cỏ, vỏ cây, rễ, lá non và quả; cần uống 80–200 lít nước/ngày.",
        socialStructure:
          "Sống theo đàn mẫu hệ 6–20 cá thể do voi cái đầu đàn lớn tuổi dẫn dắt; voi đực trưởng thành (15–20 tuổi) tách đàn, sống đơn độc hoặc theo nhóm nhỏ \"voi đực\" tạm thời.",
        activityPattern:
          "Hoạt động cả ngày và đêm nhưng tránh nắng gắt giữa trưa; thường di chuyển và ăn vào sáng sớm, chiều muộn và ban đêm, nghỉ ngơi giữa ngày trong bóng cây.",
        reproduction:
          "Thời gian mang thai dài nhất trong các loài thú trên đất liền — khoảng 18–22 tháng; voi con bú mẹ đến 2–4 tuổi và được cả đàn cùng chăm sóc, bảo vệ.",
        lifespan: "Tuổi thọ trung bình 60–70 năm trong tự nhiên, một số cá thể sống đến 80 năm.",
      },
      lifeStages: [
        { label: "Voi con sơ sinh", duration: "0–2 tuổi", description: "Nặng khoảng 90–120kg lúc sinh, bú mẹ hoàn toàn những tháng đầu, luôn đi cạnh mẹ và được cả đàn bảo vệ." },
        { label: "Voi non", duration: "2–10 tuổi", description: "Bắt đầu ăn thực vật bên cạnh sữa mẹ, học các kỹ năng xã hội và sinh tồn từ đàn, đặc biệt từ voi cái đầu đàn." },
        { label: "Voi vị thành niên", duration: "10–17 tuổi", description: "Voi đực bắt đầu tách dần khỏi đàn mẫu hệ; voi cái ở lại đàn gốc suốt đời." },
        { label: "Trưởng thành sinh sản", duration: "17 tuổi trở lên", description: "Voi cái có thể sinh sản; voi đực trải qua giai đoạn \"musth\" (động dục) theo chu kỳ, tranh giành quyền giao phối." },
        { label: "Voi lớn tuổi", duration: "Trên 50 tuổi", description: "Voi cái lớn tuổi thường trở thành đầu đàn nhờ kinh nghiệm và trí nhớ về nguồn nước, thức ăn theo mùa." },
      ],
      funFacts: [
        "Voi châu Á có thể nhận diện được hơn 100 cá thể khác qua âm thanh hạ âm (infrasound) mà tai người không nghe được, truyền đi xa hàng km.",
        "Vòi voi có thể nhặt một vật nhỏ như hạt đậu nhưng cũng đủ khoẻ để bẻ gãy cả cành cây lớn.",
        "Voi là một trong rất ít loài động vật được ghi nhận có hành vi \"đau buồn\" — đứng cạnh xác đồng loại, chạm vòi vào thi thể trong thời gian dài.",
        "Tại Việt Nam, số lượng voi hoang dã hiện chỉ còn khoảng 100–130 cá thể, khiến loài này nằm trong nhóm cực kỳ nguy cấp cần bảo tồn khẩn cấp.",
      ],
      conservationStatus:
        "Nguy cấp (Endangered – IUCN Red List). Quần thể suy giảm nghiêm trọng do mất rừng, xung đột với hoạt động nông nghiệp và săn trộm ngà. Việt Nam đã thành lập các trung tâm bảo tồn voi tại Đắk Lắk để bảo vệ những cá thể còn lại.",
      distribution: [
        { label: "Việt Nam (Đắk Lắk, Đồng Nai, Nghệ An)", lat: 16.0, lon: 107.8 },
        { label: "Sri Lanka", lat: 7.9, lon: 80.8 },
        { label: "Ấn Độ", lat: 20.6, lon: 79.0 },
        { label: "Thái Lan", lat: 15.9, lon: 100.9 },
        { label: "Indonesia (Sumatra)", lat: -0.5, lon: 101.3 },
      ],
      humanConnection: [
        "Tại Tây Nguyên, voi gắn liền với văn hoá các dân tộc Ê Đê, M'nông — từng là phương tiện vận chuyển, kéo gỗ và biểu tượng quyền lực, giàu có của buôn làng.",
        "Lễ hội Voi Buôn Đôn (Đắk Lắk) là một trong những lễ hội văn hoá đặc trưng thu hút khách du lịch, tôn vinh mối quan hệ giữa người M'nông và voi nhà.",
        "Du lịch quan sát voi thân thiện (không cưỡi, không bắt làm xiếc) đang được khuyến khích thay thế hình thức du lịch cưỡi voi truyền thống nhằm bảo vệ phúc lợi động vật.",
        "Ngà voi từng được dùng làm đồ thủ công mỹ nghệ, nhưng buôn bán ngà voi hiện bị cấm hoàn toàn theo luật pháp Việt Nam và công ước CITES quốc tế.",
        "Trung tâm Bảo tồn Voi Đắk Lắk là nơi nghiên cứu, chăm sóc y tế và nhân giống cho các cá thể voi nhà, đồng thời giáo dục cộng đồng về bảo tồn voi hoang dã.",
      ],
      gallery: [
        {
          url: "https://images.unsplash.com/photo-1719807633728-7ff13f7f2b61?q=80&w=1600&auto=format&fit=crop",
          kind: "image",
          caption: "Một đàn voi châu Á di chuyển qua sông tại Vườn quốc gia Udawalawe, Sri Lanka.",
          credit: "Shyaman Prasad / Unsplash",
        },
        {
          url: "https://images.unsplash.com/photo-1674556275226-47b6b393d623?q=80&w=1600&auto=format&fit=crop",
          kind: "image",
          caption: "Voi mẹ và voi con cùng kiếm ăn trên đồng cỏ rộng.",
          credit: "Sachindra Chalaka / Unsplash",
        },
        {
          url: "UM9z6TcLgsA",
          kind: "youtube",
          caption: "Tổng quan về tập tính, cấu tạo và đời sống của voi châu Á.",
        },
      ],
    },
  },
  {
    slug: "bo-tay-tang",
    name: "Bò Yak",
    scientificName: "Bos grunniens",
    biome: "mountain",
    country: "Tây Tạng",
    tagline: "Bộ lông dày giúp chịu nhiệt độ dưới -30°C trên cao nguyên.",
  },
  {
    slug: "lac-da-mot-bu",
    name: "Lạc đà một bướu",
    scientificName: "Camelus dromedarius",
    biome: "desert",
    country: "Ả Rập Saudi",
    tagline: "Có thể nhịn uống nước hơn một tuần giữa sa mạc.",
  },
  {
    slug: "trau-nuoc",
    name: "Trâu nước",
    scientificName: "Bubalus bubalis",
    biome: "wetland",
    country: "Việt Nam",
    tagline: "Người bạn đồng hành của nông dân trên ruộng lúa nước.",
  },
  {
    slug: "cu-ong-vang",
    name: "Cú vàng",
    scientificName: "Tyto alba",
    biome: "plains",
    country: "Việt Nam",
    tagline: "Thợ săn chuột tự nhiên giúp bảo vệ mùa màng ban đêm.",
  },
  {
    slug: "vet-doi-mao",
    name: "Vẹt đuôi dài",
    scientificName: "Ara macao",
    biome: "tropical",
    country: "Brazil",
    tagline: "Bộ lông rực rỡ giữa tầng cao của rừng mưa Amazon.",
  },
];
