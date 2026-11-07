// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入麵包屑
import Breadcrumbs from "../components/Breadcrumbs";
// 匯入固定大圖舞台
import CaseStage from "../components/CaseStage";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入客戶實際案例資料（置換照片與說明請改這個檔案；總覽頁挑選的照片在 lib/case-stage.ts）
import { cases } from "../lib/cases";
// 匯入 SEO 工具
import { pageMetadata } from "../lib/site";
// 匯入共用樣式
import { container, outlineBtn, pageTop } from "../lib/ui";

// 中繼資料
// CMS 完成、網站正式上線前先不讓搜尋引擎收錄、也不列入 sitemap；上線時移除 robots 這一行，並把 /cases 與各案例頁加進 app/sitemap.ts
export const metadata: Metadata = {
  ...pageMetadata({
    title: "客戶實際案例｜紅龍柱與公共空間設備應用｜世紘興業",
    description: "世紘興業的客戶實際案例：經國七海文化園區、竹林山觀音寺、台南天壇、連江縣政府、小米門市與台鋼雄鷹的欄柱與拒馬應用。",
    path: "/cases",
  }),
  robots: { index: false, follow: true },
};

// 客戶實際案例總覽頁
export default function CasesPage() {
  return (
    <PageShell>
      <section className={`${pageTop} pb-24 sm:pb-32`}>
        {/* 頁首：麵包屑、靠左大標、一句說明 */}
        <div className={container}>
          <Breadcrumbs items={[{ name: "首頁", path: "/" }, { name: "客戶實際案例", path: "/cases" }]} />
          <h1 className="mt-10 max-w-[13em] text-[clamp(38px,5.4vw,80px)] leading-[1.12] font-black text-balance">走進各種場域，都能看見世紘的產品</h1>
          <p className="mt-8 max-w-[30em] text-[clamp(18px,1.4vw,21px)] leading-[1.8] text-muted">
            從文化園區、寺廟、政府機關到門市與職業球團。往下捲動，一個一個走進世紘的欄柱與拒馬站著的地方。
          </p>
        </div>

        {/* 案例：電腦版左側固定大圖、右側捲動清單 */}
        <CaseStage cases={cases} />

        {/* 行動按鈕：連到聯絡我們頁 */}
        <div className={`${container} mt-24 text-center`}>
          <Link href="/contact" className={outlineBtn}>
            請專員規劃我的場地
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
