"use client";

// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入捲動進場（與規格表相同：進入畫面時播放一次）
import { useLedgerReveal } from "./SpecLedger";
// 匯入場所卡片型別
import type { PlaceCard } from "../lib/place-cards";

// 適用場所：照片卡片（白框圓角、照片內嵌），卡片下方為註解；手機橫向滑動，電腦每張固定五分之一寬並置中（不論幾張都置中）
export default function PlaceCards({ cards }: { cards: PlaceCard[] }) {
  const ref = useLedgerReveal();
  return (
    <div ref={ref}>
      <ul className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:justify-center lg:gap-5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
        {cards.map((c, i) => (
          <li key={c.title} className="place-card w-[72%] flex-none snap-start sm:w-[42%] lg:w-[calc((100%-5rem)/5)]" style={{ "--i": i } as React.CSSProperties}>
            <figure>
              {/* 卡片：白框、照片內嵌，滑鼠移上照片緩慢放大、卡片微微浮起 */}
              <div className="group rounded-[18px] bg-white p-2 shadow-[0_0_0_1px_rgba(15,15,14,.06)] transition duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(214,31,42,.18),0_22px_40px_-26px_rgba(15,15,14,.45)]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[12px]">
                  <Image
                    src={c.image}
                    alt={c.alt}
                    fill
                    sizes="(min-width: 1024px) 18vw, (min-width: 640px) 42vw, 72vw"
                    style={{ objectPosition: c.position }}
                    className="object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.06]"
                  />
                  {/* 底部漸層：讓標題在照片上清楚可讀 */}
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/65 to-transparent" />
                  <p className="absolute inset-x-4 bottom-4 text-lg leading-snug font-black text-white">{c.title}</p>
                </div>
              </div>
              {/* 註解：卡片下方，紅色短線＋灰字說明 */}
              <figcaption className="mt-4 flex gap-3 px-1 text-sm leading-[1.75] text-muted">
                <span aria-hidden="true" className="mt-[13px] h-px w-3 flex-none bg-brand" />
                {c.note}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
