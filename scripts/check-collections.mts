// 檢查首頁「產品系列」玻璃展示櫃卡片資料與輪播循環計算：執行 npx tsx scripts/check-collections.mts，全部通過會印出「OK」
// 專案沒有測試框架，用這支斷言腳本確認卡片資料、去背圖與循環計算一致
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getCollectionCards, rangeLabel, shortEn, wrapIndex } from "../app/lib/collections";
import { getCatalog } from "../app/lib/products";

// 卡片數＝實際系列數（目前 13 個）
const cards = getCollectionCards();
assert.equal(cards.length, getCatalog().categories.length);
assert.equal(cards.length, 13);
// 第一張：伸縮帶欄柱的名稱、英文簡稱、去背圖與連結
const ret = cards[0];
assert.deepEqual(
  { slug: ret.slug, name: ret.name, en: ret.en, image: ret.image, href: ret.href },
  { slug: "retractable-belt-stanchions", name: "伸縮帶欄柱", en: "RETRACTABLE", image: "/cutouts/retractable-belt-stanchions.png", href: "/products/retractable-belt-stanchions" },
);
// 每張卡片：款數等於實際品項數、要有品項、去背圖要存在（缺圖直接報錯，不讓破圖上線）
for (const c of cards) {
  assert.equal(c.count, getCatalog().categories.find((x) => x.slug === c.slug)!.items.length);
  assert.ok(c.count > 0, `${c.slug} 要有品項`);
  assert.ok(fs.existsSync(path.join("public", c.image)), `${c.image} 去背圖要存在`);
}
// 對照表裡有空格的簡稱
assert.equal(cards.find((c) => c.slug === "key-boxes")!.en, "KEY BOXES");
// 未來新增的系列查不到對照：退回英文名稱第一個字
assert.equal(shortEn("new-thing", "NEW THING STANDS"), "NEW");
// 循環索引：負數與超出範圍都轉回 0..n-1
assert.deepEqual([-1, 0, 12, 13, 27].map((i) => wrapIndex(i, 13)), [12, 0, 12, 0, 1]);
// 位置文字：兩位數補零、可環繞
assert.equal(rangeLabel(0, 4, 13), "01 – 04 / 13");
assert.equal(rangeLabel(11, 4, 13), "12 – 02 / 13");
assert.equal(rangeLabel(12, 1, 13), "13 – 13 / 13");
console.log("OK");
