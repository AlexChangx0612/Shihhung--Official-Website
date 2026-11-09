// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入產品目錄（Products 欄列出各產品系列）
import { getCatalog } from "../lib/products";
// 匯入公司聯絡資料
import { company } from "../lib/site";
// 匯入共用版心樣式
import { container } from "../lib/ui";

// 完整地址（顯示與地圖搜尋共用）
const address = `${company.address.region}${company.address.locality}${company.address.street}`;

// 頂部四個賣點：圖示＋短句
const highlights: { label: string; icon: React.ReactNode }[] = [
  // 台灣製造：MIT 字樣
  {
    label: "台灣製造",
    icon: <span className="text-sm font-bold tracking-[0.08em]">MIT</span>,
  },
  // 六國專利：盾牌
  {
    label: "六國專利",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
        className="h-7 w-7"
      >
        <path
          d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z"
          strokeLinejoin="round"
        />
        <path
          d="m8.8 12.2 2.3 2.3 4.3-4.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  // SGS 國際檢驗：圓形勾勾章
  {
    label: "SGS 國際檢驗",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
        className="h-7 w-7"
      >
        <circle cx="12" cy="10" r="6.5" />
        <path
          d="m9.2 10.1 1.9 1.9 3.7-3.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m8.5 15.6-1.6 5.4 5.1-2.2 5.1 2.2-1.6-5.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  // 企業識別客製：筆刷
  {
    label: "企業識別客製",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
        className="h-7 w-7"
      >
        <path d="M20 4 10.5 13.5" strokeLinecap="round" />
        <path
          d="M9.6 14.4c-2.4-.4-4.2 1.2-4.4 3.6-.1 1.2-.8 2-2.2 2.4 3.6 1.4 7.4.4 7.8-3.1.1-1.1-.4-2.3-1.2-2.9Z"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

// 一個連結：中文＋英文並排
type NavLink = { href: string; zh: string; en: string };

// Service 欄
const serviceLinks: NavLink[] = [
  { href: "/catalog", zh: "產品電子目錄", en: "E-Catalog" },
  { href: "/custom", zh: "客製化服務", en: "Customization" },
  { href: "/cases", zh: "客戶實際案例", en: "Case Studies" },
];

// Explore 欄
const exploreLinks: NavLink[] = [
  { href: "/about", zh: "關於世紘", en: "About Us" },
  { href: "/advantages", zh: "國際認證", en: "Certifications" },
  { href: "/#faq", zh: "常見問題", en: "FAQ" },
  { href: "/contact", zh: "聯絡我們", en: "Contact Us" },
];

// Info 欄：項目名稱（中英）＋內容；href 有值時可點擊
const infos: {
  zh: string;
  en: string;
  value: string;
  href?: string;
  external?: boolean;
}[] = [
  // 地址：點擊另開 Google 地圖
  {
    zh: "公司地址",
    en: "Address",
    value: address,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
    external: true,
  },
  // 電話：手機上點擊直接撥號
  {
    zh: "聯絡電話",
    en: "Phone",
    value: company.phone,
    href: company.phoneHref,
  },
  // 傳真：只顯示號碼
  { zh: "傳真號碼", en: "Fax", value: company.fax },
  // Email：點擊開啟寄信程式
  {
    zh: "電子信箱",
    en: "Email",
    value: company.email,
    href: `mailto:${company.email}`,
  },
  // 營業時間
  { zh: "營業時間", en: "Opening Hours", value: company.hours },
];

// 英文大字全大寫轉成首字大寫（例：RETRACTABLE BELT STANCHIONS → Retractable Belt Stanchions；& 保留）
const titleCase = (s: string) =>
  s.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());

// 欄位大標：淺灰細體英文
function ColTitle({ children }: { children: string }) {
  return (
    <h2 className="text-[clamp(40px,3.4vw,52px)] leading-none font-light tracking-[0.01em] text-white/45">
      {children}
    </h2>
  );
}

// 連結清單：中文粗體＋英文；滑鼠移上變半透明
function LinkList({ links }: { links: NavLink[] }) {
  return (
    <ul className="mt-9 space-y-4">
      {links.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            className="inline-flex flex-wrap items-baseline gap-x-3 transition hover:opacity-60"
          >
            <span className="font-bold tracking-[0.06em]">{l.zh}</span>
            <span className="text-[15px] font-medium text-white/90">
              {l.en}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// 頁尾元件（品牌紅底白字）；barOnly 為 true 時只顯示最底部的版權列（聯絡我們頁不重複列出聯絡資訊）
export default function SiteFooter({ barOnly = false }: { barOnly?: boolean }) {
  // 只留版權列
  if (barOnly)
    return (
      <footer className="bg-brand-deep text-white">
        <FooterBar />
      </footer>
    );

  // Products 欄：各產品系列
  const productLinks: NavLink[] = getCatalog().categories.map((c) => ({
    href: `/products/${c.slug}`,
    zh: c.name,
    en: titleCase(c.en),
  }));

  return (
    <footer className="bg-brand-deep text-white">
      {/* 頂部四個賣點：平板以上一列四個、手機兩兩一列；下方細線 */}
      <div className="border-b border-white/30">
        <ul
          className={`${container} grid grid-cols-2 gap-y-5 py-6 lg:grid-cols-4`}
        >
          {highlights.map((h) => (
            <li
              key={h.label}
              className="flex items-center justify-center gap-4"
            >
              <span className="flex h-8 min-w-8 items-center justify-center">
                {h.icon}
              </span>
              <span className="text-base font-bold tracking-[0.08em] sm:text-lg">
                {h.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 四欄：Products／Service／Explore／Info；右上角圓形回到頂部按鈕 */}
      <div
        className={`${container} relative grid gap-14 pt-24 pb-20 sm:grid-cols-2 sm:pt-32 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:gap-10 lg:pt-36`}
      >
        <div>
          <ColTitle>Products</ColTitle>
          <LinkList links={productLinks} />
        </div>
        <div>
          <ColTitle>Service</ColTitle>
          <LinkList links={serviceLinks} />
        </div>
        <div>
          <ColTitle>Explore</ColTitle>
          <LinkList links={exploreLinks} />
        </div>
        <div>
          <ColTitle>Info.</ColTitle>
          <dl className="mt-9 space-y-7">
            {infos.map((c) => (
              <div key={c.zh}>
                {/* 項目名稱：中文粗體＋英文 */}
                <dt className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-bold tracking-[0.06em]">{c.zh}</span>
                  <span className="text-[15px] font-medium text-white/90">
                    {c.en}
                  </span>
                </dt>
                {/* 內容：可點擊的項目滑鼠移上變半透明 */}
                <dd className="mt-1.5 tracking-[0.04em] text-white/90">
                  {c.href ? (
                    <a
                      href={c.href}
                      // 外部連結另開新分頁
                      {...(c.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="break-all transition hover:opacity-60"
                    >
                      {c.value}
                    </a>
                  ) : (
                    c.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 回到頂部：白色圓形按鈕；手機放在右上角，電腦放在四欄右上方 */}
        <a
          href="#"
          aria-label="回到頂部"
          className="absolute top-8 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-deep transition hover:-translate-y-0.5 hover:bg-white/85 sm:right-8 lg:top-24 lg:right-12"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m3 9 4-4 4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      {/* 最底部版權列 */}
      <FooterBar />
    </footer>
  );
}

// 最底部版權列（深一階的品牌紅底）：白色 LOGO＋公司名稱、LINE、版權聲明
export function FooterBar() {
  return (
    <div className="bg-[#b5161f]">
      <div
        className={`${container} flex flex-col items-center gap-6 py-10 text-center sm:flex-row sm:flex-wrap sm:gap-x-10 sm:text-left`}
      >
        {/* 白色 LOGO ＋ 分隔線 ＋ 公司名稱 */}
        <span className="flex items-center gap-3">
          <Image
            src="/brand/logo-shung-white.png"
            alt=""
            width={240}
            height={139}
            className="h-8 w-auto"
          />
          <span aria-hidden="true" className="h-6 w-px bg-white/40" />
          <span className="text-lg font-bold tracking-[0.2em]">
            {company.name}
          </span>
        </span>
        {/* LINE 官方帳號 */}
        <a
          href={company.line}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="加入世紘 LINE 官方帳號"
          className="flex min-h-11 min-w-11 items-center justify-center transition hover:opacity-60"
        >
          <Image
            src="/brand/line-icon.png"
            alt=""
            width={24}
            height={24}
            className="h-6 w-6"
          />
        </a>
        {/* 版權聲明，年份自動抓今年 */}
        <span className="text-xs tracking-[0.04em] text-white/85">
          © {new Date().getFullYear()} {company.name}. All rights reserved.
        </span>
      </div>
    </div>
  );
}
