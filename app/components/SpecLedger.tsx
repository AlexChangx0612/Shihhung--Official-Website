"use client";

// 匯入 React 參照與副作用
import { useEffect, useRef } from "react";

// 匯入顏色色票
import { swatch } from "../lib/swatch";
// 匯入換色換頁時跳過進場動畫的設定
import { revealSkip, useComboOrNull, type VariantOption } from "./variant-store";

// 數字＋單位（例：400cm、900mm）改用英文粗體字
const isMeasure = (v: string) => /^\d[\d.]*\s?(cm|mm|m|kg|L)$/i.test(v);

// 捲動到畫面中才進場：先加 data-armed（隱藏），進入畫面加 data-in（播放一次）；減少動態效果時不做
export function useLedgerReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    // 系統設定減少動態效果時、或只是換顏色而換頁時，不做進場動畫
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (Date.now() < revealSkip.until) return;
    root.setAttribute("data-armed", "");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        root.setAttribute("data-in", "");
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);
  return ref;
}

// 章節標籤：標題＋細線（細線進場時由左拉出）
function LedgerHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="text-xl tracking-[0.1em] text-brand-deep">{title}</h2>
      <span aria-hidden="true" className="ledger-rule h-px flex-1 bg-brand-deep/30" />
    </div>
  );
}

// 產品特色：同樣的章節標籤，條列逐條進場（前方紅色短線拉出、文字淡入）
export function FeatureLedger({ features }: { features: string[] }) {
  const ref = useLedgerReveal();
  return (
    <div ref={ref} className="mt-16">
      <LedgerHeading title="產品特色" />
      <ul className="mt-7 space-y-4">
        {features.map((f, i) => (
          <li key={f} className="feature-row flex gap-4" style={{ "--i": i } as React.CSSProperties}>
            {/* 固定寬度的位置，短線在裡面拉長，文字不跟著移動 */}
            <span aria-hidden="true" className="mt-[14px] w-4 flex-none">
              <span className="feature-mark block h-px bg-brand" />
            </span>
            <span className="spec-cell text-base leading-[1.8] text-pretty">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 產品規格：章節標籤＋規格逐列進場（底線由左拉出、文字淡入）
// variants：有顏色選擇時，柱身、織帶顏色兩列跟著目前選擇的組合更新（客製組合加註）
export default function SpecLedger({
  specs: baseSpecs,
  note,
  variants,
  pageSlug,
}: {
  specs: { label: string; value: string }[];
  note: string;
  variants?: VariantOption[];
  pageSlug: string;
}) {
  const ref = useLedgerReveal();
  const combo = useComboOrNull(variants, pageSlug);
  // 還是這一頁原本的組合時，沿用原本的規格文字（例如 RS-258WE 列出的 5 色可選購織帶）
  const own = variants?.find((v) => v.slug === pageSlug);
  const changed = combo && own && (combo.post !== own.post || combo.belt !== own.belt);
  const specs = changed
    ? baseSpecs.map((s) =>
        s.label === "柱身顏色" ? { ...s, value: combo.post } : s.label === "織帶顏色" ? { ...s, value: combo.custom ? `${combo.belt}（客製）` : combo.belt } : s,
      )
    : baseSpecs;

  return (
    <div ref={ref} className="mt-16">
      <LedgerHeading title="產品規格" />

      <dl className="mt-6">
        {specs.map((s, i) => {
          const sw = swatch(s.value);
          return (
            <div
              key={s.label}
              className="spec-row group relative grid grid-cols-[6.5em_1fr] items-center gap-4 py-[18px]"
              style={{ "--i": i } as React.CSSProperties}
            >
              <dt className="spec-cell text-sm tracking-[0.08em] text-muted transition-colors duration-300 group-hover:text-brand-deep">{s.label}</dt>
              <dd className="spec-cell flex min-w-0 items-center gap-3 text-base transition-transform duration-500 ease-out group-hover:translate-x-1.5">
                {sw && <span aria-hidden="true" className="size-4 flex-none rounded-full shadow-[inset_0_0_0_1px_rgba(15,15,14,.15),0_2px_4px_-1px_rgba(15,15,14,.25)]" style={{ background: sw }} />}
                <span className={isMeasure(s.value) ? "font-display text-xl leading-none font-black" : "font-black"}>{s.value}</span>
              </dd>
            </div>
          );
        })}
      </dl>
      <p className="spec-note mt-4 text-xs leading-6 text-muted">{note}</p>
    </div>
  );
}
