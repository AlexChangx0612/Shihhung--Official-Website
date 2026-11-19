"use client";
// 首頁「產品系列」玻璃展示櫃輪播：13 張系列卡片排成一列，左右按鈕一次滑一張，滑到底無縫回到第一張
// 背景是暖白底＋品牌紅柔光＋4 個零散的向量 LOGO
// 匯入 React 副作用、參照與狀態
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入卡片型別（只匯入型別，不會把讀檔程式帶進瀏覽器）
import type { CollectionCard } from "../lib/collections";
// 匯入循環計算（純函式，client 可用）
import { rangeLabel, wrapIndex } from "../lib/collections-math";
// 匯入元件樣式（玻璃、反光、輪播、背景）
import s from "./CollectionsVitrine.module.css";

// 背景 LOGO：位置（左、上）、寬度（依畫面寬等比縮放，最大 340/210/380/150px）、旋轉、透明度
const LOGOS = [
  { left: "10%", top: "78%", width: "clamp(187px,23.6vw,340px)", r: "-6deg", o: 0.13 },
  { left: "46%", top: "22%", width: "clamp(116px,14.6vw,210px)", r: "5deg", o: 0.11 },
  { left: "88%", top: "60%", width: "clamp(209px,26.4vw,380px)", r: "-3deg", o: 0.12 },
  { left: "66%", top: "95%", width: "clamp(82px,10.4vw,150px)", r: "8deg", o: 0.09 },
];

// 捲動停止的備援等待時間（瀏覽器不支援 scrollend 時使用）
const SETTLE_MS = 150;
// 左右按鈕滑一張的動畫時間
const SLIDE_MS = 500;
// 緩動曲線：第一下用慢起慢停；動畫進行中又按，已在移動，改用直接減速收尾，避免中途停頓
const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);

// 小箭頭（卡片名牌右側圓鈕、查看所有系列）
function Arrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

// 單張玻璃展示櫃卡片
function Case({ card }: { card: CollectionCard }) {
  return (
    <Link href={card.href} className={s.case} aria-label={`${card.name}，${card.count} 款，查看系列所有產品`}>
      {/* 櫃內：去背產品圖靠底置中，下方有落地陰影 */}
      <div className={s.show}>
        <div className={s.shot}>
          {/* 不延遲載入：避免點按鈕時新滑進來的卡片才開始載圖、解碼，造成滑動卡頓 */}
          <Image src={card.image} alt="" fill loading="eager" sizes="(max-width:640px) 60vw, (max-width:1024px) 33vw, 25vw" className={s.img} />
        </div>
      </div>
      {/* 名牌：系列名稱＋英文簡稱・款數＋箭頭圓鈕 */}
      <div className={s.tag}>
        <div>
          <h3 className={s.name}>{card.name}</h3>
          <div className={s.meta}>
            {/* 英文簡稱：平板與手機隱藏 */}
            <span className={s.en}>{card.en} · </span>
            <b>{card.count}</b> 款
          </div>
        </div>
        <span className={s.go} aria-hidden="true">
          <Arrow />
        </span>
      </div>
    </Link>
  );
}

