// 產品頁「適用場所」卡片：每個場所一張照片、一個短標題，卡片下方的註解沿用分類頁的場所說明
// 照片取自 Unsplash 與 Pexels（皆可免費商用、不需標註），來源記錄在 docs/place-photo-credits.md
// 沒有列在這裡的分類，產品頁維持原本的文字清單
export type PlaceCard = { title: string; note: string; image: string; alt: string; position?: string };

export const placeCards: Record<string, PlaceCard[]> = {
  "retractable-belt-stanchions": [
    {
      title: "銀行・公家機關",
      note: "銀行、郵局與公家機關的櫃台叫號排隊",
      image: "/places/bank-hall.jpg",
      alt: "挑高大廳中央的服務櫃台，四周是壁畫與電梯",
    },
    {
      title: "醫院・診所",
      note: "醫院、診所的掛號、批價與領藥櫃台",
      image: "/places/hospital-reception.jpg",
      alt: "明亮的醫院大廳服務台與樓層指示牌",
    },
    {
      title: "百貨・影城",
      note: "百貨商場、影城、超市的結帳與入場動線",
      image: "/places/cinema-concession.jpg",
      alt: "影城販賣部前以欄柱圍出的排隊動線",
    },
    {
      title: "機場・車站",
      note: "機場報到櫃台、車站售票與安檢排隊",
      image: "/places/airport-belt-barriers.jpg",
      alt: "機場航廈裡以黃色伸縮織帶圍出的排隊通道",
      position: "50% 60%",
    },
    {
      title: "展覽・活動",
      note: "展覽、演唱會、活動報到與入場管制",
      image: "/places/event-queue.jpg",
      alt: "活動會場內排隊等候報到的人潮",
    },
  ],
  "rope-stanchions": [
    {title: "飯店・宴會廳", note: "飯店、宴會廳與餐廳的迎賓入口", image: "/places/hotel-lobby.jpg", alt: "飯店大廳的水晶吊燈與沙發休息區"},
    {title: "精品・百貨專櫃", note: "精品店、百貨專櫃的排隊與區隔", image: "/places/jewelry-boutique.jpg", alt: "明亮的精品店內一排排展示櫃"},
    {title: "美術館・博物館", note: "美術館、博物館的展品保護", image: "/places/museum-sculpture.jpg", alt: "美術館展廳中央的雕塑與參觀民眾"},
    {title: "頒獎典禮・VIP", note: "頒獎典禮、記者會與 VIP 區域", image: "/places/red-carpet.jpg", alt: "鋪著紅地毯、以迎賓欄柱與絨布繩圍出動線的典禮入口"},
  ],
  "exhibition-stanchions": [
    {title: "展覽館", note: "展覽館展區與攤位劃分", image: "/places/trade-show.jpg", alt: "挑高展覽館內以隔板劃分的展區與攤位"},
    {title: "記者會・發表會", note: "記者會、發表會的入場動線", image: "/places/press-interview.jpg", alt: "發表會現場的記者與受訪者"},
    {title: "活動・市集", note: "活動、市集與戶外展演場地", image: "/places/festival-tents.jpg", alt: "戶外活動會場的白色帳篷與人潮"},
    {title: "入口・大廳", note: "建築物入口與室內大廳", image: "/places/office-lobby.jpg", alt: "挑高的辦公大樓大廳與接待櫃台"},
  ],
  "plastic-stanchions": [
    {title: "施工・維修區", note: "施工區與維修區域警示", image: "/places/water-barriers.jpg", alt: "以塑膠水馬圍起的施工區域"},
    {title: "停車場・車道", note: "停車場、車道與出入口", image: "/places/garage-interior.jpg", alt: "室內停車場的車位與車道"},
    {title: "倉儲・卸貨區", note: "賣場倉儲與卸貨區", image: "/places/warehouse-boxes.jpg", alt: "倉庫內堆疊的紙箱與貨物"},
    {title: "活動場地", note: "活動場地的臨時區隔", image: "/places/festival-tents.jpg", alt: "戶外活動會場的白色帳篷與人潮"},
  ],
  barriers: [
    {title: "大樓・機關入口", note: "大樓、社區與機關入口管制", image: "/places/glass-entrance.jpg", alt: "大樓玻璃門入口與門廊"},
    {title: "停車場・車道", note: "停車場與車道出入口", image: "/places/garage-ramp.jpg", alt: "大樓停車場的車道出入口"},
    {title: "活動・展覽入場", note: "活動、展覽的入場管制", image: "/places/event-queue.jpg", alt: "活動會場內排隊等候報到的人潮"},
    {title: "商家門口", note: "商家門口的告示與宣傳", image: "/places/shop-door.jpg", alt: "街邊店家的門口"},
  ],
  "poster-sign-stands": [
    {title: "商場・百貨", note: "商場、百貨的活動宣傳與樓層指示", image: "/places/mall-atrium.jpg", alt: "購物中心的挑高中庭與各層商店"},
    {title: "醫院・診所", note: "醫院、診所的掛號與動線指示", image: "/places/hospital-reception.jpg", alt: "明亮的醫院大廳服務台與樓層指示牌"},
    {title: "飯店・宴會廳", note: "飯店、宴會廳的活動告示", image: "/places/hotel-lobby.jpg", alt: "飯店大廳的水晶吊燈與沙發休息區"},
    {title: "辦公大樓・社區", note: "辦公大樓與社區的公告", image: "/places/office-lobby.jpg", alt: "挑高的辦公大樓大廳與接待櫃台"},
    {title: "清潔・施工提醒", note: "清潔中、施工中等警示提醒", image: "/places/office-corridor.jpg", alt: "辦公大樓明亮的走廊與電梯"},
  ],
  "bulletin-boards": [
    {title: "學校・補習班", note: "學校、補習班與教室", image: "/places/classroom.jpg", alt: "明亮教室裡排列整齊的桌椅"},
    {title: "辦公室・工廠", note: "辦公室、會議室與工廠", image: "/places/meeting-room.jpg", alt: "玻璃隔間的會議室與長桌"},
    {title: "社區管理室", note: "社區管理室與公共空間", image: "/places/mailroom.jpg", alt: "大樓管理室旁的信箱與自行車停放區"},
    {title: "活動・展覽", note: "活動、展覽的資訊公告", image: "/places/trade-show.jpg", alt: "挑高展覽館內以隔板劃分的展區與攤位"},
  ],
  "digital-signage-lightbox": [
    {title: "商場・門市", note: "商場、門市與專櫃的商品宣傳", image: "/places/fashion-store.jpg", alt: "服飾門市內的衣架與商品陳列"},
    {title: "飯店・辦公大廳", note: "飯店、辦公大樓大廳的資訊公告", image: "/places/hotel-reception.jpg", alt: "飯店大廳的接待櫃台"},
    {title: "展覽・活動", note: "展覽與活動的品牌展示", image: "/places/trade-show.jpg", alt: "挑高展覽館內以隔板劃分的展區與攤位"},
    {title: "餐廳", note: "餐廳的菜單與活動看板", image: "/places/restaurant.jpg", alt: "木質裝潢的餐廳用餐區"},
  ],
  "waste-recycling": [
    {title: "辦公大樓・電梯間", note: "辦公大樓、大廳與電梯間", image: "/places/elevator-lobby.jpg", alt: "辦公大樓的電梯廳"},
    {title: "商場・美食街", note: "商場、百貨與美食街", image: "/places/mall-escalators.jpg", alt: "多層購物中心的手扶梯與中庭"},
    {title: "醫院・候診區", note: "醫院、診所與候診區", image: "/places/clinic-waiting.jpg", alt: "診所候診區的座椅與服務櫃台"},
    {title: "學校・車站", note: "學校、車站與公共場域", image: "/places/train-station.jpg", alt: "車站大廳與候車旅客"},
    {title: "吸菸區", note: "大樓出入口的吸菸區", image: "/places/building-steps.jpg", alt: "大樓入口外的階梯與植栽"},
  ],
  "cleaning-hygiene": [
    {title: "醫院・診所", note: "醫院、診所的洗手區", image: "/places/hospital-corridor.jpg", alt: "醫院內乾淨明亮的走廊"},
    {title: "洗手間", note: "辦公大樓與飯店的洗手間", image: "/places/restroom.jpg", alt: "商業空間公共洗手間的洗手檯"},
    {title: "商場・餐廳", note: "商場、餐廳的公共區域", image: "/places/mall-corridor.jpg", alt: "明亮的商場走道與兩側店面"},
    {title: "大樓入口", note: "大樓入口（擦鞋機）", image: "/places/glass-entrance.jpg", alt: "大樓玻璃門入口與門廊"},
  ],
  "umbrella-stands": [
    {title: "銀行・醫院入口", note: "銀行、郵局與醫院入口", image: "/places/umbrella-entrance.jpg", alt: "雨天撐傘走進建築物大門的行人", position: "50% 100%"},
    {title: "商場・飯店大門", note: "商場、百貨與飯店大門", image: "/places/mall-atrium.jpg", alt: "購物中心的挑高中庭與各層商店"},
    {title: "辦公大樓・學校", note: "辦公大樓與學校", image: "/places/office-lobby.jpg", alt: "挑高的辦公大樓大廳與接待櫃台"},
    {title: "餐廳・門市", note: "餐廳與門市", image: "/places/restaurant-2.jpg", alt: "燈光溫暖的餐廳座位區"},
  ],
  "carts-tool-carts": [
    {title: "飯店・民宿房務", note: "飯店與民宿的房務整備", image: "/places/hotel-corridor.jpg", alt: "飯店客房樓層的走廊"},
    {title: "物業管理・清潔", note: "大樓物業管理與清潔", image: "/places/office-corridor.jpg", alt: "辦公大樓明亮的走廊與電梯"},
    {title: "倉儲・賣場", note: "倉儲、賣場的搬運", image: "/places/warehouse-boxes.jpg", alt: "倉庫內堆疊的紙箱與貨物"},
    {title: "廚房・工作區", note: "廚房與工作區（不鏽鋼工作桌）", image: "/places/kitchen.jpg", alt: "不鏽鋼設備的營業用廚房"},
  ],
  "key-boxes": [
    {title: "社區管理室", note: "大樓與社區管理室", image: "/places/mailroom.jpg", alt: "大樓管理室旁的信箱與自行車停放區"},
    {title: "飯店・民宿櫃台", note: "飯店、民宿櫃台", image: "/places/hotel-reception.jpg", alt: "飯店大廳的接待櫃台"},
    {title: "車行・停車場", note: "車行、停車場", image: "/places/garage-interior.jpg", alt: "室內停車場的車位與車道"},
    {title: "辦公室・工廠", note: "辦公室、工廠與學校", image: "/places/factory.jpg", alt: "工廠廠房內的通道與作業區"},
  ],
};
