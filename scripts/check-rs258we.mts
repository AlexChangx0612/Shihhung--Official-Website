// 檢查 RS-258WE 產品頁與目錄：執行 npx tsx scripts/check-rs258we.mts，全部通過會印出「OK」
// 專案沒有測試框架，用這支斷言腳本確認資料、圖片與連結一致
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getProduct } from "../app/lib/product-details";
import { getCatalog } from "../app/lib/products";

// RS-258WE 產品頁：已登錄、圖片存在
const p = getProduct("retractable-belt-stanchions", "rs-258we");
assert.ok(p, "RS-258WE 產品頁要存在");
assert.equal(p.model, "RS-258WE");
assert.deepEqual(p.images, ["/images/new/new-048-001.jpg", "/products/rs-258we-colors.png"]);
for (const src of p.images) assert.ok(fs.existsSync(path.join("public", src)), `${src} 檔案要存在`);

// 目錄：產品照連到產品頁，並歸在萬向系列
const cat = getCatalog().categories.find((c) => c.slug === "retractable-belt-stanchions")!;
const item = cat.items.find((i) => i.code === "new-048-001");
assert.equal(item?.href, "/products/retractable-belt-stanchions/rs-258we");
assert.ok(cat.groups!.find((g) => g.id === "universal")!.items.includes(item!), "要歸在萬向系列");
// 色票說明圖不能變成目錄品項
assert.ok(!getCatalog().categories.some((c) => c.items.some((i) => i.image === "/products/rs-258we-colors.png")), "色票圖不能變成目錄品項");

console.log("OK");
