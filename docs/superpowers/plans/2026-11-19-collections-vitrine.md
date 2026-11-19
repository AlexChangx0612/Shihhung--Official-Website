# 首頁玻璃展示櫃輪播＋/products 產品牆頁 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 首頁「產品系列」換成 13 張玻璃卡片的無縫循環輪播，原本的產品牆搬到新頁 `/products`。

**Architecture:** 卡片資料與循環計算放純函式（`app/lib/collections.ts`，可用斷言腳本測）；輪播是 client 元件 `CollectionsVitrine`，用原生橫向捲動＋scroll-snap，前後複製一組卡片做無縫循環；樣式放同名 CSS module。`/products` 只是 `PageShell` 包住現有 `ProductCatalog`。

**Tech Stack:** Next.js 16.3.5（App Router，先讀 `node_modules/next/dist/docs/` 相關章節，AGENTS.md 要求）、React 19、Tailwind v4、CSS modules。測試沿用專案慣例：`scripts/check-*.mts` 斷言腳本，`npx tsx` 執行，通過印 `OK`。

**Spec:** `docs/superpowers/specs/2026-11-19-collections-vitrine-design.md`

## Global Constraints

- 不新增 npm 套件。
- 13 張卡片等大、同一水平線；一次可見：電腦 4、平板（≤1024px）3、手機（≤640px）1.6。
- 一次捲動一張卡（卡寬＋間距）；最後一張按右→第一張，第一張按左→最後一張，跳回時肉眼看不到。
- 款數取 `getCatalog()` 實際品項數，不寫死。
- 卡片圖：`/cutouts/{slug}.png`；連結：`/products/{slug}`。
- 平板與手機隱藏英文簡稱。
- 背景 LOGO 一律用 `public/brand/logo-shung.svg`（向量），4 個：位置 (10%,78%) (46%,22%) (88%,60%) (66%,95%)、最大寬 340/210/380/150px、旋轉 −6°/5°/−3°/8°、透明度 .13/.11/.12/.09。
- 區塊標題「產品系列」；說明「13 大系列，全系列台灣製造。點選系列，查看該系列所有產品。」（「13」用實際系列數）；右上連結「查看所有系列」→ `/products`。
- 區塊保留 `id="collections"`（頁首與 404 頁連到 `/#collections`）。
- 程式註解用繁體中文，延續專案逐行註解風格。

## Review Focus

1. 手機慣性滑動進入複製區時才換位 → 不可在捲動途中瞬移造成跳動；只在捲動停止後（`scrollend`，不支援時 150ms debounce）換位。Task 2 Step 5 手動驗證。
2. 視窗縮放（轉手機橫直）改變一次可見張數 → 換位後仍對齊卡片邊緣、位置文字正確。Task 2 Step 5 手動驗證。
3. 複製卡片不可被 Tab 聚焦、不可被讀屏念出 → 複製卡片 `aria-hidden` + `inert`。Task 2 Step 5 用 Tab 走一輪驗證只會經過 13 張。
4. 未來新增第 14 個系列沒有英文簡稱對照 → 退回用 `en` 第一個字。Task 1 測試涵蓋。
5. 某系列缺去背圖 → 斷言腳本直接報錯，不讓破圖上線。Task 1 測試涵蓋。

---

### Task 1: 卡片資料與循環計算

**Files:**
- Create: `app/lib/collections.ts`
- Create: `scripts/check-collections.mts`

**Interfaces:**
- Produces:
  - `type CollectionCard = { slug: string; name: string; en: string; count: number; image: string; href: string }`
  - `getCollectionCards(): CollectionCard[]`（依 `getCatalog().categories` 順序）
  - `shortEn(slug: string, en: string): string`（查對照表，查不到回傳 `en.split(" ")[0]`）
  - `wrapIndex(i: number, n: number): number`（任何整數 i 轉成 0..n-1）
  - `rangeLabel(first: number, perView: number, total: number): string`（first 為 0 起算；回傳兩位數補零、可環繞，例 `rangeLabel(0,4,13)` → `"01 – 04 / 13"`）

英文簡稱對照（照展示稿）：retractable-belt-stanchions RETRACTABLE、rope-stanchions ROPE、exhibition-stanchions EXHIBITION、plastic-stanchions PLASTIC、barriers BARRIERS、poster-sign-stands SIGNS、bulletin-boards BOARDS、digital-signage-lightbox SIGNAGE、waste-recycling WASTE、cleaning-hygiene HYGIENE、umbrella-stands UMBRELLA、carts-tool-carts CARTS、key-boxes KEY BOXES。

