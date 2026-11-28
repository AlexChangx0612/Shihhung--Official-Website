// 匯入 Node.js 檔案系統模組，用來讀取資料夾內的圖片
import fs from "node:fs";
// 匯入路徑處理模組，用來組合資料夾路徑
import path from "node:path";
// 匯入已登錄產品（有型號與規格的產品）
import { productByImage, type ProductDetail } from "./product-details";
// 匯入產品照上的型號與規格
import { productModels } from "./product-models";

// 單一品項：每張產品照一個品項，各自有獨立介紹頁 /products/<分類>/<slug>
export type CatalogItem = {
  // 網址代號：已登錄產品用型號（例如 rs-a4bk），其餘用小寫檔名（例如 001-006-001）
  slug: string;
  // 品項編號：產品照檔名（不含副檔名），詢價時可提供給專員
  code: string;
  // 產品照網址
  image: string;
  // 介紹頁網址
  href: string;
  // 顯示名稱：已登錄產品用產品名稱，其餘用分類名稱
  name: string;
  // 型號：產品照右下角黃色字（未登錄時用品項編號）
  model: string;
  // 規格說明：例如「不鏽鋼色柱身・紅色織帶」（未登錄時為 undefined）
  spec?: string;
  // 已登錄產品的完整資料（型號、規格、特色）；未登錄為 undefined
  detail?: ProductDetail;
};


// 產品分類的資料型別
export type Category = {
  // 分類代號（英文，用於首頁商品目錄的錨點 #c-id）
  id: string;
  // 分類頁網址代號：/products/<slug>
  slug: string;
  // 英文名稱（小標用）
  en: string;
  // 分類名稱（顯示用）
  name: string;
  // 分類說明文字
  desc: string;
  // 此分類的所有產品圖片網址
  images: string[];
  // 此分類的所有品項（與 images 同順序）
  items: CatalogItem[];
  // 小系列（有定義時，分類頁依小系列分區顯示；未定義為 undefined）
  groups?: CategoryGroup[];
};

// 分類底下的小系列：例如伸縮帶欄柱分為四向、八向、萬向、壁掛式圍欄與配件
export type CategoryGroup = {
  // 錨點代號（分類頁 #<id>）
  id: string;
  // 英文名稱（小標用）
  en: string;
  // 小系列名稱
  name: string;
  // 小系列說明
  desc: string;
  // 代表圖（小系列導覽卡片用）
  cover: string;
  // 此小系列的品項（依分類內原本的順序）
  items: CatalogItem[];
};

// 小系列定義：match 判斷品項是否屬於此小系列（各小系列的條件互不重疊）；cover 為代表圖的品項編號，省略時用第一個品項
type GroupDef = Omit<CategoryGroup, "items" | "cover"> & { match: (item: CatalogItem) => boolean; cover?: string };

// 小系列條件：品項編號（產品照檔名）以任一開頭文字開頭
const byCode = (...prefixes: string[]) => (item: CatalogItem) => prefixes.some((p) => item.code.startsWith(p));

// TK 不鏽鋼信箱（小、中、大）、意見箱、巡邏箱的檔名開頭：原屬推車・工具車，歸入鑰匙箱・信箱
const MAILBOX_CODES = ["011-008-003-", "011-008-004-", "011-008-005-", "011-008-006-", "011-008-007-"];

