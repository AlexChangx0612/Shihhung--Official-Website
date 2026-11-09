// 「關於世紘」與「國際認證」共用的區塊：滿版照片頁首、紅底數字帶
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入麵包屑
import Breadcrumbs from "./Breadcrumbs";
// 匯入數字滾動
import CountUp from "./CountUp";
// 匯入麵包屑型別
import type { Crumb } from "../lib/site";
// 匯入共用樣式
import { container } from "../lib/ui";

// 頁首：滿版照片橫幅（圓角，左右與浮動 header 對齊），照片上加深色漸層，左側疊白字：
// 麵包屑、英文小標、中文大標、說明與一個連結
export function PhotoHero({
  crumbs,
  eyebrow,
  title,
  subtitle,
  link,
  image,
}: {
  crumbs: Crumb[];
  // 英文小標（例：About Shung）
  eyebrow: string;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  // 玻璃按鈕連結（沒給就不顯示按鈕）
  link?: { href: string; label: string };
  // 背景照片；position 為裁切對齊位置（object-position）
  image: { src: string; alt: string; position?: string };
}) {
  return (
    <section className="px-2 pt-24 sm:px-6 sm:pt-28 lg:px-10 lg:pt-44">
      <div className="relative isolate flex min-h-[520px] items-center overflow-hidden rounded-[18px] bg-ink text-white lg:min-h-[600px] lg:rounded-[22px]">
        {/* 背景照片 */}
        <Image
          src={image.src}
          alt={image.alt}
          fill
          preload
          sizes="100vw"
          className="-z-10 object-cover"
          style={{ objectPosition: image.position }}
        />
        {/* 深色漸層：左邊深、右邊透，讓白字清楚 */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/45 to-black/10"
        />
        <div className={`${container} py-16`}>
          {/* 麵包屑：改成白字 */}
          <div className="[&_[aria-current]]:text-white [&_a:hover]:text-white [&_ol]:text-white/70">
            <Breadcrumbs items={crumbs} />
          </div>
          <p className="mt-10 text-[clamp(18px,1.6vw,24px)] font-normal tracking-[0.02em]">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-[clamp(40px,4.6vw,64px)] leading-tight font-bold">
            {title}
          </h1>
          <p className="mt-6 max-w-[34em] text-base leading-[1.9] sm:text-lg">
            {subtitle}
          </p>
          {/* 玻璃按鈕：半透明白底＋背景模糊＋細白框，上緣內光；滑鼠移上時一道光從左掃到右 */}
          {link && (
            <Link
              href={link.href}
              className="group relative mt-10 inline-flex min-h-12 items-center gap-3 overflow-hidden rounded-full border border-white/35 bg-white/10 px-7 text-base font-medium tracking-[0.06em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.45),0_8px_32px_-8px_rgba(0,0,0,.45)] backdrop-blur-md transition duration-300 hover:border-white/60 hover:bg-white/20"
            >
              {/* 透光：斜向白色光帶，平時藏在按鈕左外側，滑鼠移上時掃過 */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 transition-[left,opacity] duration-700 ease-out group-hover:left-[120%] group-hover:opacity-100 motion-reduce:hidden"
              />
              <span className="relative">{link.label}</span>
              <span
                aria-hidden="true"
                className="relative transition group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

// 數字帶：紅底白字；value 為數字（會滾動），unit 接在數字後，label 為下方說明；title 有值時顯示在上方
export function StatBand({
  title,
  stats,
}: {
  title?: string;
  stats: { value: string; unit?: string; extra?: string; label: string }[];
}) {
  return (
    <section className="mt-28 bg-brand-deep text-white">
      <div className={`${container} py-20`}>
        {title ? (
          <h2 className="text-[clamp(24px,2.2vw,32px)] font-bold">{title}</h2>
        ) : (
          <h2 className="sr-only">世紘興業的基本資料</h2>
        )}
        <div
          className={`grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-10 ${title ? "mt-12" : ""}`}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="flex items-baseline text-[clamp(44px,4.4vw,64px)] leading-none font-bold whitespace-nowrap">
                {/[0-9]/.test(s.value) ? <CountUp value={s.value} /> : s.value}
                {s.unit && <span className="ml-[0.2em]">{s.unit}</span>}
                {s.extra && (
                  <span className="ml-[0.5em] text-[clamp(22px,2vw,28px)]">
                    {s.extra}
                  </span>
                )}
              </p>
              <p className="mt-4 text-base leading-[1.6]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
