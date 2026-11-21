// 伸縮帶欄柱的顏色款式：同一款欄柱（例：RS-A4）的不同柱身／織帶顏色各是一個品項，
// 這裡依型號把它們歸成同一組，產品頁用來顯示顏色選擇按鈕
import type { CatalogItem } from "./products";

// 一個顏色款式：柱身色、織帶色與對應的品項
export type Variant = { post: string; belt: string; item: CatalogItem };

// 型號裡代表顏色的代碼（SR 不鏽鋼、BK 黑、BE 藍、YW 黃、RD 紅、CR 透明／印花、LG 淺灰、BZ 古銅、GD 金、YB 黃黑、RW 紅白；S／D／B 為 U 系列的顏色碼）
const colorCode = /^(SR|BK|BE|YW|RD|CR|LG|BZ|GD|YB|RW|S|D|B)/;

// 款式代號：拿掉型號中的顏色碼，其餘相同的歸為同一款
// 例：RS-A4SR、RS-A4BK → RS-A4｜；RS-206SRRF → RS-206｜RF；RS-01S(BK) → RS-01S()
function familyKey(model: string): string | null {
  const m = model.match(/^(RS-[A-Z]*\d+)(.*)$/);
  if (!m) return null;
  const [, base, tail] = m;
  const paren = tail.match(/^(\w*)\((\w+)\)$/);
  return paren ? `${base}${paren[1]}(${paren[2].replace(colorCode, "")})` : `${base}|${tail.replace(colorCode, "")}`;
}

// 從規格說明取出柱身色與織帶色（例：「不鏽鋼色柱身・紅色織帶」→ 不鏽鋼色／紅色）
function colorsOf(item: CatalogItem): { post: string; belt: string } | null {
  const parts = (item.spec ?? "").split("・");
  const post = parts.find((s) => /柱身$/.test(s))?.replace(/柱身$/, "");
  const belt = parts.find((s) => /織帶/.test(s))?.replace(/織帶.*$/, "");
  return post && belt ? { post, belt } : null;
}

// 其他系列的同款不同色（只有一個「顏色」選項，只能選型錄上有的）：型號 → 顏色名稱
// 依產品照型號整理；型號字尾不是顏色的（例：P3-01BU 優雅款、P3-01BK 厚實底座）不列入
const COLOR_FAMILIES: Record<string, string>[] = [
  // 塑膠欄柱
  { "PS-03RW2": "紅白", "PS-03YB2": "黃黑" },
  { "PS-04RW2": "紅白", "PS-04YB2": "黃黑" },
  { "PSL-03RW2": "紅白", "PSL-03YB2": "黃黑" },
  // 拒馬
  { "TS-209BK": "黑色", "TS-209RD": "紅色", "TS-209BZ": "古銅色", "TS-209SR": "不鏽鋼色" },
  // 展覽佈展欄柱
  { "RF-38BK": "黑色", "RF-38SR": "不鏽鋼色" },
  // 海報架・告示牌
  { "DRP-S41BK": "黑色", "DRP-S41SR": "電鍍銀" },
  { "PB-172BK": "質感黑", "PB-172SR": "亮光銀" },
  { "P7-45BK": "黑色", "P7-45GD": "金色" },
  { "PV-S11BK": "黑色", "PV-S11WE": "白色" },
  { "PV-S21BK": "黑色", "PV-S21WE": "白色" },
  // 數位看板・燈箱
  { "LRP-A4DBK": "黑色", "LRP-A4DWE": "白色" },
  { "PLD-A4BK": "黑色", "PLD-A4WE": "白色" },
  // 清潔衛生
  { "HDS-A40BK": "黑色", "HDS-A40SR": "不鏽鋼色" },
];

// 其他系列：同款不同色（只有柱身／本體顏色，織帶為空字串）
function colorFamilyOf(item: CatalogItem, items: CatalogItem[]): Variant[] | null {
  const fam = COLOR_FAMILIES.find((f) => item.model in f);
  if (!fam) return null;
  const list = items.filter((i) => i.model in fam).map((i) => ({ post: fam[i.model], belt: "", item: i }));
  return list.length > 1 ? list : null;
}

// 這個品項所屬款式的所有顏色
// 伸縮帶欄柱：柱身＋織帶（只有一種顏色時也回傳，織帶仍可客製）；其他系列：只有顏色一項
export function variantsOf(item: CatalogItem, items: CatalogItem[]): Variant[] | null {
  const other = colorFamilyOf(item, items);
  if (other) return other;
  const key = familyKey(item.model);
  if (!key || !colorsOf(item)) return null;
  const list = items
    .filter((i) => familyKey(i.model) === key)
    .flatMap((i) => {
      const c = colorsOf(i);
      return c ? [{ ...c, item: i }] : [];
    });
  return list.length ? list : null;
}

// 馬卡龍色系織帶（RS-258WE 可選購的 5 色）
export const MACARON_BELTS = ["櫻花紫", "檸檬黃", "米白", "湖水藍", "莓果粉"];

// 單層織帶顏色分組：產品頁顏色選擇分三行顯示
export const BELT_GROUPS = [
  { name: "一般色", colors: ["紅色", "酒紅色", "藍色", "黑色", "灰色"] },
  { name: "警示條紋", colors: ["黃黑警示", "紅白警示"] },
  { name: "馬卡龍色系", colors: MACARON_BELTS },
];

// 所有單層織帶顏色：每個伸縮帶欄柱都可選（不是該型號原本的顏色時標示客製）
export const ALL_BELTS = BELT_GROUPS.flatMap((g) => g.colors);

// 這一款可選的織帶顏色：雙層織帶的款式（八向 RS-33）只列自己的雙層織帶；其餘列出全部單層織帶，再補上款式自己特有的顏色
export function beltOptions(variants: Variant[]): string[] {
  // 只有顏色一項的系列：沒有織帶選項
  if (variants.every((v) => !v.belt)) return [];
  const own = [...new Set(variants.map((v) => v.belt))];
  if (own.some((b) => b.includes("雙層"))) return own;
  return [...ALL_BELTS, ...own.filter((b) => !ALL_BELTS.includes(b) && b !== "馬卡龍色系")];
}