// 依照片實際內容分類；prefixes 比對 public/images 底下的檔名開頭，exclude 為符合 prefixes 但要排除的檔名開頭
// placeAfter 調整個別品項的位置：品項編號 → 要排在哪個品項編號後面（依序套用；未列出的品項維持檔名順序）
const categoryDefs: { id: string; slug: string; en: string; name: string; desc: string; prefixes: string[]; exclude?: string[]; placeAfter?: Record<string, string>; groups?: GroupDef[] }[] = [
  // 分類 1：伸縮帶欄柱
  {
    id: "retractable",
    slug: "retractable-belt-stanchions",
    en: "RETRACTABLE BELT STANCHIONS",
    name: "伸縮帶欄柱",
    desc: "四向、八向、萬向伸縮帶欄柱與壁掛式圍欄，以及柱頭告示框、防塵蓋等配件。",
    // 檔名以這些文字開頭的圖片歸入此分類
    prefixes: ["001-", "20230821-", "new-"],
    // P4-45LBK、P4-45LGD LED 背光板立牌歸入海報架・告示牌
    exclude: ["new-046-", "new-047-"],
    // 依產品照左上角標籤分成五個小系列（標籤已寫在 product-models.ts 的規格說明與型號）
    groups: [
      {
        id: "four-way",
        en: "4-WAY",
        name: "四向伸縮欄柱",
        desc: "柱頭設有四個織帶扣接方向，可排出直線與直角轉折的動線；織帶長 200cm，柱身有不鏽鋼、黑、金、古銅等色。",
        match: (i) => i.spec?.startsWith("四向系列") ?? false,
      },
      {
        id: "eight-way",
        en: "8-WAY",
        name: "八向伸縮欄柱",
        desc: "柱頭設有八個織帶扣接方向，可再加上斜向轉折；含紅藍、黃黑、紅白雙層織帶款，織帶長 200cm。",
        match: (i) => i.spec?.startsWith("八向系列") ?? false,
        // 雙柱雙層織帶的產品照，最能看出八向的特色
        cover: "001-051-001",
      },
      {
        id: "universal",
        en: "UNIVERSAL",
        name: "萬向伸縮欄柱",
        desc: "柱頭可往任意方向扣接織帶，動線排法最自由；織帶長 200／400／500cm，柱身有多種顏色、警示條紋、透明與木紋款。",
        // 其餘欄柱的產品照標籤皆為「萬向系列」（規格說明沒有寫系列名稱）
        match: (i) => !/^(四向系列|八向系列|掛壁式圍欄)/.test(i.spec ?? "") && !/^(RP|RV)-/.test(i.model),
      },
      {
        id: "wall-mounted",
        en: "WALL MOUNT",
        name: "壁掛式圍欄",
        desc: "固定在牆面或柱面，拉出織帶扣到對面即可封住通道；織帶長 200／400／500cm，含紅白、黃黑警示織帶。",
        match: (i) => i.spec?.startsWith("掛壁式圍欄") ?? false,
      },
      {
        id: "accessories",
        en: "ACCESSORIES",
        name: "欄柱配件",
        desc: "A3／A4 柱頭告示框、拍拍框與防塵蓋，讓欄柱同時傳遞指示與宣傳資訊。",
        // 型號開頭：RP 告示框、RV 防塵蓋
        match: (i) => /^(RP|RV)-/.test(i.model),
        // 欄柱裝上告示框的產品照
        cover: "001-102-001",
      },
    ],
  },
  // 分類 2：迎賓欄柱
  {
    id: "rope",
    slug: "rope-stanchions",
    en: "ROPE STANCHIONS",
    name: "迎賓欄柱",
    desc: "不鏽鋼迎賓欄柱，有圓球頭、皇冠頭、平蓋頭等柱頭造型，搭配絨布繩，典雅大方。",
    prefixes: ["003-", "004-"],
    // 依型號系列分成三個小系列（id 不可與伸縮帶欄柱的 accessories 等重複，產品頁說明依 id 查詢）
    groups: [
      {
        id: "rope-sw",
        en: "SW・CB SERIES",
        name: "迎賓欄柱",
        desc: "SW、CB 系列，有圓球頭、皇冠頭、平蓋頭三種柱頭造型，總高 860～1105mm，搭配迎賓絨繩使用；CB 系列另可搭配圍幕桿與彈力勾。",
        // SW-R1S(A)、SW-R2G(A) 等柱身型號（絨繩 SW-R150 等不含括號），以及 CB 系列柱身
        match: (i) => /^SW-R\d[SG]\(/.test(i.model) || i.model.startsWith("CB-"),
      },
      {
        id: "rope-cords",
        en: "ROPES",
        name: "迎賓絨繩",
        desc: "繩長 150cm、180cm 的迎賓絨繩，另有三色絨繩。",
        match: (i) => /^SW-(R1[58]0|T150)/.test(i.model),
      },
      {
        id: "rope-accessories",
        en: "ACCESSORIES",
        name: "欄柱配件",
        desc: "壁鉤、彈力勾與 140cm、170cm 圍幕桿，搭配迎賓欄柱與絨繩使用。",
        match: (i) => /^(RC|EH|BS)-/.test(i.model),
      },
    ],
  },
  // 分類 3：展覽佈展欄柱
  {
    id: "outdoor",
    slug: "exhibition-stanchions",
    en: "EXHIBITION STANCHIONS",
    name: "展覽佈展欄柱",
    desc: "消光烤漆柱身，可搭配彈力繩或鋁合金橫桿，室內外皆適用。",
    prefixes: ["005-", "006-", "20240729-007-", "20240729-008-"],
  },
  // 分類 4：塑膠欄柱
  {
    id: "plastic",
    slug: "plastic-stanchions",
    en: "PLASTIC STANCHIONS",
    name: "塑膠欄柱",
    desc: "紅白、黃黑警示塑膠欄柱，底座有實心配重與空心可灌水款式，施工與停車場常用。",
    prefixes: ["002-"],
  },
  // 分類 5：拒馬
  {
    id: "barrier",
    slug: "barriers",
    en: "BARRIERS",
    name: "拒馬",
    desc: "烤漆與不鏽鋼拒馬，可放置廣告看板，入口管制好幫手。",
    prefixes: ["012-001-", "012-002-", "012-003-", "012-004-", "012-005-", "012-006-", "012-007-", "012-20221205-"],
  },
  // 分類 6：海報架・告示牌
  {
    id: "sign",
    slug: "poster-sign-stands",
    en: "POSTER & SIGN STANDS",
    name: "海報架・告示牌",
    desc: "壁掛海報框、立式告示牌、壓克力公佈欄與警示立牌。",
    prefixes: ["007-", "014-", "018-", "012-20221125-", "new-046-", "new-047-"],
    // P4-45LBK、P4-45LGD 排在同系列的 P4-45 後面
    placeAfter: { "new-046-001": "007-033-001", "new-047-001": "new-046-001" },
  },
  // 分類 7：佈告欄
  {
    id: "board",
    slug: "bulletin-boards",
    en: "BULLETIN BOARDS",
    name: "佈告欄",
    desc: "雙面布面與面布搭配磁白板的佈告欄，附輪移動方便。",
    prefixes: ["008-"],
  },
  // 分類 8：數位看板・燈箱
  {
    id: "display",
    slug: "digital-signage-lightbox",
    en: "DIGITAL SIGNAGE & LIGHTBOX",
    name: "數位看板・燈箱",
    desc: "IPS 數位看板與 LED 發光展示架，吸睛宣傳。",
    prefixes: ["009-", "20240729-"],
    // RF-19BU、RF-19BU-FD 欄柱歸入展覽佈展欄柱
    exclude: ["20240729-007-", "20240729-008-"],
  },
  // 分類 9：垃圾桶・資源回收桶
  {
    id: "trash",
    slug: "waste-recycling",
    en: "WASTE & RECYCLING",
    name: "垃圾桶・資源回收桶",
    desc: "不鏽鋼垃圾桶、煙灰桶、分類回收桶與分類貼紙。",
    prefixes: ["011-002-", "011-004-", "011-005-", "011-006-", "011-009-", "011-20221125-"],
    // 依檔名編號（即產品照的系列）分成六個小系列
    groups: [
      {
        id: "waste-wheelie",
        en: "WHEELIE BINS",
        name: "帶輪回收桶",
        desc: "RB、GB、ERB 系列，多數通過 EN840 認證，最大載量 48～510kg，部分為腳踏式；另有 50、100 公升款。",
        match: byCode("011-002-"),
      },
      {
        id: "waste-stainless",
        en: "STAINLESS BINS",
        name: "不鏽鋼垃圾桶",
        desc: "ST1、TH 系列，有推板式、開放式、頂蓋搖擺板式與搖擺式投入口，多數附不鏽鋼內桶；另有廣告型與木紋款。",
        match: byCode("011-006-001-"),
      },
      {
        id: "waste-sorting",
        en: "SORTING BINS",
        name: "分類回收桶",
        desc: "二分類、三分類與四分類回收桶，有推板式、開放式與搖擺式投入口；另有折疊式分類回收架。",
        match: byCode("011-006-002-", "011-006-003-", "011-006-004-", "011-20221125-"),
      },
      {
        id: "waste-ashtray",
        en: "ASHTRAYS",
        name: "煙灰缸・煙灰缸垃圾桶",
        desc: "不鏽鋼 #304 立式煙灰缸與上方附煙灰缸的垃圾桶，部分附內桶。",
        match: byCode("011-004-"),
      },
      {
        id: "waste-small",
        en: "SMALL BINS",
        name: "小型垃圾桶",
        desc: "PT、T、SW-M、TR 系列，有不鏽鋼 #304 拋光與鋼網、鋼板黑色烤漆款。",
        match: byCode("011-005-"),
      },
      {
        id: "waste-stickers",
        en: "STICKERS",
        name: "分類貼紙",
        desc: "一般垃圾、塑膠類、寶特瓶、玻璃類、紙類等 9 種分類貼紙，尺寸 26×36cm。",
        match: byCode("011-009-"),
      },
    ],
  },
  // 分類 10：清潔衛生
  {
    id: "hygiene",
    slug: "cleaning-hygiene",
    en: "CLEANING & HYGIENE",
    name: "清潔衛生",
    desc: "感應給皂機、擦鞋機，維護公共空間衛生。",
    prefixes: ["011-001-", "011-003-"],
  },
  // 分類 11：傘架・傘桶
  {
    id: "umbrella",
    slug: "umbrella-stands",
    en: "UMBRELLA STANDS",
    name: "傘架・傘桶",
    desc: "鋁合金摺疊傘架與不鏽鋼傘桶，保持入口乾爽。",
    prefixes: ["016-"],
  },
  // 分類 12：推車・工具車
  {
    id: "cart",
    slug: "carts-tool-carts",
    en: "CARTS & TOOL CARTS",
    name: "推車・工具車",
    desc: "房務整備車、手推車、工具車與不鏽鋼工作桌。",
    prefixes: ["013-", "011-007-", "011-008-"],
    // TK 信箱、意見箱、巡邏箱歸入鑰匙箱・信箱
    exclude: MAILBOX_CODES,
    // 依檔名編號分成七個小系列；工作推車依層數與全配型再拆成三組
    groups: [
      {
        id: "carts-2tier",
        en: "2-TIER CARTS",
        name: "二層工作推車",
        desc: "單把手、雙把手、圍邊型與側背圍邊型二層工作推車，有黑、白、藍、綠、紅、黃等色，部分附置物網籃。",
        match: byCode("013-005-"),
      },
      {
        id: "carts-3tier",
        en: "3-TIER CARTS",
        name: "三層工作推車",
        desc: "單把手、雙把手、圍邊型與側背圍邊型三層工作推車，有黑、白、藍、綠、紅、黃等色。",
        match: (i) => i.code.startsWith("013-006-") && !i.spec?.startsWith("全配型"),
      },
      {
        id: "carts-full",
        en: "FULLY EQUIPPED",
        name: "全配型工作推車",
        desc: "工作推車搭配收納盆與掛桶的全配組合，車長 100～135.4cm。",
        match: (i) => i.spec?.startsWith("全配型") ?? false,
      },
      {
        id: "carts-housekeeping",
        en: "HOUSEKEEPING",
        name: "房務整備車・汙衣推車",
        desc: "房務整備車、圍欄整備車與帆布汙衣推車。",
        match: byCode("013-001-", "013-002-", "013-008-"),
      },
      {
        id: "carts-hand",
        en: "HAND TRUCKS",
        name: "手推車・平台車",
        desc: "灰、綠、黃色折疊式手推車與鋁合金平台車。",
        match: byCode("013-004-"),
      },
      {
        id: "carts-tool",
        en: "TOOL CARTS",
        name: "工具車・不鏽鋼推車",
        desc: "鐵製工具車，以及不鏽鋼 304 工具車、層板推車與工作桌。",
        match: byCode("013-003-", "011-007-", "011-008-"),
      },
      {
        id: "carts-accessories",
        en: "ACCESSORIES",
        name: "推車配件",
        desc: "中掛桶、加蓋中掛桶、收納盒與夾扣，搭配工作推車使用。",
        match: byCode("013-007-"),
      },
    ],
  },
  // 分類 13：鑰匙箱・信箱
  {
    id: "key",
    slug: "key-boxes",
    en: "KEY BOXES & MAILBOXES",
    name: "鑰匙箱・信箱",
    desc: "防鏽鋼板鑰匙箱（20～240 支容量），以及不鏽鋼 304 信箱、意見箱與巡邏箱。",
    prefixes: ["012-008-", "012-009-", "012-01", ...MAILBOX_CODES],
    // 檔名 011 開頭的信箱排在鑰匙箱後面（依序：信箱小、中、大，意見箱，巡邏箱）
    placeAfter: {
      "011-008-004-001": "012-015-001",
      "011-008-005-001": "011-008-004-001",
      "011-008-006-001": "011-008-005-001",
      "011-008-003-001": "011-008-006-001",
      "011-008-007-001": "011-008-003-001",
    },
    groups: [
      {
        id: "key-cabinets",
        en: "KEY BOXES",
        name: "鑰匙箱",
        desc: "防鏽鋼板鑰匙箱，總容量 20～240 支。",
        match: byCode("012-"),
      },
      {
        id: "mailboxes",
        en: "MAILBOXES",
        name: "信箱・意見箱",
        desc: "不鏽鋼 304 信箱（小、中、大）、意見箱與巡邏箱。",
        match: byCode(...MAILBOX_CODES),
      },
    ],
  },
];

// 產品圖片所在資料夾：專案根目錄/public/images
const IMAGE_DIR = path.join(process.cwd(), "public", "images");
// 判斷是否為圖片檔的規則：副檔名為 png、jpg、jpeg 或 webp（不分大小寫）
const IMAGE_EXT = /\.(png|jpe?g|webp)$/i;

// 列出資料夾（含所有子資料夾）內的圖片，回傳網址清單
function listImages(dir: string, urlBase: string): string[] {
  // 讀取資料夾內容，逐一處理每個項目並攤平成一個陣列
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    // 如果是子資料夾，就往下一層繼續找（遞迴）
    if (entry.isDirectory()) return listImages(path.join(dir, entry.name), `${urlBase}/${entry.name}`);
    // 如果是圖片檔就回傳它的網址，否則略過
    return IMAGE_EXT.test(entry.name) ? [`${urlBase}/${entry.name}`] : [];
  });
}

