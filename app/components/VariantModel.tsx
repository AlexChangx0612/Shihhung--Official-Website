"use client";

// 匯入共用的顏色選擇狀態
import { useCombo, type VariantOption } from "./variant-store";

// 中文品名：括號內的顏色跟著目前選擇的組合更新（例：萬向系列伸縮帶欄柱（黑色柱身・紅色織帶））
export function VariantName({ variants, pageSlug, name, className }: { variants: VariantOption[]; pageSlug: string; name: string; className: string }) {
  const c = useCombo(variants, pageSlug);
  const page = variants.find((v) => v.slug === pageSlug);
  // 只有顏色一項的系列（沒有織帶）：品名維持原樣，換頁後自然更新
  const same = !c.belt || (page && c.post === page.post && c.belt === page.belt);
  const text = same ? name : `${name.replace(/（[^（）]*）$/, "")}（${c.post}柱身・${c.belt}織帶）`;
  return (
    <span key={text} className={`${className} ${same ? "" : "model-in"}`}>
      {text}
    </span>
  );
}

// 頁面大標的型號：選顏色時立刻換成新型號（模糊淡入）
export default function VariantModel({ variants, pageSlug, className }: { variants: VariantOption[]; pageSlug: string; className: string }) {
  const { variant } = useCombo(variants, pageSlug);
  return (
    <span key={variant.slug} className={`${className} ${variant.slug !== pageSlug ? "model-in" : ""}`}>
      {variant.model}
    </span>
  );
}
