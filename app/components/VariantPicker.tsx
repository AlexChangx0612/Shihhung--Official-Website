"use client";

// 匯入 Next.js 路由
import { useRouter } from "next/navigation";
// 匯入顏色色票
import { swatch } from "../lib/swatch";
// 匯入織帶顏色分組
import { ALL_BELTS, BELT_GROUPS } from "../lib/variants";
// 匯入共用的顏色選擇狀態
import { comboTarget, revealSkip, selectCombo, useCombo, type VariantOption } from "./variant-store";

// 變色動畫的時間（毫秒）：動畫播完才換到新型號的頁面
const PAINT_MS = 950;

// 一組顏色：有組名時一行一組（左側組名、右側色票），沒有組名時只排色票
type SwatchGroup = { name?: string; colors: string[] };

// 顏色按鈕區：標題列＋一或多行色票
function SwatchRow({ label, groups, current, moved, onPick }: { label: string; groups: SwatchGroup[]; current: string; moved: boolean; onPick: (color: string) => void }) {
  return (
    <div>
      {/* 標題列：「柱身顏色」＋目前選擇的顏色 */}
      <p className="text-sm">
        <span className="tracking-[0.08em] text-muted">{label}</span>
        <span key={current} className={`ml-3 inline-block font-black ${moved ? "model-in" : ""}`}>
          {current}
        </span>
      </p>
      <div className="mt-3 grid gap-3">
        {groups.map((g) => (
          <div key={g.name ?? "all"} className={g.name ? "grid gap-1.5 sm:grid-cols-[6.5em_1fr] sm:items-center sm:gap-3" : ""}>
            {g.name && <p className="text-xs tracking-[0.08em] text-muted">{g.name}</p>}
            <SwatchList label={label} colors={g.colors} current={current} onPick={onPick} />
          </div>
        ))}
      </div>
    </div>
  );
}

// 一行色票
function SwatchList({ label, colors, current, onPick }: { label: string; colors: string[]; current: string; onPick: (color: string) => void }) {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {colors.map((color) => {
        const on = color === current;
        return (
          <li key={color}>
            <button
              type="button"
              onClick={() => onPick(color)}
              aria-pressed={on}
              aria-label={`${label}：${color}`}
              title={color}
              className={`group grid size-11 cursor-pointer place-items-center rounded-full transition duration-300 ${on ? "ring-2 ring-ink" : "ring-1 ring-ink/10 hover:ring-brand-deep/60"}`}
            >
              {/* 色票：立體圓點，滑鼠移上微微放大 */}
              <span
                aria-hidden="true"
                className="size-8 rounded-full shadow-[inset_0_0_0_1px_rgba(15,15,14,.14),inset_0_-3px_6px_rgba(15,15,14,.12),0_2px_5px_-2px_rgba(15,15,14,.35)] transition-transform duration-300 ease-out group-hover:scale-110"
                style={{ background: swatch(color) ?? "#e9e6e0" }}
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

// 顏色選擇：柱身與織帶各一排，可任意搭配
// 型錄上沒有的組合標示為客製（型號用同柱身顏色的型號）
// animate：有去背展示台的款式先在原頁播放變色動畫再換頁；沒有的立刻換頁
export default function VariantPicker({ variants, belts, pageSlug, animate }: { variants: VariantOption[]; belts: string[]; pageSlug: string; animate: boolean }) {
  const router = useRouter();
  const combo = useCombo(variants, pageSlug);
  // 柱身：這一款有的顏色（照資料順序）；織帶：由頁面傳入（全部單層織帶顏色）
  const posts = [...new Set(variants.map((v) => v.post))];
  // 織帶分三行：一般色、警示條紋、馬卡龍色系；不在這三組的顏色（例如八向的雙層織帶）另外一行
  const beltGroups: SwatchGroup[] = [
    ...BELT_GROUPS.map((g) => ({ name: g.name, colors: g.colors.filter((c) => belts.includes(c)) })),
    { colors: belts.filter((b) => !ALL_BELTS.includes(b)) },
  ].filter((g) => g.colors.length);
  const moved = combo.post !== variants.find((v) => v.slug === pageSlug)?.post || combo.belt !== variants.find((v) => v.slug === pageSlug)?.belt;

  // 選擇新組合：先更新畫面（變色、型號），動畫結束後若型號不同再換頁
  const choose = (post: string, belt: string) => {
    if (post === combo.post && belt === combo.belt) return;
    const target = comboTarget(variants, post, belt);
    selectCombo(pageSlug, target.slug, post, belt);
    if (target.slug === pageSlug) return;
    window.setTimeout(
      () => {
        revealSkip.until = Date.now() + 2000;
        router.replace(target.href, { scroll: false });
      },
      animate ? PAINT_MS : 0,
    );
  };

  return (
    <div className="mt-8 grid gap-6">
      <SwatchRow label={belts.length ? "柱身顏色" : "顏色"} groups={[{ colors: posts }]} current={combo.post} moved={moved} onPick={(p) => choose(p, combo.belt)} />
      {belts.length > 0 && <SwatchRow label="織帶顏色" groups={beltGroups} current={combo.belt} moved={moved} onPick={(b) => choose(combo.post, b)} />}
      {/* 型錄上沒有的組合：客製提示 */}
      {combo.custom && (
        <p key={`${combo.post}-${combo.belt}`} className="model-in flex items-start gap-3 rounded-[12px] bg-blush/60 px-4 py-3 text-sm leading-7">
          <span aria-hidden="true" className="mt-[13px] h-px w-3 flex-none bg-brand-deep" />
          <span>
            <span className="font-black text-brand-deep">客製搭配</span>　{combo.post}柱身＋{combo.belt}織帶不是型錄上的標準組合，可以客製，交期與價格請洽世紘專員確認。
          </span>
        </p>
      )}
    </div>
  );
}