- [ ] **Step 1: 寫斷言腳本 `scripts/check-collections.mts`**

```ts
const cards = getCollectionCards();
assert.equal(cards.length, getCatalog().categories.length);
assert.equal(cards.length, 13);
const ret = cards[0];
assert.deepEqual(
  { slug: ret.slug, name: ret.name, en: ret.en, image: ret.image, href: ret.href },
  { slug: "retractable-belt-stanchions", name: "伸縮帶欄柱", en: "RETRACTABLE", image: "/cutouts/retractable-belt-stanchions.png", href: "/products/retractable-belt-stanchions" },
);
for (const c of cards) {
  assert.equal(c.count, getCatalog().categories.find((x) => x.slug === c.slug)!.items.length);
  assert.ok(c.count > 0, `${c.slug} 要有品項`);
  assert.ok(fs.existsSync(path.join("public", c.image)), `${c.image} 去背圖要存在`);
}
assert.equal(cards.find((c) => c.slug === "key-boxes")!.en, "KEY BOXES");
assert.equal(shortEn("new-thing", "NEW THING STANDS"), "NEW");
assert.deepEqual([-1, 0, 12, 13, 27].map((i) => wrapIndex(i, 13)), [12, 0, 12, 0, 1]);
assert.equal(rangeLabel(0, 4, 13), "01 – 04 / 13");
assert.equal(rangeLabel(11, 4, 13), "12 – 02 / 13");
assert.equal(rangeLabel(12, 1, 13), "13 – 13 / 13");
console.log("OK");
```

- [ ] **Step 2: 執行，確認失敗**

Run: `npx tsx scripts/check-collections.mts`
Expected: 失敗，找不到 `../app/lib/collections`

- [ ] **Step 3: 實作 `app/lib/collections.ts`**（伺服器端資料：會讀檔，只在 server component 呼叫 `getCollectionCards`；`wrapIndex`／`rangeLabel` 是純函式，client 元件可匯入——若匯入會把 `fs` 帶進 client bundle，就把這兩個純函式拆到 `app/lib/collections-math.ts`，介面不變）

- [ ] **Step 4: 執行，確認通過**

Run: `npx tsx scripts/check-collections.mts`
Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add app/lib/collections.ts scripts/check-collections.mts
git commit -m "新增產品系列卡片資料與輪播循環計算"
```

### Task 2: 玻璃展示櫃輪播元件＋首頁換上

**Files:**
- Create: `public/brand/logo-shung.svg`（從 brainstorm 產出的 `logo-shung.svg` 複製；來源 PDF 見 spec）
- Create: `app/components/CollectionsVitrine.tsx`（`"use client"`）
- Create: `app/components/CollectionsVitrine.module.css`
- Modify: `app/page.tsx:66-76`（`#collections` 區塊）

**Interfaces:**
- Consumes: `CollectionCard`, `getCollectionCards()`, `wrapIndex`, `rangeLabel`（Task 1）
- Produces: `export default function CollectionsVitrine({ cards }: { cards: CollectionCard[] })`

視覺數值全部照 spec「已確認的設計」與展示稿 `vitrine-ui-v3.html`（brainstorm content 資料夾），包含玻璃漸層、內陰影、反光、hover、焦點外框、`prefers-reduced-motion`。

循環做法（實作者無法從簽名推得，故寫明）：
- 軌道 DOM＝`[複製全部 13 張] [真 13 張] [複製全部 13 張]`；複製卡片加 `aria-hidden="true"` 與 `inert`。
- 掛載後把 `scrollLeft` 設到真卡第一張（不帶動畫：暫時設 `scroll-behavior: auto`）。
- 按鈕：`scrollBy({ left: ±step, behavior: "smooth" })`，`step` = 第一張卡寬 + gap，每次點擊時重新量。
- 捲動停止後（`scrollend`；不支援時 150ms debounce）：`idx = Math.round(scrollLeft / step)`；若 `idx < 13` 或 `idx >= 26`，不帶動畫地 `scrollLeft += (idx < 13 ? +13 : -13) * step`。
- 位置文字：`rangeLabel(wrapIndex(idx - 13, 13), perView, 13)`，`perView = Math.round(clientWidth / step)`；`aria-live="polite"`。
- 軌道 `onKeyDown`：ArrowLeft／ArrowRight 等同按鈕。
- 按鈕永不 disabled（循環）。

