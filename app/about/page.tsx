// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入左文右圖頁首與紅底數字帶
import { SplitHero, StatBand } from "../components/AboutBlocks";
// 匯入客製織帶牆
import BeltWall from "../components/BeltWall";
// 匯入數字滾動
import CountUp from "../components/CountUp";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入三支欄柱以織帶圍出動線的畫面
import OrderStage from "../components/OrderStage";
// 匯入內頁外框
import PageShell from "../components/PageShell";
// 匯入做事的三個原則
import Principles from "../components/Principles";
// 匯入產品目錄
import { getCatalog } from "../lib/products";
// 匯入 SEO 工具
import { absoluteUrl, company, ORG_ID, organizationJsonLd, pageMetadata } from "../lib/site";
// 匯入共用樣式
import { container, textLink } from "../lib/ui";

// 理念區塊下方展示的其他產品系列（slug 同時對應產品頁網址與去背圖檔名）
const otherSeries = [
  { slug: "digital-signage-lightbox", name: "數位看板・燈箱" },
  { slug: "bulletin-boards", name: "佈告欄" },
  { slug: "waste-recycling", name: "垃圾桶・資源回收" },
  { slug: "rope-stanchions", name: "迎賓欄柱" },
  { slug: "plastic-stanchions", name: "塑膠欄柱" },
];

// 頁面描述
const description =
  "世紘興業有限公司成立於2015年，專注公共與商業空間周邊設備的研製與供應，全系列台灣精密製造、嚴謹品質管理，產品取得多國專利並通過第三方檢驗，以「創新、品質、誠信」服務企業、政府機關、學校與各類公共空間。";

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "關於世紘｜公共與商業空間設備專業供應商｜世紘興業",
  description,
  path: "/about",
});

// 客戶案例圖：第一張放大（佔 2×2 格）
const cases = [
  { href: "/cases/xiaomi-store", image: "/cases/xiaomi-store/02.jpg", alt: "小米門市入口的黑色伸縮帶欄柱與印有品牌標誌的紅色織帶", label: "小米門市・品牌印字織帶" },
  { href: "/cases/chihai-cultural-park", image: "/cases/chihai-cultural-park/01-sign.jpg", alt: "經國七海文化園區入口石碑", label: "經國七海文化園區" },
  { href: "/cases/barrier-printing-portfolio", image: "/cases/barrier-printing-portfolio/01.jpg", alt: "新光華山金融中心人行道上的黑色客製印刷拒馬", label: "新光華山金融中心・客製拒馬" },
  { href: "/cases/kham-art-ntsec", image: "/cases/kham-art-ntsec/04.jpg", alt: "士林科教館樂高特展展台旁的黑色欄柱", label: "寬宏藝術・士林科教館佈展" },
  { href: "/cases/tsg-hawks", image: "/cases/tsg-hawks/01.jpg", alt: "印有 TSG HAWKS 字樣的綠色織帶", label: "台鋼雄鷹・球隊印字織帶" },
];

