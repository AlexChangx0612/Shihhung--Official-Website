// 首頁「產品系列」玻璃展示櫃的卡片資料（伺服器端：getCatalog 會讀檔，只在 server component 呼叫 getCollectionCards）
// 匯入產品目錄（各分類與品項）
import { getCatalog } from "./products";

// 輪播循環計算放在 collections-math.ts（純函式，client 元件請從那裡匯入）；這裡一併轉出方便伺服器端與測試使用
export { rangeLabel, wrapIndex } from "./collections-math";

// 單張系列卡片
export type CollectionCard = {
  // 分類網址代號（例如 retractable-belt-stanchions）
  slug: string;
  // 分類名稱（顯示用）
  name: string;
  // 英文簡稱（卡片小標，例如 RETRACTABLE）
  en: string;
  // 款數：此分類的實際品項數
  count: number;
  // 去背圖網址：/cutouts/<slug>.png
  image: string;
  // 分類頁網址：/products/<slug>
  href: string;
};

// 英文簡稱對照（照展示稿）：分類網址代號 → 卡片上的英文簡稱
const SHORT_EN: Record<string, string> = {
  "retractable-belt-stanchions": "RETRACTABLE",
  "rope-stanchions": "ROPE",
  "exhibition-stanchions": "EXHIBITION",
  "plastic-stanchions": "PLASTIC",
  barriers: "BARRIERS",
  "poster-sign-stands": "SIGNS",
  "bulletin-boards": "BOARDS",
  "digital-signage-lightbox": "SIGNAGE",
  "waste-recycling": "WASTE",
  "cleaning-hygiene": "HYGIENE",
  "umbrella-stands": "UMBRELLA",
  "carts-tool-carts": "CARTS",
  "key-boxes": "KEY BOXES",
};

// 取得英文簡稱：查對照表，查不到（例如未來新增的系列）就用英文名稱第一個字
export function shortEn(slug: string, en: string): string {
  return SHORT_EN[slug] ?? en.split(" ")[0];
}

// 取得所有系列卡片（依產品目錄的分類順序）
export function getCollectionCards(): CollectionCard[] {
  return getCatalog().categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    en: shortEn(c.slug, c.en),
    // 款數取實際品項數，不寫死
    count: c.items.length,
    image: `/cutouts/${c.slug}.png`,
    href: `/products/${c.slug}`,
  }));
}