- [ ] **Step 1: 複製 SVG 到 `public/brand/logo-shung.svg`，確認存在**

Run: `Test-Path public/brand/logo-shung.svg`
Expected: `True`

- [ ] **Step 2: 實作 `CollectionsVitrine.tsx` 與 `CollectionsVitrine.module.css`**（卡片用 `next/image`，`sizes` 依可見張數：`(max-width:640px) 60vw, (max-width:1024px) 33vw, 25vw`；LOGO 用 `<img>` 或 `next/image unoptimized` 皆可，SVG 不需最佳化）

- [ ] **Step 3: 首頁換上**：`app/page.tsx` 移除 `CollectionsSpotlight`、`ProductCatalog` 的 import 與使用，區塊內改 `<CollectionsVitrine cards={getCollectionCards()} />`；`section` 保留 `id="collections"` 與 scroll-mt；區塊背景交給元件（移除該 section 的 `py-*` 若與元件重複）。`mosaic` 與 `links` 仍供 HeroMosaic／SiteHeader 使用，保留。

- [ ] **Step 4: 型別與 lint**

Run: `npx tsc --noEmit; npm run lint`
Expected: 無錯誤

- [ ] **Step 5: 在開發伺服器手動驗證（http://localhost:3000）**

逐項確認：電腦 4／平板 3／手機 1.6 張；按右 13 次回到「01 – 04 / 13」且畫面不閃；在第一張按左顯示「13 – 03 / 13」；手機手指快速滑過頭再停下，不會跳一下；縮放視窗後按鈕仍對齊卡片；Tab 只經過 13 張卡片再到右按鈕；LOGO 在 2 倍縮放下邊緣銳利；點卡片進對應系列頁。

- [ ] **Step 6: Commit**

```bash
git add public/brand/logo-shung.svg app/components/CollectionsVitrine.tsx app/components/CollectionsVitrine.module.css app/page.tsx
git commit -m "首頁產品系列改成玻璃展示櫃輪播，背景改用向量 LOGO"
```

### Task 3: /products 產品牆頁＋移除舊元件

**Files:**
- Create: `app/products/page.tsx`
- Modify: `app/sitemap.ts:12-22`（在 `/faq` 後加 `"/products"`）
- Delete: `app/components/CollectionsSpotlight.tsx`、`app/lib/spotlight.ts`
- Modify → Rename: `scripts/check-spotlight.mts` → `scripts/check-rs258we.mts`（刪掉 spotlight 匯入與第 26–38 行「輪播資料」「首頁系列標籤」斷言；保留 RS-258WE 產品頁與目錄斷言）

**Interfaces:**
- Consumes: 現有 `PageShell`、`Breadcrumbs`、`ProductCatalog({ categories })`、`getCatalog()`、`pageMetadata`、`container`／`wide`

頁面內容：`PageShell` → 文字頁首（`Breadcrumbs` 「首頁 › 產品系列」路徑 `/products`、h1「產品系列」、說明「{n} 大系列，全系列台灣製造。選擇左側系列，瀏覽該系列所有產品。」）→ `<div className={wide}><ProductCatalog categories={categories} /></div>`。metadata：title「產品系列｜全系列產品目錄｜世紘興業」，path `/products`。頁首上方留白比照其他內頁（PhotoHero 的 `pt-24 sm:pt-28 lg:pt-44`）。

- [ ] **Step 1: 建立頁面並更新 sitemap**

- [ ] **Step 2: 刪除舊元件、改名並修剪斷言腳本**

- [ ] **Step 3: 跑全部斷言腳本**

Run: `npx tsx scripts/check-collections.mts; npx tsx scripts/check-rs258we.mts; npx tsx scripts/check-cases.mts; npx tsx scripts/check-product-text.mts`
Expected: 每支都印 `OK`

- [ ] **Step 4: 正式建置**

Run: `npm run build`
Expected: 建置成功，路由清單含 `/products`

- [ ] **Step 5: 手動驗證**：`/products` 左側清單切換、商品點進產品頁都正常；首頁「查看所有系列」連到 `/products`；`/sitemap.xml` 含 `/products`。

- [ ] **Step 6: Commit**

```bash
git add -A app/products/page.tsx app/sitemap.ts app/components/CollectionsSpotlight.tsx app/lib/spotlight.ts scripts/check-spotlight.mts scripts/check-rs258we.mts docs/superpowers
git commit -m "新增 /products 產品牆頁，移除首頁舊的系列聚光燈"
```
