"use client";
// 案例總覽的固定大圖舞台：電腦版左側大圖固定不動，右側案例捲到畫面中央時換成該案例照片；大圖右側有案例索引可直接跳轉
// 手機與平板沒有固定大圖，每個案例自帶照片
// 匯入 React 狀態與副作用
import { useEffect, useRef, useState } from "react";
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入案例網址與型別
import { caseHref, type CaseStudy } from "../lib/cases";
// 匯入照片挑選
import { getStage } from "../lib/case-stage";
// 匯入共用樣式
import { container } from "../lib/ui";
// 匯入元件樣式（照片修飾、按鈕、索引）
import s from "./CaseStage.module.css";

// 舞台
export default function CaseStage({ cases }: { cases: CaseStudy[] }) {
  // 目前顯示的案例
  const [active, setActive] = useState(0);
  // 每個案例段落的元素
  const refs = useRef<(HTMLElement | null)[]>([]);
  // 每個案例的照片組
  const stages = cases.map(getStage);

  // 段落經過畫面中央那條線時，設為目前案例
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // 點索引：把該案例捲到畫面中央
  const jump = (i: number) => refs.current[i]?.scrollIntoView({ block: "center" });

  return (
    <div className={`${container} mt-16 lg:mt-24 lg:grid lg:grid-cols-[1.15fr_1fr] lg:gap-20`}>
      {/* 左：固定大圖（電腦版），所有照片疊在一起，目前案例淡入並從微微放大緩慢收回 */}
      <div className="hidden lg:block">
        <div className="sticky top-[200px] h-[calc(100svh-240px)]">
          <div className="relative h-full overflow-hidden bg-ink">
            {cases.map((c, i) => (
              <Image
                key={c.slug}
                src={stages[i].hero.src}
                alt={i === active ? stages[i].hero.alt : ""}
                fill
                sizes="55vw"
                loading={i === 0 ? "eager" : "lazy"}
                style={{ objectPosition: stages[i].hero.pos }}
                className={`object-cover ${s.tone} transition-[opacity,transform] ease-out ${i === active ? "scale-100 opacity-100 duration-[700ms,2400ms]" : "scale-[1.08] opacity-0 duration-700"}`}
              />
            ))}
            {/* 左下角：目前案例名稱與序位（底部加深，讓白字看得清楚） */}
            <p aria-live="polite" className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-8 pt-24 pb-7 text-white">
              <span className="block text-sm text-white/75 tabular-nums">
                {String(active + 1).padStart(2, "0")} / {String(cases.length).padStart(2, "0")}
              </span>
              <span className="mt-1 block text-xl">{cases[active].title}</span>
            </p>
            {/* 網路開放授權照片的署名（左上角小字） */}
            {stages[active].hero.credit && (
              <a href={stages[active].hero.credit.href} target="_blank" rel="noopener noreferrer" className="absolute top-0 left-0 bg-black/45 px-3 py-1.5 text-xs text-white/85 hover:text-white">
                {stages[active].hero.credit.text}
              </a>
            )}
            {/* 右側案例索引：滑鼠移上顯示案例名稱，點擊跳到該案例 */}
            <nav aria-label="案例索引" className={s.rail}>
              {cases.map((c, i) => (
                <button key={c.slug} type="button" aria-current={i === active} aria-label={c.title} onClick={() => jump(i)} className={s.tick}>
                  <span aria-hidden="true" className={s.tip}>
                    {c.title}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* 右：案例清單 */}
      <div>
        {cases.map((c, i) => {
          const stage = stages[i];
          const on = i === active;
          return (
            <article
              key={c.slug}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-i={i}
              className="flex flex-col justify-center py-14 first:pt-0 lg:min-h-[85svh] lg:py-0 lg:first:pt-0"
            >
              {/* 手機與平板：每個案例自帶照片 */}
              <div className="relative mb-8 aspect-[4/5] overflow-hidden sm:aspect-[4/3] lg:hidden">
                <Image src={stage.hero.src} alt={stage.hero.alt} fill sizes="100vw" style={{ objectPosition: stage.hero.pos }} className={`object-cover ${s.tone}`} />
                {stage.hero.credit && (
                  <a href={stage.hero.credit.href} target="_blank" rel="noopener noreferrer" className="absolute top-0 left-0 bg-black/45 px-3 py-1.5 text-xs text-white/85">
                    {stage.hero.credit.text}
                  </a>
                )}
              </div>

              {/* 標題：目前案例全黑，其他案例變淡（電腦版） */}
              <h2 className={`text-[clamp(30px,3.2vw,48px)] leading-[1.2] font-black text-balance transition-colors duration-500 ${on ? "text-ink" : "lg:text-ink/25"}`}>
                <Link href={caseHref(c.slug)} className="hover:text-brand-deep">
                  {c.title}
                </Link>
              </h2>
              {/* 場域與地點：標題下方，紅色場域＋灰色地點 */}
              <p className="mt-4 text-base">
                <span className="text-brand-deep">{c.scene}</span>
                <span className="mx-2 text-muted" aria-hidden="true">
                  ／
                </span>
                <span className="text-muted">{c.location}</span>
              </p>

              {/* 一句話摘要：限制行寬，讀起來不會太長 */}
              <p className="mt-6 max-w-[26em] text-[clamp(18px,1.35vw,21px)] leading-[1.8]">{c.summary}</p>

              {/* 使用產品、客製內容：左標籤右內容 */}
              <dl className="mt-8 grid max-w-[34em] grid-cols-[5.5em_1fr] gap-x-4 gap-y-3 text-[15px] leading-[1.7]">
                <dt className="text-muted">使用產品</dt>
                {/* 依頓號拆開，一個產品一行 */}
                <dd>
                  <ul>
                    {c.products.split("、").map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </dd>
                <dt className="text-muted">客製內容</dt>
                {/* 依頓號拆開，一項一行 */}
                <dd>
                  <ul>
                    {c.custom.split("、").map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </dd>
              </dl>

              {/* 兩張配圖：點擊進入案例，滑鼠移上微微放大 */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                {stage.side.map((p) => (
                  <Link key={p.src} href={caseHref(c.slug)} tabIndex={-1} className="group relative aspect-[4/3] overflow-hidden bg-ink">
                    <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 20vw, 50vw" style={{ objectPosition: p.pos }} className={`object-cover ${s.tone} transition duration-700 ease-out group-hover:scale-[1.05]`} />
                  </Link>
                ))}
              </div>

              {/* 看完整案例：紅色圓圈箭頭，滑鼠移上展開 */}
              <Link href={caseHref(c.slug)} className={`${s.more} mt-10`}>
                <span className={s.circle} aria-hidden="true">
                  <span className={s.arrow} />
                </span>
                <span className={s.label}>看完整案例</span>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
