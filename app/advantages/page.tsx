// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入左文右圖頁首
import { PhotoHero } from "../components/AboutBlocks";
// 匯入證據帳本（專利與檢驗報告，點擊放大）
import EvidenceLedger from "../components/EvidenceLedger";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入進場動畫區塊
import RevealSection from "../components/RevealSection";
// 匯入專利與檢驗報告資料
import { patents, reach, reports } from "../lib/advantages";
// 匯入 SEO 工具
import { absoluteUrl, pageMetadata } from "../lib/site";
// 匯入共用樣式
import { container } from "../lib/ui";

// 頁面描述
const description =
  "國際認證：產品取得台灣、美國、日本、中國、德國、西班牙專利，並通過 SGS 耐久測試、REACH 檢測與金屬工業研究發展中心鹽霧試驗。";

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "國際認證｜多國專利・SGS 檢驗・台灣製造｜世紘興業",
  description,
  path: "/advantages",
});

// 國際認證頁
export default function AdvantagesPage() {
  return (
    <PageShell>
      {/* 結構化資料 */}
      <JsonLd data={[{ "@type": "WebPage", name: "國際認證", description, url: absoluteUrl("/advantages") }]} />

      {/* 頁首：滿版照片橫幅（AI 生成圖：檢驗實驗室裡的不鏽鋼伸縮帶欄柱） */}
      <PhotoHero
        crumbs={[{ name: "首頁", path: "/" }, { name: "國際認證", path: "/advantages" }]}
        eyebrow="Certifications"
        title="國際認證"
        subtitle="產品設計取得台灣、美國、日本、中國、德國、西班牙六國專利，耐用度、耐腐蝕與材料安全皆通過 SGS、TÜV 萊因與金屬工業研究發展中心檢驗。每一份報告，都可以在下方查證。"
        link={{ href: "#patents", label: "看專利與檢驗" }}
        image={{ src: "/about/certifications-lab.png", alt: "檢驗實驗室裡的鍍鉻伸縮帶欄柱，拉出紅色織帶，背景是拉力試驗機", position: "70% 65%" }}
      />

      {/* 專利報告與專業機構檢驗：證據帳本（數字旁就是出具機構與報告，捲動進場） */}
      <RevealSection id="patents" className={`${container} scroll-mt-24 pt-40 pb-40`}>
        {/* 舊錨點 #reports（關於頁連到這裡） */}
        <span id="reports" className="block scroll-mt-24" />
        {/* 章節標籤：織帶拉出＋宋體大字＋細線（與關於頁三個原則相同） */}
        <div className="flex items-center gap-5 sm:gap-7">
          <div data-reveal className="belt-strip belt-tag h-[30px] flex-none">
            <div aria-hidden="true" className="flex h-full items-center gap-10 pl-4">
              {Array.from({ length: 4 }, (_, i) => (
                <Image key={i} src="/brand/logo-shung-white.png" alt="" width={240} height={139} className="h-[62%] w-auto max-w-none flex-none" />
              ))}
            </div>
          </div>
          <h2 className="font-serif text-[clamp(30px,4.6vw,64px)] leading-[1.15] font-black tracking-[0.04em] text-brand-deep">專利報告與專業機構檢驗</h2>
          <div aria-hidden="true" className="h-px min-w-6 flex-1 bg-brand-deep/40" />
        </div>
        {/* 標語從左滑入，說明從右滑入 */}
        <div className="mt-12 flex flex-wrap items-end justify-between gap-8">
          <p data-reveal className="reveal reveal-left font-serif text-[clamp(34px,3.6vw,54px)] leading-[1.3] font-black">
            品質，
            <br />
            不只是我們說了算。
          </p>
          <p data-reveal className="reveal reveal-right max-w-[30em] text-base leading-[1.9] text-ink/80 delay-100">
            產品設計在六個國家取得專利，
            <br />
            耐用度、耐腐蝕與材料安全，
            <br />
            皆通過 SGS、TÜV&nbsp;萊因與金屬工業研究發展中心的檢驗。
          </p>
        </div>
        <EvidenceLedger
          patents={patents}
          rows={[
            { value: "10,000", unit: "次", claim: "織帶反覆拉出、收回一萬次，沒有損壞。", agency: "SGS", docs: [reports[0]] },
            { value: "24", unit: "小時", claim: "鋁材連續鹽水噴霧 24 小時，沒有可見腐蝕。", agency: "金屬工業研究發展中心", docs: [reports[3], reports[4]] },
            { value: "138", unit: "項", claim: "織帶通過 138 項高關注物質（SVHC）檢測。", agency: "SGS · TÜV", docs: [reports[2], reports[1], reach] },
          ]}
        />
      </RevealSection>
    </PageShell>
  );
}
