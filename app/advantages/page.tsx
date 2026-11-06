// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入左文右圖頁首
import { SplitHero } from "../components/AboutBlocks";
// 匯入客製織帶牆
import BeltWall from "../components/BeltWall";
// 匯入數字滾動
import CountUp from "../components/CountUp";
// 匯入證據帳本（專利與檢驗報告，點擊放大）
import EvidenceLedger from "../components/EvidenceLedger";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入進場動畫區塊
import RevealSection from "../components/RevealSection";
// 匯入優勢、專利與檢驗報告資料
import { advantages, patents, reach, reports } from "../lib/advantages";
// 匯入產品目錄
import { getCatalog } from "../lib/products";
// 匯入 SEO 工具
import { absoluteUrl, pageMetadata } from "../lib/site";
// 匯入共用樣式
import { container, solidBtn, textLink } from "../lib/ui";

// 頁面描述
const description =
  "世紘優勢：資深專員一對一服務、企業識別客製、全系列台灣製造，產品取得台灣、美國、日本、中國、德國、西班牙專利，並通過 SGS 耐久測試、REACH 檢測與金屬工業研究發展中心鹽霧試驗。";

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "世紘優勢｜專利認證・SGS 檢驗・台灣製造｜世紘興業",
  description,
  path: "/advantages",
});

// 頁首的三份檢驗報告（中間一張往下錯開）
const heroReports = [reports[0], reports[3], reports[1]];

// 區塊大標題
const h2 = "text-[clamp(30px,3vw,44px)] leading-[1.3] font-bold";

// 世紘優勢頁
export default function AdvantagesPage() {
  // 產品系列數（帶入「全系列台灣製造」內文）
  const series = getCatalog().categories.length;

  return (
    <PageShell>
      {/* 結構化資料 */}
      <JsonLd data={[{ "@type": "WebPage", name: "世紘優勢", description, url: absoluteUrl("/advantages") }]} />

      {/* 頁首：左文右圖（三份檢驗報告） */}
      <SplitHero
        crumbs={[{ name: "首頁", path: "/" }, { name: "世紘優勢", path: "/advantages" }]}
        title="世紘優勢"
        subtitle="資深專員一對一服務、企業識別客製、全系列台灣製造。每一項品質宣稱，都附上可以查證的專利與檢驗報告。"
        link={{ href: "#patents", label: "看專利與檢驗" }}
      >
        <figure>
          <div className="grid grid-cols-3 items-start gap-3 bg-[#e6e2da] p-6 sm:gap-6 sm:p-14">
            {heroReports.map((r, i) => (
              <div key={r.src} className={`relative bg-white ${i === 1 ? "mt-8" : ""}`} style={{ aspectRatio: `${r.width} / ${r.height}` }}>
                <Image src={r.src} alt={r.title} fill preload={i === 0} sizes="(min-width: 1024px) 18vw, 30vw" className="object-cover" />
              </div>
            ))}
          </div>
          <figcaption className="mt-3 text-[15px] text-muted">SGS 與金屬工業研究發展中心出具的檢驗報告</figcaption>
        </figure>
      </SplitHero>

      {/* 三項優勢：圖文左右交錯（第 2 項圖在左） */}
      <section className={`${container} pt-40`}>
        <h2 className={h2}>選擇世紘，我們給您三個承諾</h2>
        {advantages.map((a, i) => {
          const flip = i % 2 === 1;
          return (
            <div key={a.title} className={`flex flex-wrap items-center gap-14 ${i === 0 ? "mt-16" : "mt-28"} ${flip ? "flex-wrap-reverse" : ""}`}>
              <div className={`min-w-0 flex-[1_1_360px] ${flip ? "order-2" : ""}`}>
                <h3 className="text-[clamp(28px,2.6vw,38px)] font-bold">{a.title}</h3>
                <p className="mt-5 max-w-[30em] text-base leading-[1.8]">{a.body.replace("{series}", String(series))}</p>
                <Link href={a.href} className={`${textLink} mt-6`}>
                  {a.cta} →
                </Link>
              </div>
              <div className={`grid min-w-0 flex-[1.5_1_520px] gap-4 ${a.images.length > 1 ? "grid-cols-2" : ""} ${flip ? "order-1" : ""}`}>
                {a.images.map((img) => (
                  <div key={img.src} className="relative" style={{ aspectRatio: img.ratio }}>
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes={a.images.length > 1 ? "(min-width: 1024px) 30vw, 50vw" : "(min-width: 1024px) 60vw, 100vw"}
                      className={img.contain ? "object-contain" : "object-cover"}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* 客製織帶牆：深色底，讓五顏六色的織帶當主角 */}
      <section id="belts" className="mt-28 scroll-mt-24 bg-[#181818] py-28 text-white">
        <div className={`${container} flex flex-wrap items-end justify-between gap-8`}>
          <div className="min-w-0 flex-[1_1_520px]">
            <h2 className={h2}>
              <CountUp value="61" /> 款客製織帶，都出自世紘
            </h2>
            <p className="mt-5 max-w-[36em] text-base leading-[1.8]">
              從 gogoro、Dyson、McLaren、太魯閣購物中心，到竹林山觀音寺、高雄捷運與苗栗警察分局。每一條都是我們為客戶印製、實際上線的伸縮帶。
            </p>
          </div>
          <a href="#contact" className={solidBtn}>
            印上您的品牌
          </a>
        </div>
        <div className="mt-16">
          <BeltWall label="世紘歷年承接的 61 款客製伸縮帶印刷圖樣，包含 gogoro、Nike、小米、Dyson、McLaren、Longchamp、竹林山觀音寺、高雄捷運等" />
        </div>
      </section>

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
