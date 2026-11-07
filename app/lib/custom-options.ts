// 客製化服務頁 /custom 的「客製選項總覽」資料：哪些產品可以客製、標誌與文字印在哪、哪裡可以換色
// 內容依世紘確認（2026-11-07）；print 寫「請洽專員確認」的項目，待確認後再改成實際部位
// photo：之後找到客製作品照，填上路徑（public 底下）與說明即可取代去背產品圖；沒有填時顯示 /cutouts/<slug>.png
// cases：相關客戶案例的網址代號（app/lib/cases.ts），沒有就留空陣列

// 一類可客製的產品
export type CustomOption = {
  // 產品分類網址代號（/products/<slug>，也是去背圖檔名）
  slug: string;
  // 產品名稱
  name: string;
  // 標誌與文字可以印在哪裡
  print: string[];
  // 哪裡可以換顏色
  color: string[];
  // 相關客戶案例
  cases: string[];
  // 客製作品照（選填）
  photo?: { src: string; alt: string };
};

// 分組：欄柱類、看板告示類、空間設備類
export const customGroups: { name: string; items: CustomOption[] }[] = [
  {
    name: "欄柱類",
    items: [
      { slug: "retractable-belt-stanchions", name: "伸縮帶欄柱", print: ["織帶", "柱頭告示框"], color: ["織帶", "柱身"], cases: ["xiaomi-store", "tsg-hawks", "zhulinshan-guanyin-temple", "tainan-tiantan-temple", "lienchiang-meishi-arts-center"] },
      { slug: "rope-stanchions", name: "迎賓欄柱", print: ["請洽專員確認"], color: ["圍繩", "柱身"], cases: ["chihai-cultural-park"] },
      { slug: "exhibition-stanchions", name: "展覽佈展欄柱", print: ["請洽專員確認"], color: ["織帶或圍繩", "柱身"], cases: ["kham-art-ntsec"] },
      { slug: "plastic-stanchions", name: "塑膠欄柱", print: ["請洽專員確認"], color: ["柱身", "鏈條"], cases: [] },
    ],
  },
  {
    name: "看板告示類",
    items: [
      { slug: "barriers", name: "拒馬", print: ["看板"], color: ["看板底色", "框架"], cases: ["barrier-printing-portfolio", "chihai-cultural-park", "zhulinshan-guanyin-temple"] },
      { slug: "poster-sign-stands", name: "海報架・告示牌", print: ["牌面", "抬頭"], color: ["框架"], cases: ["xiaomi-store"] },
      { slug: "bulletin-boards", name: "佈告欄", print: ["抬頭或板面"], color: ["框架", "板面"], cases: [] },
      { slug: "digital-signage-lightbox", name: "數位看板・燈箱", print: ["燈箱面板", "外框"], color: ["外框"], cases: [] },
    ],
  },
  {
    name: "空間設備類",
    items: [
      { slug: "waste-recycling", name: "垃圾桶・資源回收", print: ["桶身（標誌、分類文字）"], color: ["桶身"], cases: [] },
      { slug: "umbrella-stands", name: "傘架・傘桶", print: ["桶身或側板"], color: ["烤漆"], cases: ["xiaomi-store"] },
    ],
  },
];

// 全部可客製的產品（依分組順序）
export const customOptions = customGroups.flatMap((g) => g.items);
