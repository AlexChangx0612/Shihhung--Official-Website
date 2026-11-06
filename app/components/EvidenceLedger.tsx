// 標記為瀏覽器端元件（需要記錄目前放大的報告）
"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 React 的副作用與狀態 hook
import { useEffect, useState } from "react";
// 匯入證書資料型別
import type { Certificate } from "../lib/advantages";
// 匯入數字滾動（與其他頁的數字相同效果）
import CountUp from "./CountUp";

// 證據帳本的一列：大數字＋宣稱＋出具機構＋報告
export type EvidenceRow = {
  value: string;
  unit: string;
  claim: string;
  agency: string;
  docs: Certificate[];
};

// 報告縮圖顯示第一頁上方的比例（抬頭與結論所在區）
const PEEK = 0.55;

// 證書圖：依 crop 裁掉底部倒影；unoptimized 直接輸出原檔，保留最清晰的畫質
function Doc({ c, sizes }: { c: Certificate; sizes: string }) {
  // 裁切後的高度
  const h = c.height * (c.crop ?? 1);
  return (
    <div className="overflow-hidden" style={{ aspectRatio: `${c.width} / ${h}` }}>
      <Image src={c.src} alt={`${c.title}${c.note ? `｜${c.note}` : ""}`} width={c.width} height={c.height} sizes={sizes} unoptimized className="h-auto w-full" />
    </div>
  );
}

// 放大檢視：同一筆證據的所有報告上下排列；Esc 或點背景關閉
function Lightbox({ title, docs, onClose }: { title: string; docs: Certificate[]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    // 鎖住背景捲動
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-50 flex animate-[fade-in_.25s_ease-out] flex-col bg-ink/90">
      {/* 標題列與關閉按鈕 */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 text-white sm:px-8">
        <p className="min-w-0 truncate text-sm tracking-[0.1em]">{title}</p>
        <button type="button" onClick={onClose} className="flex min-h-11 shrink-0 items-center gap-2 text-sm tracking-[0.15em]">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          關閉
        </button>
      </div>
      {/* 報告上下排列，可捲動；寬度不超過原圖像素 */}
      <div className="flex min-h-0 flex-1 flex-col items-center gap-6 overflow-auto px-4 pb-8 sm:px-8" onClick={onClose}>
        {docs.map((d) => (
          <div key={d.src} className="w-full rounded-[6px] bg-white p-3" style={{ maxWidth: d.width + 24 }} onClick={(e) => e.stopPropagation()}>
            <Doc c={d} sizes={`${d.width}px`} />
            <p className="mt-2 text-sm text-muted">
              {d.title}
              {d.note ? `｜${d.note}` : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 證據帳本：每個數字旁就是出具機構與報告；專利六國全部攤開，皆可放大
export default function EvidenceLedger({ rows, patents }: { rows: EvidenceRow[]; patents: Certificate[] }) {
  // 目前放大的證據；null 表示沒有
  const [open, setOpen] = useState<{ title: string; docs: Certificate[] } | null>(null);
  // 專利依國家分組，保留資料中的順序
  const countries = [...new Set(patents.map((p) => p.title))];
  // 數字列的版面：大數字／宣稱／報告縮圖
  const rowGrid = "grid items-center gap-x-10 gap-y-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_200px]";
  // 大數字樣式
  const bigNumber = "font-display text-[clamp(64px,8vw,120px)] font-bold tracking-[-0.03em] text-brand-deep tabular-nums";

  return (
    <>
      <ol className="mt-16 border-b border-ink/15">
        {rows.map((r) => (
          <li key={r.claim} className={`${rowGrid} border-t border-ink/15 py-10 lg:py-12`}>
            {/* 大數字：從左滑入 */}
            <p data-reveal className="reveal reveal-left flex items-baseline gap-2 leading-none">
              <span className={bigNumber}>
                <CountUp value={r.value} />
              </span>
              <span className="text-xl">{r.unit}</span>
            </p>
            {/* 宣稱與出處：從右滑入 */}
            <div data-reveal className="reveal reveal-right delay-100">
              <p className="text-xl leading-[1.6]">{r.claim}</p>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
                <span className="rounded-full border border-ink/25 px-2.5 py-0.5 font-display text-[12px] tracking-[0.12em] text-ink uppercase">{r.agency}</span>
                {/* 報告名稱去掉開頭的機構名，避免和標籤重複 */}
                {r.docs[0].title.replace(/^(SGS|金屬工業研究發展中心)\s*/, "")}
              </p>
            </div>
            {/* 報告縮圖：點擊放大 */}
            <button
              type="button"
              data-reveal
              onClick={() => setOpen({ title: `${r.value}${r.unit}｜${r.claim}`, docs: r.docs })}
              aria-label={`查看報告：${r.docs[0].title}`}
              className="reveal group relative w-[200px] justify-self-start delay-200 md:justify-self-end"
            >
              <span className="block overflow-hidden bg-white shadow-[0_12px_30px_-14px_rgba(0,0,0,0.45)] ring-1 ring-black/5 transition duration-300 group-hover:-translate-y-1 group-hover:rotate-0 md:rotate-[1.5deg]">
                <span className="relative block w-full" style={{ aspectRatio: `${r.docs[0].width} / ${r.docs[0].height * PEEK}` }}>
                  <Image src={r.docs[0].src} alt="" fill sizes="200px" className="object-cover object-top" />
                </span>
              </span>
              <span className="mt-3 flex items-center justify-between text-[13px]">
                <span className="text-muted">{r.docs.length > 1 ? `共 ${r.docs.length} 份報告` : "檢驗報告"}</span>
                <span className="text-brand-deep">查看報告 ↗</span>
              </span>
            </button>
          </li>
        ))}

        {/* 專利：六國全部攤開 */}
        <li className="border-t border-ink/15 py-10 lg:py-12">
          <div className={rowGrid}>
            <p data-reveal className="reveal reveal-left flex items-baseline gap-2 leading-none">
              <span className={bigNumber}>
                <CountUp value={String(countries.length)} />
              </span>
              <span className="text-xl">國專利</span>
            </p>
            <p data-reveal className="reveal reveal-right text-xl leading-[1.6] delay-100 md:col-span-2">
              產品結構設計在六個國家取得專利，每一國的證書都在下面，點擊即可放大檢視。
            </p>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-px bg-ink/15 sm:grid-cols-3 lg:grid-cols-6">
            {countries.map((name, i) => {
              const docs = patents.filter((p) => p.title === name);
              const d = docs[0];
              return (
                // 六格依序淡入
                <li key={name} data-reveal className="reveal bg-paper" style={{ transitionDelay: `${i * 80}ms` }}>
                  <button
                    type="button"
                    onClick={() => setOpen({ title: `${name}專利證書`, docs })}
                    aria-label={`放大檢視：${name}專利證書`}
                    className="group flex h-full w-full flex-col gap-4 p-5 text-left transition hover:bg-white"
                  >
                    <span className="font-serif text-[28px] leading-none font-black">{name}</span>
                    <span className="relative block h-20 w-full overflow-hidden bg-white ring-1 ring-black/5">
                      <Image src={d.src} alt="" fill sizes="200px" className="object-cover object-top transition duration-500 group-hover:scale-105" />
                    </span>
                    <span className="flex items-end justify-between gap-2 text-[12px] leading-snug text-muted">
                      <span>{d.note}</span>
                      <span className="shrink-0 text-brand-deep">↗</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </li>
      </ol>

      {open && <Lightbox title={open.title} docs={open.docs} onClose={() => setOpen(null)} />}
    </>
  );
}
