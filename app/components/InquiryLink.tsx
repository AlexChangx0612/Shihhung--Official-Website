"use client";

// 匯入共用的顏色選擇狀態
import { useCombo, type VariantOption } from "./variant-store";

// 有顏色選擇的頁面：主旨依目前選擇的組合（客製組合寫出柱身與織帶顏色）
function ComboLink({ email, variants, pageSlug, className, children }: { email: string; variants: VariantOption[]; pageSlug: string; className: string; children: React.ReactNode }) {
  const c = useCombo(variants, pageSlug);
  const subject = c.custom ? `產品詢價：${c.variant.model}（客製：${c.post}柱身＋${c.belt}織帶）` : `產品詢價：${c.variant.model}`;
  return (
    <a href={`mailto:${email}?subject=${encodeURIComponent(subject)}`} className={className}>
      {children}
    </a>
  );
}

// Email 詢價連結：信件主旨帶入型號，方便專員辨識
export default function InquiryLink({
  email,
  model,
  variants,
  pageSlug,
  className,
  children,
}: {
  email: string;
  model: string;
  variants?: VariantOption[];
  pageSlug: string;
  className: string;
  children: React.ReactNode;
}) {
  if (variants)
    return (
      <ComboLink email={email} variants={variants} pageSlug={pageSlug} className={className}>
        {children}
      </ComboLink>
    );
  return (
    <a href={`mailto:${email}?subject=${encodeURIComponent(`產品詢價：${model}`)}`} className={className}>
      {children}
    </a>
  );
}
