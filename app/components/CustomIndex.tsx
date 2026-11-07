"use client";
// 客製選項總覽（目錄索引式）：電腦版左側為分組產品清單，點選後右側換成該產品的照片與客製選項；手機版清單改為橫向滑動按鈕
// 網址帶 #opt-<slug>（例如開場的產品捷徑）時，自動選好該產品
// 匯入 React 狀態與副作用
import { useEffect, useState } from "react";
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入案例資料
import { caseHref, cases } from "../lib/cases";
// 匯入客製選項
import { customGroups, customOptions } from "../lib/custom-options";
// 匯入共用樣式
import { textLink } from "../lib/ui";

// 總覽
export default function CustomIndex() {
  // 目前選的產品
  const [slug, setSlug] = useState(customOptions[0].slug);

  // 網址的 #opt-<slug> 改變時選好該產品（開場的產品捷徑會用到）
  useEffect(() => {
    const sync = () => {
      const m = window.location.hash.match(/^#opt-(.+)$/);
      if (m && customOptions.some((o) => o.slug === m[1])) setSlug(m[1]);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const o = customOptions.find((x) => x.slug === slug) ?? customOptions[0];
  // 相關案例（名稱與網址）
  const related = o.cases.map((s) => cases.find((c) => c.slug === s)).filter((c) => c !== undefined);

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      {/* 左：產品清單。手機為一排橫向滑動按鈕，電腦為分組直列 */}
      <nav aria-label="可客製的產品" className="lg:col-span-4">
        {/* 手機與平板 */}
        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:hidden">
          {customOptions.map((x) => (
            <button
              key={x.slug}
              type="button"
              aria-pressed={x.slug === slug}
              onClick={() => setSlug(x.slug)}
              className={`min-h-11 shrink-0 px-4 text-base whitespace-nowrap transition ${x.slug === slug ? "bg-ink text-white" : "bg-white text-ink"}`}
            >
              {x.name}
            </button>
          ))}
        </div>
        {/* 電腦 */}
        <div className="hidden flex-col gap-9 lg:flex">
          {customGroups.map((g) => (
            <div key={g.name}>
              <p className="text-sm text-muted">{g.name}</p>
              <ul className="mt-3 flex flex-col">
                {g.items.map((x) => {
                  const on = x.slug === slug;
                  return (
                    <li key={x.slug}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setSlug(x.slug)}
                        className={`group flex w-full items-center gap-4 py-2.5 text-left text-xl transition-colors duration-300 ${on ? "text-ink" : "text-ink/45 hover:text-ink"}`}
                      >
                        {/* 選中時左側出現紅線 */}
                        <span aria-hidden="true" className={`h-[3px] shrink-0 bg-brand-deep transition-[width] duration-300 ease-out ${on ? "w-6" : "w-0 group-hover:w-3"}`} />
                        {x.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* 右：目前產品的照片與客製選項（換產品時淡入） */}
      <div aria-live="polite" className="lg:col-span-8">
        <div key={o.slug} className="animate-[fade-in_0.45s_ease-out] motion-reduce:animate-none">
          {/* 照片：有客製作品照就用作品照，否則用白底去背產品圖 */}
          <div className="relative aspect-[4/3] overflow-hidden bg-white sm:aspect-[16/10]">
            {o.photo ? (
              <Image src={o.photo.src} alt={o.photo.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
            ) : (
              <Image src={`/cutouts/${o.slug}.png`} alt={`世紘${o.name}產品圖`} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-contain p-10 sm:p-16" />
            )}
          </div>

          {/* 產品名與客製選項 */}
          <div className="mt-10 grid gap-10 sm:grid-cols-[1.2fr_1fr_1fr]">
            <h3 className="text-[clamp(30px,3vw,44px)] leading-[1.15] font-black">{o.name}</h3>
            <div>
              <p className="text-sm text-muted">印標誌與文字</p>
              <ul className="mt-3 flex flex-col gap-2 text-lg">
                {o.print.map((v) => (
                  <li key={v} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.8em] h-[2px] w-3 shrink-0 bg-brand-deep" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm text-muted">顏色</p>
              <ul className="mt-3 flex flex-col gap-2 text-lg">
                {o.color.map((v) => (
                  <li key={v} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.8em] h-[2px] w-3 shrink-0 bg-brand-deep" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 看產品、相關案例 */}
          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
            <Link href={`/products/${o.slug}`} className={textLink}>
              看產品 →
            </Link>
            {related.length > 0 && (
              <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-base">
                <span className="text-muted">看案例</span>
                {related.map((c) => (
                  <Link key={c.slug} href={caseHref(c.slug)} className="underline underline-offset-4 transition hover:text-brand-deep">
                    {c.title}
                  </Link>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
