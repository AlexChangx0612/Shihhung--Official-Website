// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入內頁外框
import PageShell from "./components/PageShell";
// 匯入放大鏡圖示
import { SearchIcon } from "./components/SiteSearch";
// 匯入共用樣式
import { container, pageTop } from "./lib/ui";

// 常用入口
const links = [
  { href: "/", label: "回首頁" },
  { href: "/products", label: "產品系列" },
  { href: "/contact", label: "聯絡我們" },
];

// 紅框紅字按鈕（同共用 outlineBtn），手機縮小左右留白與字距，讓三顆能並排
const btn =
  "inline-flex items-center justify-center border border-brand-deep px-2 py-3.5 text-sm tracking-[0.1em] text-brand-deep transition hover:bg-brand-deep hover:text-white sm:px-12 sm:tracking-[0.2em]";

// 中繼資料：404 頁不讓搜尋引擎收錄
export const metadata: Metadata = {
  title: { absolute: "找不到頁面｜世紘興業" },
  robots: { index: false, follow: true },
};

// 404 頁：網址有誤或頁面已移除時顯示；提供站內搜尋與常用入口
export default function NotFound() {
  return (
    <PageShell>
      <section className={`${pageTop} pb-20 sm:pb-28`}>
        <div className={`${container} flex flex-col items-center text-center`}>
          {/* 大大的紅色 404 */}
          <p className="text-[clamp(72px,12vw,160px)] leading-none font-bold tracking-[0.05em] text-brand-deep">404</p>
          <h1 className="mt-6 text-2xl tracking-[0.1em] sm:text-3xl">找不到這個頁面</h1>
          <p className="mt-4 text-sm leading-7 text-muted sm:text-base sm:leading-8">您要找的頁面可能已移除，或網址有誤。</p>

          {/* 搜尋框：送到站內搜尋頁，與搜尋頁相同樣式 */}
          <form role="search" action="/search" className="mt-12 flex w-full max-w-xl items-center gap-3 border-b border-ink/20 pb-2 text-left focus-within:border-brand-deep">
            <SearchIcon className="h-6 w-6 shrink-0 text-brand-deep" />
            <input
              type="search"
              name="q"
              placeholder="搜尋產品名稱或型號"
              aria-label="搜尋關鍵字"
              className="min-w-0 flex-1 bg-transparent py-2 text-lg tracking-[0.08em] outline-none placeholder:text-muted/60 [&::-webkit-search-cancel-button]:hidden"
            />
            <button type="submit" className="min-h-11 shrink-0 px-2 text-sm tracking-[0.2em] text-brand-deep">
              搜尋
            </button>
          </form>

          {/* 常用入口：手機三欄等寬並排（縮小左右留白），平板以上沿用紅框按鈕寬度 */}
          <div className="mt-12 grid w-full max-w-xl grid-cols-3 gap-2 sm:flex sm:w-auto sm:max-w-none sm:justify-center sm:gap-4">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={btn}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
