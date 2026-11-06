// 標記為瀏覽器端元件（需要偵測捲動）
"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入 React 的副作用、參照與狀態 hook
import { useEffect, useRef, useState, type ReactNode } from "react";
// 匯入數字滾動
import CountUp from "./CountUp";
// 匯入共用樣式
import { card, container, solidBtn, textLink } from "../lib/ui";

// 星形多邊形頂點（cx, cy 為中心，r 為外徑，n 為角數，ratio 為內徑比例）
function starPoints(cx: number, cy: number, r: number, n = 5, ratio = 0.38) {
  return Array.from({ length: n * 2 }, (_, i) => {
    const rad = (Math.PI * i) / n - Math.PI / 2;
    const len = i % 2 === 0 ? r : r * ratio;
    return `${(cx + len * Math.cos(rad)).toFixed(2)},${(cy + len * Math.sin(rad)).toFixed(2)}`;
  }).join(" ");
}

// 各國國旗（簡化版 SVG，畫布 30×20）
const flags: Record<string, ReactNode> = {
  台灣: (
    <>
      <rect width="30" height="20" fill="#FE0000" />
      <rect width="15" height="10" fill="#000095" />
      <polygon points={starPoints(7.5, 5, 3.8, 12, 0.6)} fill="#fff" />
      <circle cx="7.5" cy="5" r="2" fill="#000095" />
      <circle cx="7.5" cy="5" r="1.6" fill="#fff" />
    </>
  ),
  美國: (
    <>
      <rect width="30" height="20" fill="#fff" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} y={(i * 20) / 6.5} width="30" height={20 / 13} fill="#B22234" />
      ))}
      <rect width="12" height={(20 / 13) * 7} fill="#3C3B6E" />
    </>
  ),
  日本: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <circle cx="15" cy="10" r="6" fill="#BC002D" />
    </>
  ),
  中國: (
    <>
      <rect width="30" height="20" fill="#EE1C25" />
      <polygon points={starPoints(5, 5, 3)} fill="#FFFF00" />
      {[[10, 2], [12, 4], [12, 7], [10, 9]].map(([x, y]) => (
        <polygon key={`${x}-${y}`} points={starPoints(x, y, 1)} fill="#FFFF00" />
      ))}
    </>
  ),
  德國: (
    <>
      <rect width="30" height="20" fill="#FFCE00" />
      <rect width="30" height="13.34" fill="#DD0000" />
      <rect width="30" height="6.67" fill="#000" />
    </>
  ),
  西班牙: (
    <>
      <rect width="30" height="20" fill="#AA151B" />
      <rect y="5" width="30" height="10" fill="#F1BF00" />
    </>
  ),
};

// 取得專利的國家
const patentCountries = ["台灣", "美國", "日本", "中國", "德國", "西班牙"];

// 誠信：服務的三個步驟
const steps = [
  { title: "先聽需求", body: "人流、空間尺寸、使用情境，先了解再建議。" },
  { title: "報價寫清楚", body: "品項、數量、客製內容、交期，一次說明。" },
  { title: "照承諾交貨", body: "答應的日期與規格，就是我們的標準。" },
];

// 織帶上的印字：重複印上 Shung 白色標誌，跟實際印刷織帶一樣
function BeltPrint({ count = 14, gap = "gap-16 pl-7" }: { count?: number; gap?: string }) {
  return (
    <div aria-hidden="true" className={`flex h-full items-center ${gap}`}>
      {Array.from({ length: count }, (_, i) => (
        <Image key={i} src="/brand/logo-shung-white.png" alt="" width={240} height={139} className="h-[62%] w-auto max-w-none flex-none" />
      ))}
    </div>
  );
}

// 章節標籤：一小段織帶（進入畫面時拉出）＋宋體大字原則名稱＋延伸到欄寬的細線
function ChapterTag({ name, dark = false }: { name: string; dark?: boolean }) {
  return (
    <div className="flex items-center gap-5 sm:gap-7">
      <div data-reveal className="belt-strip belt-tag h-[30px] flex-none">
        <BeltPrint count={4} gap="gap-10 pl-4" />
      </div>
      <p className={`font-serif text-[clamp(56px,7vw,92px)] leading-none font-black tracking-[0.04em] ${dark ? "text-brand" : "text-brand-deep"}`}>
        {name}
      </p>
      <div aria-hidden="true" className={`h-px min-w-6 flex-1 ${dark ? "bg-brand/50" : "bg-brand-deep/40"}`} />
    </div>
  );
}

