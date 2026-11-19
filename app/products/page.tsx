// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入滿版照片頁首
import { PhotoHero } from "../components/AboutBlocks";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入全系列商品目錄（左側系列清單＋右側商品圖片）
import ProductCatalog from "../components/ProductCatalog";
// 匯入產品目錄
import { getCatalog } from "../lib/products";
// 匯入 SEO 工具
import { absoluteUrl, ORG_ID, pageMetadata } from "../lib/site";
// 匯入共用樣式
import { wide } from "../lib/ui";

// 頁面描述
const description = "世紘興業全系列產品目錄：伸縮帶欄柱、迎賓欄柱、展覽佈展欄柱、拒馬、海報架・告示牌、佈告欄、垃圾桶、傘架與推車等，全系列台灣製造，點選系列瀏覽所有產品。";

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "產品系列｜全系列產品目錄｜世紘興業",
  description,
  path: "/products",
});

// 產品系列總覽頁（產品牆）
export default function ProductsPage() {
  // 讀取產品分類
  const { categories } = getCatalog();

  return (
    <PageShell>
      {/* 結構化資料：產品系列總覽 */}
      <JsonLd data={[{ "@type": "CollectionPage", name: "產品系列", description, url: absoluteUrl("/products"), publisher: { "@id": ORG_ID } }]} />

      {/* 頁首：滿版照片橫幅（與其他內頁同一個元件）；下方就是系列選單，不放按鈕 */}
      <PhotoHero
        crumbs={[{ name: "首頁", path: "/" }, { name: "產品系列", path: "/products" }]}
        eyebrow="Products"
        title="產品系列"
        // 系列數取實際分類數，不寫死
        subtitle={`${categories.length} 大系列，全系列台灣製造。選擇左側系列，瀏覽該系列所有產品。`}
        image={{
          src: "/product-heroes/products-overview.png",
          alt: "挑高中庭裡，伸縮帶欄柱以紅色織帶圍出動線，旁有數位看板，遠處有不鏽鋼垃圾桶、迎賓欄柱、給皂機與傘架",
          position: "50% 100%",
          mobilePosition: "72% 50%",
        }}
      />

      {/* 產品牆：滿版，左側系列清單、右側商品圖片（與標題的間距由目錄元件本身的 mt-14 提供） */}
      <section className="pb-20 sm:pb-28">
        <div className={wide}>
          <ProductCatalog categories={categories} />
        </div>
      </section>
    </PageShell>
  );
}
