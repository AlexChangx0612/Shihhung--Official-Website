// 標記為瀏覽器端元件（需要偵測捲動）
"use client";

// 匯入 React 的副作用與參照 hook
import { useEffect, useRef, type ReactNode } from "react";

// 進場動畫區塊：內部標了 data-reveal 的元素，捲動進入畫面時才顯示
// 搭配 globals.css 的 .reveal、.reveal-left、.reveal-right、.belt-tag（與關於頁三個原則相同）
// 系統設定「減少動態效果」、伺服器輸出或不支援 JavaScript 時，內容直接顯示
export default function RevealSection({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  // 區塊本身
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // 啟用動畫：尚未進入畫面的元素先隱藏
    root.setAttribute("data-armed", "");

    // 進入畫面 20% 時顯示
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.setAttribute("data-in", "");
          io.unobserve(e.target);
        }),
      { threshold: 0.2 },
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}