// 欄柱柱身（織帶兩端的黑色柱子）
function Post({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`stanchion-post ${className}`} />;
}

// 關於頁「我們做事的三個原則」：開場織帶隨捲動拉開，三個原則各附上證據
export default function Principles() {
  // 整個區塊（設定動畫狀態用）
  const rootRef = useRef<HTMLElement>(null);
  // 開場織帶的外框與織帶本身
  const pullRef = useRef<HTMLDivElement>(null);
  const beltRef = useRef<HTMLDivElement>(null);
  // 拉伸試驗台的次數（從 9,980 開始，每 3 秒一次）
  const [cycles, setCycles] = useState(9980);

  useEffect(() => {
    const root = rootRef.current;
    const pull = pullRef.current;
    const belt = beltRef.current;
    if (!root || !pull || !belt || typeof IntersectionObserver === "undefined") return;
    // 系統設定「減少動態效果」時，全部直接顯示最終狀態
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // 啟用動畫：尚未進入畫面的元素先隱藏（伺服器輸出與不支援 JavaScript 時直接顯示）
    root.setAttribute("data-armed", "");

    // 進入畫面 25% 時顯示
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.setAttribute("data-in", "");
          io.unobserve(e.target);
        }),
      { threshold: 0.25 },
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    // 開場織帶：從進入畫面底部到捲過七成畫面高度之間，由左往右拉開
    const onScroll = () => {
      const r = pull.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.7)));
      belt.style.width = `calc((100% - 22px) * ${p})`;
      pull.toggleAttribute("data-done", p >= 1);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);

    // 試驗台計數：每 3 秒（織帶拉出收回一次）加一，到 10,000 後重來
    const timer = setInterval(() => setCycles((n) => (n >= 10000 ? 9980 : n + 1)), 3000);

    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <section ref={rootRef} className="mt-40 bg-white">
      {/* 開場：標題與拉開的織帶 */}
      <div className={`${container} pt-28 pb-10`}>
        <p data-reveal className="reveal font-display text-[13px] tracking-[0.35em] text-brand-deep">OUR PRINCIPLES</p>
        <h2 data-reveal className="reveal mt-4 text-[clamp(30px,3vw,44px)] leading-[1.3] font-bold delay-100">
          我們做事的三個原則
        </h2>
        <p data-reveal className="reveal mt-4 text-lg leading-[1.7] delay-200">
          創新、品質、誠信，每家公司都會寫。我們把證據也一起攤開。
        </p>
        <div ref={pullRef} data-pull className="relative mt-16 h-[150px]">
          <Post className="left-0" />
          {/* 織帶從柱頭正下方拉出（柱身頂端在 9px，柱頭下緣約 16px） */}
          <div ref={beltRef} className="belt-strip absolute top-[19px] left-[11px] h-11 w-[calc(100%-22px)]">
            <BeltPrint />
          </div>
          <Post className="pull-end right-0" />
        </div>
      </div>

      {/* 01 創新：專利 */}
      <article className="overflow-x-clip border-t border-line py-24 sm:pt-28 sm:pb-32">
        <div className={container}>
          <ChapterTag name="創新" />
          <div className="mt-10 flex flex-wrap items-center gap-16">
            <div className="min-w-0 flex-[1_1_420px]">
              <h3 data-reveal className="reveal reveal-left text-[clamp(30px,3vw,44px)] leading-[1.3] font-bold">
                每一個不起眼的細節，
                <br />
                都經過無數次打磨。
              </h3>
              <p data-reveal className="reveal reveal-right mt-6 max-w-[30em] text-lg leading-[1.8] delay-100">
                我們持續開發新產品，從結構設計到使用細節反覆改良，讓設備更好用、更耐用。
              </p>
              <p data-reveal className="reveal mt-10 flex items-baseline text-[clamp(56px,6vw,88px)] leading-none whitespace-nowrap delay-200">
                <CountUp value={String(patentCountries.length)} />
                <span className="ml-2 text-[0.32em]">國專利</span>
              </p>
              <ul data-reveal className="reveal mt-5 flex flex-wrap gap-2 delay-200">
                {patentCountries.map((c) => (
                  <li key={c}>
                    {/* 假按鈕：純裝飾，按了沒有動作 */}
                    <button
                      type="button"
                      className="group inline-flex cursor-pointer items-center gap-2.5 rounded-full border border-brand-deep/15 bg-white/70 py-1.5 pr-4 pl-1.5 text-sm font-medium tracking-wide text-brand-deep shadow-[0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur transition duration-300 ease-out hover:-translate-y-0.5 hover:border-brand-deep/40 hover:bg-white hover:shadow-[0_8px_20px_-8px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-[0.97]"
                    >
                      <svg
                        viewBox="0 0 30 20"
                        aria-hidden="true"
                        className="h-[18px] w-[27px] flex-none overflow-hidden rounded-[3px] ring-1 ring-black/10 transition-transform duration-300 group-hover:scale-110"
                      >
                        {flags[c]}
                      </svg>
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
              <div data-reveal className="reveal mt-7 delay-300">
                <Link href="/custom" className={textLink}>
                  了解客製服務 →
                </Link>
              </div>
            </div>
            <figure data-reveal className="reveal min-w-0 flex-[1_1_420px] delay-100">
              <div className={`${card} relative mr-[6%] px-8 pt-10 pb-6`}>
                <Image src="/certificates/patent-1.jpg" alt="世紘取得的美國專利證書" width={1370} height={335} sizes="(min-width: 1024px) 45vw, 90vw" className="w-full" />
                <Image
                  src="/cutouts/retractable-belt-stanchions.png"
                  alt=""
                  width={891}
                  height={2155}
                  sizes="12vw"
                  className="absolute right-[-8%] bottom-[-10%] w-[22%] drop-shadow-[0_18px_24px_rgba(0,0,0,.2)]"
                />
              </div>
              <figcaption className="mt-3 text-[15px] text-muted">美國專利證書，專利圖上就是我們的欄柱結構</figcaption>
            </figure>
          </div>
        </div>
      </article>

      {/* 02 品質：拉伸試驗（深色底，與世紘優勢頁的織帶牆同色） */}
      <article className="overflow-x-clip bg-[#181818] py-24 text-white sm:pt-28 sm:pb-32">
        <div className={container}>
          <ChapterTag name="品質" dark />
          <div className="mt-10 flex flex-wrap items-center gap-16">
            <div className="min-w-0 flex-[1_1_420px] lg:order-2">
              <h3 data-reveal className="reveal reveal-left text-[clamp(30px,3vw,44px)] leading-[1.3] font-bold">
                拉一萬次，
                <br />
                還是好好的。
              </h3>
              <p data-reveal className="reveal reveal-right mt-6 max-w-[30em] text-lg leading-[1.8] delay-100">
                從選材、加工到表面處理，每個環節都嚴格對待，「標準」不是形容詞，是 SGS 實驗室一次又一次的嚴格測試。
              </p>
              <p data-reveal className="reveal mt-10 flex items-baseline text-[clamp(56px,6vw,88px)] leading-none whitespace-nowrap delay-200">
                <CountUp value="10,000" />
                <span className="ml-2 text-[0.32em]">次</span>
              </p>
              <dl data-reveal className="reveal mt-8 grid grid-cols-3 border-t border-white/15 delay-200">
                {[
                  { k: "每次拉出", v: "900", u: "mm" },
                  { k: "測試速度", v: "20", u: "次／分" },
                  { k: "結果", v: "無損壞", u: "" },
                ].map((s) => (
                  <div key={s.k} className="pt-4 pr-3">
                    <dt className="text-sm font-medium text-white/60">{s.k}</dt>
                    <dd className="mt-1.5 text-lg sm:text-[22px]">
                      {s.v}
                      {s.u && <span className="ml-1 text-sm font-medium text-white/70">{s.u}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
              <p data-reveal className="reveal mt-7 border-l-[3px] border-brand bg-white/[.06] px-5 py-4 text-base font-medium delay-300">
                <b className="mr-2 text-xl font-bold">24 小時</b>鋁材鹽霧試驗，無可見腐蝕（金屬工業研究發展中心）
              </p>
              <div data-reveal className="reveal mt-6 delay-300">
                <Link href="/advantages#reports" className={textLink}>
                  看專利與檢驗 →
                </Link>
              </div>
            </div>

            {/* 拉伸試驗台：織帶反覆拉出 900mm 再收回 */}
            <div data-reveal className="reveal min-w-0 flex-[1_1_420px] delay-100">
              <div className="rounded-[18px] bg-[#222] p-7 shadow-[0_0_0_1px_rgba(255,255,255,.08)]">
                <div aria-hidden="true" className="relative h-[140px]">
                  <Post className="left-0" />
                  {/* 織帶從柱頭正下方的收納盒拉出（柱身頂端在 4px，柱頭下緣約 11px） */}
                  <div className="belt-strip rig-belt absolute top-[14px] left-[11px] h-[30px]">
                    <BeltPrint count={6} gap="gap-10 pl-4" />
                  </div>
                  <div className="rig-handle absolute top-[8px] h-[42px] w-3.5 rounded-[3px] bg-[linear-gradient(90deg,#555,#bbb,#555)]" />
                </div>
                <div aria-hidden="true" className="mt-1.5 ml-[11px] flex justify-between border-t border-white/15 pt-1.5 font-display text-xs text-white/45">
                  <span>0</span>
                  <span>300</span>
                  <span>600</span>
                  <span>900 mm</span>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-3">
                  <p className="text-[32px] tabular-nums">
                    {cycles.toLocaleString("en-US")}
                    <span className="ml-1.5 text-sm font-medium text-white/55">/ 10,000 次</span>
                  </p>
                  <p className="text-sm font-medium whitespace-nowrap text-[#7ad19a]">● 開合順暢</p>
                </div>
              </div>
              <Link href="/advantages#reports" className="mt-4 flex items-center gap-5 rounded-[18px] bg-white px-5 py-4 text-ink transition duration-300 hover:-translate-y-1">
                <Image src="/certificates/sgs1.jpg" alt="SGS 伸縮帶欄柱耐久測試報告" width={1000} height={1420} sizes="72px" className="w-[72px] shadow-[0_6px_16px_rgba(0,0,0,.18)]" />
                <span className="text-base leading-[1.6]">
                  SGS 伸縮帶欄柱耐久測試
                  <span className="block text-sm font-medium text-muted">拉伸 10,000 次・無可見損壞　看報告 →</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* 03 誠信：服務步驟 */}
      <article className="overflow-x-clip py-24 sm:pt-28 sm:pb-32">
        <div className={container}>
          <ChapterTag name="誠信" />
          <div className="mt-10 flex flex-wrap items-center gap-16">
            <div className="min-w-0 flex-[1_1_420px]">
              <h3 data-reveal className="reveal reveal-left text-[clamp(30px,3vw,44px)] leading-[1.3] font-bold">
                做得到的才答應，
                <br />
                答應的就做到。
              </h3>
              <p data-reveal className="reveal reveal-right mt-6 max-w-[30em] text-lg leading-[1.8] delay-100">
                依場地與需求給規劃建議，說明清楚、承諾實在。不誇大、不隱藏。
              </p>
              <ol data-reveal className="reveal mt-9 delay-200">
                {steps.map((s) => (
                  <li key={s.title} className="border-t border-line py-[18px] last:border-b">
                    <span>
                      <b className="text-lg">{s.title}</b>
                      <span className="mt-1 block text-base leading-[1.7] font-medium text-muted">{s.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <div data-reveal className="reveal mt-9 delay-300">
                <a href="#contact" className={solidBtn}>
                  預約專員諮詢
                </a>
              </div>
            </div>
            <figure data-reveal className="reveal min-w-0 flex-[1_1_420px] delay-100">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[18px]">
                <Image src="/about/specialist.jpg" alt="專員與客戶討論欄柱動線規劃圖" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="mt-3 text-[15px] text-muted">專員依現場平面圖規劃欄柱動線</figcaption>
            </figure>
          </div>
        </div>
      </article>
    </section>
  );
}