// 輪播元件
export default function CollectionsVitrine({ cards }: { cards: CollectionCard[] }) {
  // 系列數（實際分類數，不寫死）
  const n = cards.length;
  // 軌道元素
  const trackRef = useRef<HTMLUListElement>(null);
  // 目前第一張可見卡片在軌道中的索引（真卡從 n 開始）；視窗縮放時用來重新對齊
  const cur = useRef(n);
  // 按鈕平滑捲動中的目標索引（捲動停止後清掉）
  const target = useRef<number | null>(null);
  // 按鈕滑動動畫的畫面排程編號（0 表示沒有在動畫）
  const anim = useRef(0);
  // 位置文字（伺服器端先用電腦版 4 張，掛載後依實際寬度更新）
  const [label, setLabel] = useState(() => rangeLabel(0, 4, n));

  // 量一張卡的捲動距離：卡寬＋間距（每次重新量，縮放視窗後仍正確）
  const step = () => {
    const track = trackRef.current!;
    const li = track.firstElementChild as HTMLElement;
    return li.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || "0");
  };

  // 不帶動畫地跳到第 i 張（暫時關掉平滑捲動）
  const jumpTo = (i: number) => {
    const track = trackRef.current!;
    track.style.scrollBehavior = "auto";
    track.scrollLeft = i * step();
    track.style.scrollBehavior = "";
    cur.current = i;
  };

  // 依目前捲動位置更新位置文字
  const updateLabel = () => {
    const track = trackRef.current;
    if (!track) return;
    const st = step();
    const idx = Math.round(track.scrollLeft / st);
    // 一次可見張數取整數（手機 1.6 張 → 2），限制在 1..n
    const perView = Math.min(n, Math.max(1, Math.round(track.clientWidth / st)));
    setLabel(rangeLabel(wrapIndex(idx - n, n), perView, n));
  };

  // 捲動停止後：若停在前後複製區，不帶動畫地換回對應的真卡片位置
  const settle = () => {
    const track = trackRef.current;
    // 按鈕動畫進行中每格都會觸發捲動事件，等動畫結束再處理
    if (!track || anim.current) return;
    target.current = null;
    const idx = Math.round(track.scrollLeft / step());
    if (idx < n) jumpTo(idx + n);
    else if (idx >= 2 * n) jumpTo(idx - n);
    else cur.current = idx;
    updateLabel();
  };

  // 掛載後先把捲動位置放到真卡第一張（畫面繪製前完成，看不到複製卡片）
  useLayoutEffect(() => {
    jumpTo(n);
    updateLabel();
    // 只在掛載時執行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 監聽捲動停止、捲動中更新位置文字、視窗縮放重新對齊
  useEffect(() => {
    const track = trackRef.current!;
    // 瀏覽器是否支援 scrollend
    const hasScrollEnd = "onscrollend" in window;
    // 備援計時器與手指是否按著
    let timer = 0;
    let touching = false;
    // 位置文字的畫面更新排程
    let raf = 0;

    // 備援：最後一次捲動後 150ms 視為停止（手指還按著就不換位）
    const debounce = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!touching) settle();
      }, SETTLE_MS);
    };
    // 捲動中：每個畫面更新一次位置文字；不支援 scrollend 時重新計時
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateLabel);
      if (!hasScrollEnd) debounce();
    };
    // 手指按下／放開（備援模式下，放開後才開始計時）
    const onTouchStart = () => {
      touching = true;
    };
    const onTouchEnd = () => {
      touching = false;
      if (!hasScrollEnd) debounce();
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    if (hasScrollEnd) track.addEventListener("scrollend", settle);
    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchend", onTouchEnd, { passive: true });
    track.addEventListener("touchcancel", onTouchEnd, { passive: true });

    // 視窗縮放（寬度改變）：卡寬跟著變，把目前那張重新對齊到左邊緣，並更新位置文字
    let lastWidth = track.clientWidth;
    const ro = new ResizeObserver(() => {
      if (track.clientWidth === lastWidth) return;
      lastWidth = track.clientWidth;
      jumpTo(cur.current);
      updateLabel();
    });
    ro.observe(track);

    return () => {
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("scrollend", settle);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchend", onTouchEnd);
      track.removeEventListener("touchcancel", onTouchEnd);
      ro.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(anim.current);
    };
    // 只在掛載時綁定一次（函式內都透過 ref 讀最新的 DOM）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 左右按鈕：一次捲動一張（卡寬＋間距），用自己的動畫控制速度曲線；使用者偏好減少動態時直接跳過去
  // 動畫還沒停時又按：從上一次的目標再往前一張（連按幾次就走幾張，不會少算）
  const go = (dir: 1 | -1) => {
    const track = trackRef.current!;
    const st = step();
    const base = target.current ?? Math.round(track.scrollLeft / st);
    target.current = base + dir;
    const to = target.current * st;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.scrollTo({ left: to });
      return;
    }
    const ease = anim.current ? easeOut : easeInOut;
    cancelAnimationFrame(anim.current);
    const from = track.scrollLeft;
    const t0 = performance.now();
    // 動畫期間關掉吸附與 CSS 平滑捲動，否則每格設定位置都會被瀏覽器拉回或再補動畫
    track.style.scrollSnapType = "none";
    track.style.scrollBehavior = "auto";
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / SLIDE_MS);
      track.scrollLeft = from + (to - from) * ease(p);
      if (p < 1) {
        anim.current = requestAnimationFrame(tick);
        return;
      }
      // 停在卡片對齊位置後才恢復吸附，再做循環換位
      anim.current = 0;
      track.style.scrollSnapType = "";
      track.style.scrollBehavior = "";
      settle();
    };
    anim.current = requestAnimationFrame(tick);
  };

  // 焦點在輪播內時，左右方向鍵等同按鈕
  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  // 反光跟著游標：把游標在卡片內的位置寫進 CSS 變數
  const onPointerMove = (e: PointerEvent<HTMLUListElement>) => {
    const c = (e.target as HTMLElement).closest<HTMLElement>(`.${s.case}`);
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    c.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  // 軌道：[複製全部] [真卡] [複製全部]；複製的不可聚焦、讀屏不念
  const slides = [0, 1, 2].flatMap((set) => cards.map((card) => ({ card, set })));
  // 位置文字拆成「第一張號碼」與其餘，第一張號碼加深紅
  const [first, ...rest] = label.split(" ");

  return (
    <div className={s.root}>
      {/* 背景：向量 LOGO 零散分布（SVG，放大也清晰） */}
      <div className={s.scatter} aria-hidden="true">
        {LOGOS.map((l, i) => (
          <Image
            key={i}
            src="/brand/logo-shung.svg"
            alt=""
            width={822}
            height={478}
            unoptimized
            className={s.logo}
            style={{ left: l.left, top: l.top, width: l.width, height: "auto", ["--r" as string]: l.r, ["--o" as string]: l.o }}
          />
        ))}
      </div>
      {/* 背景：三團品牌紅柔光 */}
      <div className={`${s.glow} ${s.g1}`} aria-hidden="true" />
      <div className={`${s.glow} ${s.g2}`} aria-hidden="true" />
      <div className={`${s.glow} ${s.g3}`} aria-hidden="true" />

      {/* 區塊頭：標題＋說明，右側「查看所有系列」 */}
      <div className={s.head}>
        <div>
          <h2 id="collections-title" className={s.title}>
            產品系列
          </h2>
          <p className={s.desc}>{n} 大系列，全系列台灣製造。點選系列，查看該系列所有產品。</p>
        </div>
        <Link href="/products" className={s.all}>
          查看所有系列
          <Arrow />
        </Link>
      </div>

      {/* 輪播：左按鈕、軌道、右按鈕（循環，按鈕永不停用） */}
      {/* 用 group 而非 region：外層 section 已是「產品系列」地標，避免讀屏出現兩個同名地標 */}
      <div className={s.rail} role="group" aria-roledescription="輪播" aria-label="產品系列輪播">
        <button type="button" className={s.nav} aria-label="上一個系列" onClick={() => go(-1)}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 10H4M9 5l-5 5 5 5" />
          </svg>
        </button>
        <ul ref={trackRef} className={s.track} onKeyDown={onKeyDown} onPointerMove={onPointerMove}>
          {slides.map(({ card, set }) => (
            <li key={`${set}-${card.slug}`} aria-hidden={set !== 1 ? true : undefined} inert={set !== 1}>
              <Case card={card} />
            </li>
          ))}
        </ul>
        <button type="button" className={s.nav} aria-label="下一個系列" onClick={() => go(1)}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </button>
      </div>
      {/* 目前位置，例「01 – 04 / 13」 */}
      <p className={s.count} aria-live="polite">
        <b>{first}</b> {rest.join(" ")}
      </p>
    </div>
  );
}
