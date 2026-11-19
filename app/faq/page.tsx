// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入滿版照片頁首
import { PhotoHero } from "../components/AboutBlocks";
// 匯入常見問題清單
import FaqList from "../components/FaqList";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入常見問題資料（與首頁「常見問題」共用）
import { homeFaqs } from "../lib/faq";
// 匯入 SEO 工具
import { absoluteUrl, faqJsonLd, pageMetadata } from "../lib/site";
// 匯入共用樣式
import { container } from "../lib/ui";

// 頁面描述
const description = "世紘興業常見問題：紅龍柱與伸縮帶欄柱的差別、織帶長度怎麼選、客製企業 Logo、戶外使用、場地需要幾支欄柱與採購方式。";

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "常見問題｜欄柱選擇、數量估算與採購｜世紘興業",
  description,
  path: "/faq",
});

// 常見問題頁
export default function FaqPage() {
  return (
    <PageShell>
      {/* 結構化資料：常見問題頁 */}
      <JsonLd data={[{ "@type": "WebPage", name: "常見問題", description, url: absoluteUrl("/faq") }, faqJsonLd(homeFaqs)]} />

      {/* 頁首：滿版照片橫幅（與其他內頁同一個元件） */}
      <PhotoHero
        crumbs={[{ name: "首頁", path: "/" }, { name: "常見問題", path: "/faq" }]}
        eyebrow="FAQ"
        title="常見問題"
        // 副標分兩行，讓文字停在照片左側的窗景，不壓到右邊的盆栽與欄柱
        subtitle={<>關於欄柱選擇、數量估算與採購的常見問題。<br className="max-sm:hidden" />找不到答案時，歡迎直接聯絡專員。</>}
        // 對齊左邊：畫面變窄時從右邊裁，產品不會被推到文字底下
        image={{ src: "/faq/faq-hero-v2.png", alt: "高樓層展示洽談室，石材會議桌上放著型錄、場地平面圖與織帶色樣，後方整齊陳列伸縮帶欄柱、展覽欄柱與數位看板", position: "0% 50%" }}
      />

      {/* 問答清單 */}
      <section className={`${container} pt-16 pb-20 sm:pb-28 lg:pt-24`}>
        <div className="mx-auto max-w-4xl">
          <FaqList faqs={homeFaqs} />
        </div>
      </section>
    </PageShell>
  );
}
