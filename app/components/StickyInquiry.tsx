"use client";

// 匯入 React 狀態與副作用
import { useEffect, useState } from "react";
// 匯入詢價連結、型號與顏色選擇型別
import InquiryLink from "./InquiryLink";
import VariantModel from "./VariantModel";
import type { VariantOption } from "./variant-store";

// 手機版底部固定詢價列：頁面內的詢價按鈕（#inquiry）捲出畫面上方後才出現，捲到底部紅色聯絡區（#contact）時收起，避免重複
export default function StickyInquiry({
  model,
  email,
  phoneHref,
  variants,
  pageSlug,
}: {
  model: string;
  email: string;
  phoneHref: string;
  variants?: VariantOption[];
  pageSlug: string;
}) {
  // 頁面內詢價按鈕是否已捲過、聯絡區是否在畫面中
  const [passed, setPassed] = useState(false);
  const [atContact, setAtContact] = useState(false);
  const hidden = !passed || atContact;

  useEffect(() => {
    const inquiry = document.getElementById("inquiry");
    const contact = document.getElementById("contact");
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        // 詢價按鈕不在畫面中、且位於畫面上方 = 已捲過
        if (e.target === inquiry) setPassed(!e.isIntersecting && e.boundingClientRect.top < 0);
        if (e.target === contact) setAtContact(e.isIntersecting);
      }
    });
    if (inquiry) io.observe(inquiry);
    if (contact) io.observe(contact);
    return () => io.disconnect();
  }, []);

  return (
    // 外觀與頂端浮動 header 一致：白底、圓角、細框陰影；電腦版不顯示
    <div
      className={`fixed inset-x-2 bottom-2 z-30 flex items-center gap-3 rounded-[18px] bg-white p-2 pl-5 shadow-[0_0_0_1px_rgba(15,15,14,.08),0_-12px_32px_-20px_rgba(15,15,14,.35)] transition duration-500 ease-out sm:inset-x-6 lg:hidden ${
        hidden ? "pointer-events-none translate-y-[130%] opacity-0" : ""
      }`}
    >
      {/* 目前型號 */}
      {variants ? (
        <VariantModel variants={variants} pageSlug={pageSlug} className="min-w-0 flex-1 truncate font-display text-base font-black" />
      ) : (
        <span className="min-w-0 flex-1 truncate font-display text-base font-black">{model}</span>
      )}
      {/* 電話：次要 */}
      <a href={phoneHref} className="inline-flex min-h-11 items-center px-3 text-sm text-ink transition hover:text-brand-deep">
        電話
      </a>
      {/* Email 詢價：主要 */}
      <InquiryLink
        email={email}
        model={model}
        variants={variants}
        pageSlug={pageSlug}
        className="inline-flex min-h-11 items-center rounded-full bg-brand-deep px-5 text-sm tracking-[0.12em] text-white transition hover:bg-brand active:translate-y-px"
      >
        詢價此型號
      </InquiryLink>
    </div>
  );
}
