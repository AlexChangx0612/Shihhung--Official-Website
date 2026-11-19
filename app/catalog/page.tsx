// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入滿版照片頁首與玻璃按鈕
import { GlassShine, PhotoHero, glassBtn } from "../components/AboutBlocks";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入 SEO 工具
import { absoluteUrl, pageMetadata } from "../lib/site";
// 匯入共用樣式
import { card, container, outlineBtn } from "../lib/ui";

// 目錄 PDF（public/catalog 底下；換新版目錄時置換這個檔案即可）
const CATALOG_PDF = "/catalog/shihhung-catalog-2023.pdf";
// 下載時的預設檔名
const DOWNLOAD_NAME = "世紘興業產品目錄.pdf";
// 檔案大小（顯示用）
const FILE_SIZE = "46 MB";

// 頁面描述
const description = "線上瀏覽世紘興業產品電子目錄，涵蓋紅龍柱、伸縮帶欄柱、告示牌、展示設備與公共空間設備，可免費下載 PDF 版本。";

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "產品電子目錄｜線上瀏覽與 PDF 下載｜世紘興業",
  description,
  path: "/catalog",
});

// 下載圖示
function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3v12m0 0-5-5m5 5 5-5M4 21h16" />
    </svg>
  );
}

// 產品電子目錄頁
export default function CatalogPage() {
  return (
    <PageShell>
      {/* 結構化資料：目錄頁 */}
      <JsonLd data={[{ "@type": "WebPage", name: "產品電子目錄", description, url: absoluteUrl("/catalog") }]} />

      {/* 頁首：滿版照片橫幅（與其他內頁同一個元件），下載與另開視窗按鈕放在橫幅內 */}
      <PhotoHero
        crumbs={[{ name: "首頁", path: "/" }, { name: "產品電子目錄", path: "/catalog" }]}
        eyebrow="Catalog"
        title="產品電子目錄"
        subtitle={<>線上瀏覽世紘全系列產品，或下載 PDF 版本隨時查閱。<br className="max-sm:hidden" />詢價時提供目錄上的型號，專員可更快為您提供服務。</>}
        // 招牌在照片右上、型錄在下方中間：往上對齊避免切到招牌；手機往右移讓招牌露出
        image={{ src: "/catalog/catalog-hero-v5.png", alt: "展示洽談室的石桌上攤開世紘產品目錄與規格單，平板顯示新品頁面，後方木牆上掛著世紘興業有限公司招牌", position: "50% 20%", mobilePosition: "92% 50%" }}
        actions={
          <>
            <a href={CATALOG_PDF} download={DOWNLOAD_NAME} className={glassBtn}>
              <GlassShine />
              <span className="relative">
                <DownloadIcon />
              </span>
              <span className="relative">下載目錄</span>
              <span className="relative text-sm text-white/75">PDF・{FILE_SIZE}</span>
            </a>
            <a href={CATALOG_PDF} target="_blank" rel="noopener noreferrer" className={glassBtn}>
              <GlassShine />
              <span className="relative">另開視窗瀏覽</span>
              <span aria-hidden="true" className="relative">
                ↗
              </span>
            </a>
          </>
        }
      />

      <section className="pb-20 sm:pb-28">
        <div className={container}>
          {/* 電腦與平板：內嵌預覽（瀏覽器內建 PDF 檢視器，可翻頁、縮放） */}
          <div className={`mt-14 hidden overflow-hidden p-2 md:block ${card}`}>
            <iframe
              src={`${CATALOG_PDF}#view=FitH`}
              title="世紘興業產品電子目錄"
              className="h-[80vh] min-h-[640px] w-full rounded-[10px] bg-ivory"
            />
          </div>

          {/* 手機：多數手機瀏覽器無法內嵌 PDF，改為開啟／下載卡片 */}
          <div className={`mt-12 p-8 text-center md:hidden ${card}`}>
            <p className="font-display text-xs tracking-[0.35em] text-brand-deep">PDF</p>
            <p className="mt-3 text-xl tracking-[0.1em] text-ink">世紘興業產品目錄</p>
            <p className="mt-2 text-sm text-muted">檔案大小約 {FILE_SIZE}，建議使用 Wi-Fi 開啟</p>
            <a href={CATALOG_PDF} target="_blank" rel="noopener noreferrer" className={`${outlineBtn} mt-8 w-full`}>
              開啟目錄
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