// 從網址取出檔名（最後一個「/」之後的文字）
function fileName(url: string) {
  // 回傳最後一個斜線後面的部分
  return url.slice(url.lastIndexOf("/") + 1);
}

// 把產品照轉成品項；categorySlug 為所屬分類網址代號，fallbackName 為未登錄產品的顯示名稱
function toItem(url: string, categorySlug: string, fallbackName: string): CatalogItem {
  // 檔名去掉副檔名，作為品項編號
  const code = fileName(url).replace(IMAGE_EXT, "");
  // 已登錄產品（以照片比對）
  const detail = productByImage(url);
  // 網址代號：已登錄用型號代號，否則用小寫檔名
  const slug = detail?.slug ?? code.toLowerCase();
  // 產品照上的型號與規格
  const [model, spec] = productModels[code] ?? [detail?.model ?? code, undefined];
  return { slug, code, image: url, href: `/products/${categorySlug}/${slug}`, name: detail?.name ?? fallbackName, model, spec, detail };
}

// 取得產品目錄：回傳各分類
export function getCatalog() {
  // 取得 public/images 底下所有圖片網址
  const all = listImages(IMAGE_DIR, "/images")
    .filter((url) => url.split("/").length > 3) // 只取子資料夾內的產品照，排除 LOGO
    // 依檔名排序，讓順序固定
    .sort();

  // 依分類定義，把檔名符合開頭規則的圖片放進各分類
  const categories: Category[] = categoryDefs.map(({ prefixes, exclude = [], placeAfter = {}, groups, ...rest }) => {
    // 篩選出檔名開頭符合任一規則、且不在排除清單的圖片
    const images = all.filter((url) => prefixes.some((p) => fileName(url).startsWith(p)) && !exclude.some((p) => fileName(url).startsWith(p)));
    // 依 placeAfter 把個別品項移到指定品項後面
    const codeOf = (url: string) => fileName(url).replace(IMAGE_EXT, "");
    for (const [code, after] of Object.entries(placeAfter)) {
      const from = images.findIndex((url) => codeOf(url) === code);
      if (from === -1) continue;
      const [moved] = images.splice(from, 1);
      images.splice(images.findIndex((url) => codeOf(url) === after) + 1, 0, moved);
    }
    // 保留分類的 id、名稱、說明，並把每張圖片轉成品項
    const items = images.map((url) => toItem(url, rest.slug, rest.name));
    // 有小系列定義時，把品項分進各小系列，並找出代表圖
    const grouped = groups?.map(({ match, cover, ...g }) => {
      const list = items.filter(match);
      return { ...g, cover: (list.find((i) => i.code === cover) ?? list[0]).image, items: list };
    });
    return { ...rest, images, items, ...(grouped && { groups: grouped }) };
  });

  // 回傳有圖片的分類（空分類不顯示）
  return { categories: categories.filter((c) => c.images.length > 0) };
}

// 依網址代號取得單一分類（找不到回傳 undefined）
export function getCategory(slug: string) {
  return getCatalog().categories.find((c) => c.slug === slug);
}

// 依網址取得單一品項，連同所屬列表（同分類的品項）；找不到回傳 undefined
export function getItem(categorySlug: string, slug: string) {
  const cat = getCatalog().categories.find((c) => c.slug === categorySlug);
  if (!cat) return undefined;
  // 列表在分類頁
  const list = { slug: cat.slug, en: cat.en, name: cat.name, desc: cat.desc, listHref: `/products/${cat.slug}`, items: cat.items };
  // 品項在列表中的位置（上一項／下一項用）
  const index = list.items.findIndex((i) => i.slug === slug);
  if (index < 0) return undefined;
  return { item: list.items[index], index, list };
}

// 全部品項的網址參數（建置時產生每個品項頁）
export function allItemParams() {
  return getCatalog().categories.flatMap((c) => c.items).map((i) => {
    // href 格式為 /products/<分類>/<slug>
    const [, , category, slug] = i.href.split("/");
    return { category, slug };
  });
}
