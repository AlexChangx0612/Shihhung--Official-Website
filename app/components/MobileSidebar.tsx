// 標記為瀏覽器端元件（需要目前網址）
"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入目前網址 hook
import { usePathname } from "next/navigation";
// 匯入分類連結型別
import type { CategoryLink } from "../lib/ui";
// 匯入公司聯絡資料（電話、LINE、Email）
import { company } from "../lib/site";

// 彈簧曲線：滑入快速到位、微微回彈
const spring = "ease-[cubic-bezier(.22,1.12,.36,1)]";

// 鍵盤聚焦外框（深品牌紅）
const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-deep";

// 底部 Dock 的圖示按鈕：三顆等寬、高 48px 的膠囊
const dockBtn = `flex h-12 flex-1 items-center justify-center rounded-full transition-[background,filter] ${focusRing}`;

// 玻璃膠囊按鈕的共用樣式；active 為目前頁面（最亮的膠囊＋紅字）
function pill(active: boolean) {
  return `glass-pill rounded-full font-medium transition-[background,color] ${focusRing} ${
    active ? "glass-pill-on text-brand-deep" : "text-ink hover:glass-pill-on hover:text-brand-deep"
  }`;
}

// 右箭頭小圖示（頁面膠囊右側）
function Chevron() {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" aria-hidden="true" className="shrink-0 opacity-40">
      <path d="M1 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// 打開時逐項由左淡入（每項延遲 25ms）
function fadeIn(open: boolean, index: number) {
  return {
    className: `transition-[opacity,transform] duration-500 ${spring} ${open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"}`,
    style: { transitionDelay: open ? `${120 + index * 25}ms` : "0ms" },
  };
}

// 手機、平板（1024px 以下，主選單收起時）的側欄選單：液態玻璃面板浮在網頁上，從左側以彈簧動態滑入
// 面板與所有按鈕皆為玻璃膠囊；目前頁面為最亮的膠囊＋紅字；底部固定紅色電話膠囊
export default function MobileSidebar({
  open,
  onClose,
  pages,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  pages: { href: string; label: string }[];
  categories: CategoryLink[];
}) {
  // 目前網址（判斷選中項目）
  const pathname = usePathname();
  // 頁面清單：「產品系列」已有下方的系列清單，不重複列出
  const links = pages.filter((p) => p.href !== "/#collections");

  return (
    // 覆蓋整個畫面，層級高於 header；關閉時保留在畫面上做收合動畫，但不可點擊、不可聚焦
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} inert={!open}>
      {/* 淡色遮罩（讓背後網頁透過玻璃仍看得見），點擊關閉 */}
      <button
        type="button"
        aria-label="關閉選單"
        onClick={onClose}
        className={`absolute inset-0 bg-ink/15 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      {/* 玻璃面板：四周留 10px、大圓角，從左側滑入（彈簧曲線）；中間內容可捲動，電話固定在底部 */}
      <nav
        aria-label="選單"
        className={`glass-panel absolute inset-y-2.5 left-2.5 flex w-[calc(86%-10px)] max-w-sm flex-col overflow-hidden rounded-[32px] transition-transform duration-[600ms] ${spring} ${
          open ? "translate-x-0" : "-translate-x-[calc(100%+20px)] duration-300 ease-in"
        }`}
      >
        {/* 面板上緣的反光 */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-linear-to-b from-white/35 to-transparent" />

        {/* 頂部：LOGO（回首頁）與玻璃圓形關閉鈕 */}
        <div className="relative flex items-center justify-between gap-4 pt-3.5 pr-3.5 pb-3 pl-5">
          <Link href="/" onClick={onClose} aria-label="世紘興業 回到首頁" className={`flex min-h-11 items-center gap-2.5 rounded-full ${focusRing}`}>
            <Image src="/brand/logo-shung-red.png" alt="" width={240} height={139} className="h-6 w-auto" />
            <span className="text-base font-bold tracking-[0.12em] text-brand-deep">世紘興業</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉選單"
            className={`grid size-11 shrink-0 place-items-center ${pill(false)}`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        {/* 可捲動的內容 */}
        <div className="relative flex-1 overflow-y-auto overscroll-contain px-3.5 pt-1 pb-4 [scrollbar-width:thin]">
          {/* 網站頁面：一條條玻璃膠囊 */}
          <ul className="flex flex-col gap-[7px]">
            {links.map((p, i) => {
              const active = pathname === p.href;
              const fx = fadeIn(open, i);
              return (
                <li key={p.href} className={fx.className} style={fx.style}>
                  <Link
                    href={p.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-12 items-center justify-between gap-4 pr-[18px] pl-5 text-base ${pill(active)}`}
                  >
                    {p.label}
                    <Chevron />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* 產品系列：玻璃膠囊，左側圓形產品去背圖 */}
          <section className="mt-5" aria-labelledby="drawer-collections">
            <h2 id="drawer-collections" className="mx-2 mb-2 text-sm font-medium text-ink/75">
              產品系列
            </h2>
            <ul className="flex flex-col gap-[7px]">
              {categories.map((c, i) => {
                const href = `/products/${c.slug}`;
                const active = pathname.startsWith(href);
                const fx = fadeIn(open, links.length + i);
                return (
                  <li key={c.id} className={fx.className} style={fx.style}>
                    <Link
                      href={href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={`flex h-[52px] items-center gap-3 pr-[18px] pl-[5px] text-[15.5px] ${pill(active)}`}
                    >
                      {/* 白色圓形縮圖 */}
                      <span className="relative size-[42px] shrink-0 rounded-full bg-white/85 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.9)]">
                        <Image src={`/cutouts/${c.slug}.png`} alt="" fill sizes="42px" className="object-contain p-1.5" />
                      </span>
                      {c.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {/* 全系列產品頁 */}
            <Link
              href="/products"
              onClick={onClose}
              className={`glass-pill mt-[7px] flex h-12 items-center justify-center gap-2 rounded-full text-sm font-medium text-brand-deep transition-[background] hover:glass-pill-on ${focusRing}`}
            >
              查看所有產品
              <Chevron />
            </Link>
          </section>
        </div>

        {/* 底部固定：玻璃 Dock，電話／LINE／Email 三個圖示按鈕 */}
        <div className="relative px-3.5 pt-2.5 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
          <div className="glass-pill flex gap-1.5 rounded-full p-1.5">
            {/* 電話：紅色膠囊，點擊撥號 */}
            <a
              href={company.phoneHref}
              aria-label={`撥打電話 ${company.phone}`}
              className={`glass-pill-red ${dockBtn} text-white hover:brightness-105 active:brightness-95`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
              </svg>
            </a>
            {/* LINE 官方帳號：另開新分頁加入好友 */}
            <a
              href={company.line}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="加入世紘 LINE 官方帳號（另開新視窗）"
              className={`${dockBtn} hover:bg-white/70`}
            >
              <Image src="/brand/line-icon.png" alt="" width={1024} height={1024} className="size-7 rounded-[7px]" />
            </a>
            {/* Email：點擊開啟寄信程式 */}
            <a href={`mailto:${company.email}`} aria-label={`寄信到 ${company.email}`} className={`${dockBtn} text-ink hover:bg-white/70`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
              </svg>
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
