"use client";

// 匯入 React 狀態
import { useState } from "react";
// 匯入共用按鈕樣式
import { outlineBtn } from "../lib/ui";

// 手機版「顯示全部」：包住產品格，手機上只先顯示前幾款（由子元素的 class 控制隱藏），按下按鈕後全部展開
// 電腦與平板不受影響；收起的產品仍在 HTML 中，搜尋引擎可讀取
export default function MobileShowAll({ total, limit, children }: { total: number; limit: number; children: React.ReactNode }) {
  // 是否已展開
  const [open, setOpen] = useState(false);
  return (
    // data-open 給子元素判斷要不要隱藏（group/more）
    <div data-open={open} className="group/more">
      {children}
      {/* 款數超過上限且尚未展開時，手機才顯示按鈕 */}
      {!open && total > limit && (
        <button type="button" onClick={() => setOpen(true)} className={`${outlineBtn} mt-8 w-full sm:hidden`}>
          顯示全部 {total} 款
        </button>
      )}
    </div>
  );
}
