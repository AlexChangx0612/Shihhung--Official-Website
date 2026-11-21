// 產品頁顏色選擇的共用狀態：顏色按鈕、產品圖、型號、規格表、詢價按鈕共用「目前選擇的柱身＋織帶顏色」
// 柱身與織帶可任意搭配：型錄上有的組合換到該型號的頁面；沒有的組合（客製）用同柱身顏色的型號，另外標示客製
// 按下顏色時先在原頁播放變色動畫，動畫結束後再換到該型號的頁面（網址、規格一起更新）
import { useSyncExternalStore } from "react";
// 匯入馬卡龍色系織帶顏色
import { MACARON_BELTS } from "../lib/variants";

// 顏色款式（只放可序列化的資料，給用戶端元件使用）
export type VariantOption = { slug: string; model: string; post: string; belt: string; href: string; image: string };

// 最近一次選擇：在哪一頁（from）選了什麼顏色，對應到哪個型號的頁面（to）
type Selection = { from: string; to: string; post: string; belt: string } | null;
let selection: Selection = null;
const listeners = new Set<() => void>();

// 因換顏色而換頁時，新頁面的逐列進場動畫不要重播：在這個時間之前載入的頁面直接顯示
export const revealSkip = { until: 0 };

export function selectCombo(from: string, to: string, post: string, belt: string) {
  selection = { from, to, post, belt };
  listeners.forEach((l) => l());
}

// 目前要顯示的組合：在這一頁選的、或因為選顏色而換到這一頁時用選擇的組合；其他情況（上一項、下一項、返回）用頁面本身的品項
export type Combo = { variant: VariantOption; post: string; belt: string; custom: boolean };
export function useCombo(variants: VariantOption[], pageSlug: string): Combo {
  return useComboOrNull(variants, pageSlug)!;
}
// 同上；沒有顏色選擇（variants 為空）的頁面回傳 null
export function useComboOrNull(variants: VariantOption[] | undefined, pageSlug: string): Combo | null {
  const sel = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => selection,
    () => null,
  );
  if (!variants?.length) return null;
  const page = variants.find((v) => v.slug === pageSlug) ?? variants[0];
  if (!sel || (sel.from !== pageSlug && sel.to !== pageSlug)) return { variant: page, post: page.post, belt: page.belt, custom: false };
  const variant = variants.find((v) => v.slug === sel.to) ?? page;
  return { variant, post: sel.post, belt: sel.belt, custom: !variants.some((v) => v.post === sel.post && hasBelt(v, sel.belt)) };
}

// 型號原本就有的織帶顏色（標「馬卡龍色系」的型號，5 個馬卡龍色都算原本就有）
export function hasBelt(v: VariantOption, belt: string) {
  return v.belt === belt || (v.belt === "馬卡龍色系" && MACARON_BELTS.includes(belt));
}

// 組合對應的型號頁：完全相同的組合優先，否則用同柱身顏色的型號（客製織帶）
export function comboTarget(variants: VariantOption[], post: string, belt: string): VariantOption {
  return variants.find((v) => v.post === post && hasBelt(v, belt)) ?? variants.find((v) => v.post === post) ?? variants[0];
}
