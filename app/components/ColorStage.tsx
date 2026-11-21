"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 React 狀態
import { useState } from "react";
// 匯入上色規則與去背圖
import { beltFill, postTint, stageImages } from "../lib/tints";
// 匯入共用的顏色選擇狀態
import { useCombo, type VariantOption } from "./variant-store";

// 遮罩樣式：把色塊限制在柱身或織帶的形狀內
const masked = (src: string): React.CSSProperties => ({
  WebkitMaskImage: `url(${src})`,
  maskImage: `url(${src})`,
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
});

// 產品展示台：去背產品圖＋柱身、織帶上色。換顏色時新顏色由上往下流過柱身、由左往右拉過織帶
export default function ColorStage({ variants, pageSlug, title }: { variants: VariantOption[]; pageSlug: string; title: string }) {
  const combo = useCombo(variants, pageSlug);
  const v = { post: combo.post, belt: combo.belt };
  // 上一次顯示的顏色：新顏色流過去之前，底下先維持舊顏色（在 render 中比對前後選擇，React 允許的寫法）
  type Colors = { post: string; belt: string };
  const [shown, setShown] = useState<{ cur: Colors; before: Colors | null }>({ cur: v, before: null });
  if (shown.cur.post !== v.post || shown.cur.belt !== v.belt) setShown({ cur: v, before: shown.cur });
  const before = shown.before;
  const changed = before !== null;

  // 透明、印花等無法上色模擬的柱身：顯示該型號原本的產品照
  const photo = postTint(v.post) === null || beltFill(v.belt) === null;

  // 柱身色層（multiply 疊色保留金屬反光）；animate 時新顏色由上往下流過
  const postLayer = (color: string, animate: boolean, key: string) => {
    const p = postTint(color);
    return p ? <div key={key} aria-hidden="true" className={`absolute inset-0 mix-blend-multiply ${animate ? "paint-down" : ""}`} style={{ ...masked(stageImages.post), background: p }} /> : null;
  };
  // 織帶色層（填色＋上亮下暗的布面陰影）；animate 時新顏色由左往右拉過
  const beltLayer = (color: string, animate: boolean, key: string) => {
    const b = beltFill(color);
    return b ? (
      <div key={key} aria-hidden="true" className={`absolute inset-0 ${animate ? "paint-right" : ""}`} style={masked(stageImages.belt)}>
        <div className="absolute inset-0" style={{ background: b }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.18),rgba(0,0,0,.18))]" />
      </div>
    ) : null;
  };
  // 只有顏色真的改變的部位才播放動畫
  const postChanged = changed && before!.post !== v.post;
  const beltChanged = changed && before!.belt !== v.belt;

  return (
    // 展示台：暖白底＋品牌紅柔光，地面陰影
    <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-[radial-gradient(120%_80%_at_50%_15%,#ffffff_0%,#f6f1ec_55%,#f1e6e2_100%)] lg:rounded-[22px]">
      <div aria-hidden="true" className="absolute -top-1/4 left-1/2 size-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,55,64,.14),rgba(255,55,64,0)_65%)]" />
      <div aria-hidden="true" className="absolute bottom-[7%] left-1/2 h-[4%] w-[46%] -translate-x-[58%] rounded-[50%] bg-[radial-gradient(ellipse,rgba(60,30,30,.28),rgba(60,30,30,0)_70%)]" />

      {/* 去背產品：高度約佔展示台 86% */}
      <div
        className={`absolute top-[6%] left-1/2 h-[86%] -translate-x-1/2 transition-opacity duration-500 ${photo ? "opacity-0" : "opacity-100"}`}
        style={{ aspectRatio: `${stageImages.width} / ${stageImages.height}` }}
      >
        <Image src={stageImages.base} alt={photo ? "" : `世紘 ${title}`} fill priority sizes="(min-width: 1024px) 22vw, 40vw" className="object-contain" />
        {/* 柱身、織帶各自：顏色有變時舊顏色在下、新顏色在上流過去；沒變就維持原色 */}
        {postChanged && postLayer(before!.post, false, `post-before-${before!.post}`)}
        {postLayer(v.post, postChanged, `post-${v.post}`)}
        {beltChanged && beltLayer(before!.belt, false, `belt-before-${before!.belt}`)}
        {beltLayer(v.belt, beltChanged, `belt-${v.belt}`)}
      </div>

      {/* 無法上色模擬的款式：淡入原本的產品照 */}
      {photo && (
        <div key={`photo-${combo.variant.slug}`} className="stage-fade absolute inset-0 bg-white">
          <Image src={combo.variant.image} alt={`世紘 ${title}`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" />
        </div>
      )}
    </div>
  );
}
