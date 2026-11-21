"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 React 狀態
import { useState } from "react";
// 匯入共用的顏色選擇狀態
import { useCombo, type VariantOption } from "./variant-store";

// 產品展示台（每個顏色一張去背圖）：換顏色時新顏色的圖由上往下流過舊圖
export default function SwapStage({ variants, pageSlug, images, title }: { variants: VariantOption[]; pageSlug: string; images: Record<string, string>; title: string }) {
  const { variant } = useCombo(variants, pageSlug);
  const src = images[variant.model];
  // 上一張圖：新圖流過去之前，底下先維持舊圖（在 render 中比對前後選擇，React 允許的寫法）
  const [shown, setShown] = useState<{ cur: string; before: string | null }>({ cur: src, before: null });
  if (shown.cur !== src) setShown({ cur: src, before: shown.cur });

  const layer = (s: string, animate: boolean, priority = false) => (
    <div key={s} className={`absolute inset-[8%] ${animate ? "paint-down" : ""}`}>
      <Image src={s} alt={animate || !shown.before ? `世紘 ${title}` : ""} fill priority={priority} sizes="(min-width: 1024px) 45vw, 90vw" className="object-contain" />
    </div>
  );

  return (
    // 展示台：與伸縮帶欄柱相同的暖白底＋品牌紅柔光
    <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-[radial-gradient(120%_80%_at_50%_15%,#ffffff_0%,#f6f1ec_55%,#f1e6e2_100%)] lg:rounded-[22px]">
      <div aria-hidden="true" className="absolute -top-1/4 left-1/2 size-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,55,64,.14),rgba(255,55,64,0)_65%)]" />
      {shown.before && layer(shown.before, false)}
      {layer(src, !!shown.before, !shown.before)}
    </div>
  );
}
