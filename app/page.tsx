// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入客戶實際案例弧形輪播
import CaseCarousel from "./components/CaseCarousel";
// 匯入「產品系列」玻璃展示櫃輪播
import CollectionsVitrine from "./components/CollectionsVitrine";
// 匯入聯絡區塊
import ContactSection from "./components/ContactSection";
// 匯入常見問題清單
import FaqList from "./components/FaqList";
// 匯入結構化資料元件
import JsonLd from "./components/JsonLd";
// 匯入首屏主視覺（超大標題＋無限捲動磚牆）
import HeroMosaic from "./components/HeroMosaic";
// 匯入區塊標題元件
import SectionTitle from "./components/SectionTitle";
// 匯入頁尾
import SiteFooter from "./components/SiteFooter";
// 匯入頁首
import SiteHeader from "./components/SiteHeader";
// 匯入讀取產品圖片的函式
import { getCatalog } from "./lib/products";
// 匯入系列卡片資料（伺服器端讀檔）
import { getCollectionCards } from "./lib/collections";
// 匯入客戶實際案例資料（置換照片與說明請改這個檔案）
import { cases } from "./lib/cases";
// 匯入首頁常見問題
import { homeFaqs } from "./lib/faq";
// 匯入 SEO 工具
import { faqJsonLd, HOME_DESCRIPTION, HOME_TITLE, ORG_ID, organizationJsonLd, pageMetadata, SITE_URL } from "./lib/site";
// 匯入共用樣式
import { container } from "./lib/ui";

// 首頁標題、描述與 canonical
export const metadata: Metadata = pageMetadata({ title: HOME_TITLE, description: HOME_DESCRIPTION, path: "/" });

// 首頁
export default function Home() {
  // 讀取產品分類
  const { categories } = getCatalog();
  // 只取分類的 id、網址代號與名稱，傳給頁首使用
  const links = categories.map(({ id, slug, name }) => ({ id, slug, name }));
  // 首屏磚牆用的產品照：各分類第一張
  const mosaic = categories.map((c) => c.images[0]);

  // 回傳整個首頁
  return (
    // 暖白底、主要文字顏色
    <div className="bg-paper text-ink">
      {/* 結構化資料：公司、網站、常見問題 */}
      <JsonLd
        data={[
          organizationJsonLd(),
          { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "世紘興業", url: `${SITE_URL}/`, inLanguage: "zh-Hant-TW", publisher: { "@id": ORG_ID } },
          faqJsonLd(homeFaqs),
        ]}
      />
      {/* 頁首 */}
      <SiteHeader categories={links} />

      {/* 主要內容 */}
      <main>
        {/* 首屏：超大標題＋無限捲動磚牆 */}
        <HeroMosaic images={mosaic} />

        {/* 產品系列：13 張玻璃展示櫃卡片的循環輪播，點卡片進系列頁；全部產品牆在 /products */}
        {/* 緊接首屏，首屏「尋找產品」直接到這裡；上方有分隔線；scroll-mt 讓錨點跳轉時不被固定的 header 擋住；上下留白與背景由元件負責 */}
        <section id="collections" aria-labelledby="collections-title" className="scroll-mt-20 sm:scroll-mt-24 border-t border-line">
          <CollectionsVitrine cards={getCollectionCards()} />
        </section>

        {/* 客戶實際案例：弧形輪播（上方有分隔線，與其他區塊一致） */}
        <div className="border-t border-line">
          <CaseCarousel cases={cases} />
        </div>

        {/* 常見問題（上方有分隔線）：手機上下排列，電腦左標題右問答 */}
        <section id="faq" className="scroll-mt-20 sm:scroll-mt-24 border-t border-line py-20 sm:py-28">
          <div className={`${container} grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20`}>
            <SectionTitle align="left" title="常見問題" desc="關於欄柱選擇、數量估算與採購的常見問題。" />
            <FaqList faqs={homeFaqs} />
          </div>
        </section>

        {/* 聯絡 */}
        <ContactSection />
      </main>

      {/* 頁尾 */}
      <SiteFooter />
    </div>
  );
}
