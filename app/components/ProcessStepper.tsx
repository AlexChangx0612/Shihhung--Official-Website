"use client";
// 互動式客製流程：右側是一張「客製需求單」，四個區塊對應四個步驟
// 電腦版捲動到這裡會固定畫面，往下捲＝把目前區塊的欄位一格一格填上（文字像打字般出現、勾選框依序打勾），填完再換下一個區塊，最後蓋上「完成」章
// 左側步驟清單可直接點選跳到該步；手機與平板不固定畫面，點步驟後需求單填到該步為止
// 匯入 React 狀態、副作用與參照
import { useEffect, useRef, useState } from "react";

// 需求單的一個欄位：text 為文字（打字效果），check 為勾選項目，swatch 為顏色色票＋文字
export type FormField = { label: string; value: string; kind?: "text" | "check" | "swatch"; color?: string };

// 一個步驟：左側的標題、說明、細節，右側需求單的區塊名稱與欄位
export type Step = { title: string; desc: string; details: string[]; section: string; fields: FormField[] };

// 數值限制在 0～1
const clamp = (n: number) => Math.min(1, Math.max(0, n));

// 流程元件
export default function ProcessStepper({ steps }: { steps: Step[] }) {
  // 填寫進度 0～1（電腦版跟著捲動；手機依點選的步驟）
  const [p, setP] = useState(0);
  // 是否為電腦版（固定畫面、捲動驅動）
  const [desk, setDesk] = useState(false);
  // 區塊本身（電腦版捲動的範圍）
  const ref = useRef<HTMLDivElement>(null);
  const n = steps.length;

  // 電腦版：依捲動位置計算進度（每步前 80% 用來填寫，後 20% 停留讓人看清楚）
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    const update = () => {
      raf = 0;
      setDesk(mq.matches);
      const el = ref.current;
      if (!el || !mq.matches) return;
      const r = el.getBoundingClientRect();
      setP(clamp(-r.top / Math.max(1, r.height - window.innerHeight)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // 目前步驟，以及每個區塊的填寫比例（0＝空白、1＝填完）
  const active = Math.min(n - 1, Math.floor(p * n));
  const fill = (i: number) => clamp((p * n - i) / 0.8);
  // 已完成的區塊數
  const done = steps.filter((_, i) => fill(i) >= 1).length;

  // 點步驟：電腦版捲到該步填完的位置，手機直接填到該步
  const go = (i: number) => {
    const el = ref.current;
    if (el && window.matchMedia("(min-width: 1024px)").matches) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      const span = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + span * ((i + 0.85) / n) });
    } else {
      setP((i + 1) / n);
    }
  };

  return (
    <div ref={ref} className="relative lg:h-[440svh]">
      <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:items-center lg:pt-24">
        <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16 lg:px-12">
          {/* 左：標題與步驟清單（目前步驟展開說明） */}
          <div className="lg:col-span-5">
            <h2 className="text-[clamp(32px,3.6vw,56px)] leading-[1.15] font-black">客製流程</h2>
            <p className="mt-5 text-[clamp(17px,1.3vw,20px)] leading-[1.8] text-white/75">往下捲動，看一張需求單怎麼從空白變成出貨。</p>

            <ol className="relative mt-10 pl-6">
              {/* 進度條：灰底＋紅色填滿 */}
              <span aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-[3px] bg-white/15">
                <span className="block w-full bg-brand" style={{ height: `${(desk ? p : (active + 1) / n) * 100}%` }} />
              </span>
              {steps.map((s, i) => {
                const on = i === active;
                return (
                  <li key={s.title}>
                    <button type="button" aria-current={on ? "step" : undefined} onClick={() => go(i)} className={`flex w-full items-baseline gap-4 py-3 text-left transition-colors duration-300 ${on ? "text-white" : "text-white/40 hover:text-white/80"}`}>
                      <span className={`font-display text-3xl leading-none tabular-nums lg:text-4xl ${on ? "text-brand" : ""}`}>{i + 1}</span>
                      <span className="text-xl lg:text-2xl">{s.title}</span>
                    </button>
                    {/* 目前步驟：展開說明與細節 */}
                    <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <p className="pt-1 pb-2 pl-12 text-base leading-[1.8] text-white/80 lg:pl-14">{s.desc}</p>
                        <ul className="flex flex-col gap-2 pb-4 pl-12 text-[15px] text-white/65 lg:pl-14">
                          {s.details.map((d) => (
                            <li key={d} className="flex gap-3">
                              <span aria-hidden="true" className="mt-[0.75em] h-[2px] w-3 shrink-0 bg-brand" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* 右：客製需求單（介面示意，對輔助科技隱藏；步驟內容已在左側） */}
          <div aria-hidden="true" data-ui className="relative self-center bg-white text-ink lg:col-span-7">
            {/* 表單抬頭：標題、完成數與進度條 */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 sm:px-8">
              <p className="flex items-center gap-2.5 text-base">
                <span className="size-2 rounded-full bg-brand" />
                客製需求單
              </p>
              <p className="text-sm text-muted tabular-nums">
                已完成 {done} / {n}
              </p>
            </div>
            <div className="h-[3px] bg-ink/10">
              <div className="h-full bg-brand-deep" style={{ width: `${(desk ? p : (active + 1) / n) * 100}%` }} />
            </div>

            {/* 四個區塊 */}
            <div className="flex flex-col">
              {steps.map((s, i) => {
                const f = desk ? fill(i) : i <= active ? 1 : 0;
                const on = desk ? i === active : i === active;
                return (
                  <section key={s.section} className={`relative px-6 py-4 transition-colors duration-500 sm:px-8 ${on ? "bg-blush/40" : ""}`}>
                    {/* 目前區塊左側紅線 */}
                    <span className={`absolute top-0 bottom-0 left-0 w-[3px] bg-brand-deep transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`} />
                    <p className="flex items-center justify-between text-sm">
                      <span className={f > 0 ? "text-ink" : "text-muted"}>
                        <span className="mr-2 font-display tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                        {s.section}
                      </span>
                      {/* 區塊完成時出現「已確認」 */}
                      <span className={`text-xs text-brand-deep transition-opacity duration-300 ${f >= 1 ? "opacity-100" : "opacity-0"}`}>已確認</span>
                    </p>
                    <dl className="mt-2.5 grid gap-x-4 gap-y-2 text-[15px] sm:grid-cols-[6.5em_1fr]">
                      {s.fields.map((fd, k) => {
                        // 這一格的填寫比例：區塊內的欄位依序填上
                        const v = clamp(f * s.fields.length - k);
                        return (
                          <div key={fd.label} className="contents">
                            <dt className="text-muted">{fd.label}</dt>
                            <dd className="relative min-h-[1.6em]">
                              {/* 還沒填：灰色空欄 */}
                              <span className={`absolute inset-x-0 bottom-0 h-px bg-ink/15 transition-opacity ${v > 0 ? "opacity-0" : "opacity-100"}`} />
                              {fd.kind === "check" ? (
                                <span className="flex items-center gap-2.5">
                                  <span className={`grid size-[18px] shrink-0 place-items-center transition-colors duration-200 ${v >= 1 ? "bg-brand-deep text-white" : "bg-ink/10 text-transparent"}`}>
                                    <svg viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M3.5 8.5l3 3 6-7" />
                                    </svg>
                                  </span>
                                  <span className={`transition-opacity duration-300 ${v > 0 ? "opacity-100" : "opacity-30"}`}>{fd.value}</span>
                                </span>
                              ) : (
                                // 文字：由左往右露出，像打字
                                <span className="flex items-center gap-2.5" style={{ clipPath: `inset(0 ${(1 - v) * 100}% 0 0)` }}>
                                  {fd.kind === "swatch" && <span className="size-4 shrink-0" style={{ background: fd.color }} />}
                                  {fd.value}
                                </span>
                              )}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  </section>
                );
              })}
            </div>

            {/* 全部填完：蓋上「完成」章 */}
            <div
              className={`pointer-events-none absolute right-6 bottom-6 grid size-24 -rotate-12 place-items-center border-[3px] border-brand-deep text-center text-brand-deep transition-[opacity,transform] duration-500 ease-out sm:right-10 sm:size-28 ${done === n ? "scale-100 opacity-100" : "scale-150 opacity-0"}`}
            >
              <span className="text-xl leading-tight font-black sm:text-2xl">
                完成
                <span className="block text-[11px] font-bold tracking-[0.2em]">已出貨</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