// 關於世紘頁
export default function AboutPage() {
  // 產品分類（系列數）與品項數（型號數）
  const { categories } = getCatalog();
  const models = categories.reduce((n, c) => n + c.items.length, 0);

  return (
    <PageShell>
      {/* 結構化資料：組織＋關於頁 */}
      <JsonLd
        data={[
          organizationJsonLd(),
          { "@type": "AboutPage", name: "關於世紘", description, url: absoluteUrl("/about"), about: { "@id": ORG_ID } },
        ]}
      />

      {/* 頁首：左文右圖 */}
      <SplitHero
        crumbs={[{ name: "首頁", path: "/" }, { name: "關於世紘", path: "/about" }]}
        title="關於世紘"
        subtitle={`世紘興業 ${company.foundingYear} 年在新北林口成立，設計與製造伸縮帶欄柱、紅龍柱、告示牌等公共空間設備，${categories.length} 個產品系列全部在台灣生產。`}
        link={{ href: "/products", label: "瀏覽產品系列" }}
      >
        <figure>
          <div className="relative aspect-[16/10]">
            {/* 直式圖裁成 16:10，往上對齊，保留公司招牌與織帶 */}
            <Image src="/about/branding-stanchions.jpg" alt="世紘興業公司招牌前，兩支黑色伸縮帶欄柱拉開印有世紘標誌的紅色織帶" fill preload sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-[center_10%]" />
          </div>
          <figcaption className="mt-3 text-[15px] text-muted">世紘興業：印上 Shung 標誌的伸縮帶欄柱</figcaption>
        </figure>
      </SplitHero>

      {/* 紅底數字帶 */}
      <StatBand
        stats={[
          { value: company.foundingYear, label: "在新北林口成立" },
          { value: String(categories.length), label: "個產品系列" },
          { value: String(models), label: "項產品型號" },
          { value: "台灣", label: "全系列在地製造" },
        ]}
      />

      {/* 理念：左文（宋體標語）右圖（三支欄柱以織帶圍出動線＋其他系列小卡） */}
      <section className={`${container} flex flex-wrap items-center gap-16 pt-40`}>
        <div className="min-w-0 flex-[1_1_420px]">
          {/* 依語意手動斷行，每行一個完整片語 */}
          <h2 className="font-serif text-[clamp(24px,2.6vw,40px)] leading-[1.45] font-black">
            每一項細節，
            <br />
            世紘都用近乎<span className="text-brand-deep">「苛刻」</span>的標準
            <br />
            反覆審視，只為了交給您
            <br />
            最好的產品。
          </h2>
          <p className="mt-8 text-base leading-[1.9]">
            從伸縮帶欄柱、海報架與告示牌，
            <br />
            到傘架、資源回收桶與推車，
            <br />
            13&nbsp;個產品系列，全在台灣製造、自己把關。
          </p>
          <p className="mt-5 text-base leading-[1.9]">
            它們站在銀行櫃台、醫院掛號、
            <br />
            機場報到大廳，也站在百貨、學校與車站。
            <br />
            好的設備不搶眼，只是讓人流順暢、
            <br />
            讓空間有序、讓使用的人安心。
          </p>
        </div>
        <div className="min-w-0 flex-[1.1_1_500px]">
          <OrderStage />
          {/* 其他系列小卡：點擊進入該系列產品頁 */}
          <div className="mt-6 border-t border-black/15 pt-5">
            <p className="text-[13px] text-muted">全系列共 13 類，以下為部分系列</p>
            <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {otherSeries.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/products/${s.slug}`}
                    className="flex h-full flex-col items-center gap-2 rounded-xl bg-white px-2 py-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-10px_rgba(0,0,0,0.3)]"
                  >
                    <span className="relative h-16 w-full">
                      <Image src={`/cutouts/${s.slug}.png`} alt="" fill sizes="96px" className="object-contain" />
                    </span>
                    <span className="text-center text-[12px] leading-tight">{s.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 客戶案例：第一張大圖，其餘四張小圖 */}
      <section className={`${container} pt-40`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-[clamp(30px,3vw,44px)] leading-[1.3] font-bold">我們的設備，站在這些地方</h2>
            <p className="mt-4 text-base leading-[1.7]">寺廟、門市、文化園區、商辦與展覽，每一張都是客戶現場。</p>
          </div>
          <Link href="/cases" className={textLink}>
            看全部客戶案例 →
          </Link>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cases.map((c, i) => (
            <li key={c.href} className={i === 0 ? "sm:col-span-2 lg:row-span-2" : ""}>
              <Link href={c.href} className="group flex h-full flex-col">
                <div className={`relative overflow-hidden ${i === 0 ? "aspect-[4/3] lg:aspect-auto lg:min-h-[360px] lg:flex-1" : "aspect-[4/3]"}`}>
                  <Image src={c.image} alt={c.alt} fill sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"} className="object-cover transition duration-700 group-hover:scale-[1.03]" />
                </div>
                <span className="mt-3 text-[15px] group-hover:text-brand-deep">{c.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 客製織帶牆（兩列預告，完整的在世紘優勢頁） */}
      <section className="pt-24">
        <BeltWall rows={[0, 3]} label="世紘承接過的客製伸縮帶印刷圖樣" />
        <div className={`${container} flex flex-wrap items-center justify-between gap-4 pt-6`}>
          <h2 className="text-xl font-bold">
            還有 <CountUp value="61" /> 款客製織帶，從品牌門市到宮廟與學校
          </h2>
          <Link href="/advantages#belts" className={textLink}>
            看全部客製織帶 →
          </Link>
        </div>
      </section>

      {/* 做事的三個原則：白底，開場織帶隨捲動拉開，每個原則附上證據 */}
      <Principles />
    </PageShell>
  );
}
