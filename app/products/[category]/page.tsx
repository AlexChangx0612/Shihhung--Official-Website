// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Google 字型：本頁另外載入 Noto Sans TC 的 400／500／700（全站只載入 700／900）
import { Noto_Sans_TC } from "next/font/google";
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入 404 處理
import { notFound } from "next/navigation";
// 匯入滿版照片頁首
import { PhotoHero } from "../../components/AboutBlocks";
// 匯入麵包屑
import Breadcrumbs from "../../components/Breadcrumbs";
// 匯入常見問題型別
import type { Faq } from "../../components/FaqList";
// 匯入結構化資料元件
import JsonLd from "../../components/JsonLd";
// 匯入手機版「顯示全部」按鈕
import MobileShowAll from "../../components/MobileShowAll";
// 匯入內頁外框
import PageShell from "../../components/PageShell";
// 匯入區塊標題
import SectionTitle from "../../components/SectionTitle";
// 匯入分類頁文字內容
import { categoryContent } from "../../lib/category-content";
// 匯入適用場所照片
import { placeCards, type PlaceCard } from "../../lib/place-cards";
// 匯入產品目錄
import { getCatalog, getCategory, type CatalogItem } from "../../lib/products";
// 匯入 SEO 工具
import { absoluteUrl, faqJsonLd, ORG_ID, pageMetadata } from "../../lib/site";
// 匯入共用樣式
import { card, cardHover, container, outlineBtn, pageTop, section } from "../../lib/ui";

// 字重示範用字型：只套用在產品系列頁內容（內文 400、小標與型號 500、標題 700）
// 確認效果後若推到全站，改在 app/layout.tsx 的 notoSans 補上 400／500，並移除這裡
const productSans = Noto_Sans_TC({
  // 內文、小標、標題三種粗細
  weight: ["400", "500", "700"],
  // 字型下載完成前先用系統字顯示
  display: "swap",
  // 不預先載入（中文字型檔很大）
  preload: false,
});

// 系列頁首照片（public/product-heroes）；有照片的系列改用滿版照片頁首，其餘維持去背圖版型
// position／mobilePosition 為電腦版／手機版的裁切對齊位置
const heroImages: Record<string, { alt: string; position?: string; mobilePosition?: string }> = {
  "retractable-belt-stanchions": {
    alt: "明亮的服務大廳裡，五支鍍鉻伸縮帶欄柱以紅色織帶圍出通往櫃台的排隊動線",
    position: "50% 100%",
    mobilePosition: "72% 50%",
  },
  "rope-stanchions": {
    alt: "飯店宴會廳入口的大理石廊道上，四支金色圓球頭迎賓欄柱掛著酒紅色絨布繩，引導賓客走向敞開的宴會廳大門",
    position: "50% 50%",
    mobilePosition: "72% 50%",
  },
  "exhibition-stanchions": {
    alt: "美術館展廳的石材地板上，四支黑色展覽欄柱以細繩相連，圍出畫作前的參觀界線",
    position: "50% 70%",
    mobilePosition: "70% 50%",
  },
  "plastic-stanchions": {
    alt: "室內停車場的灰色地坪上，三支紅白相間與三支黃黑相間的塑膠警示欄柱，各以同色塑膠鏈條相連，圍出兩塊區域",
    position: "50% 60%",
    mobilePosition: "70% 50%",
  },
  barriers: {
    alt: "辦公大樓車道入口的石材地面上，兩組紅色烤漆拒馬並排擋在入口前",
    position: "50% 60%",
    mobilePosition: "75% 50%",
  },
  "poster-sign-stands": {
    alt: "挑高大廳的石材接待櫃台上，一座黑框圓盤底座的桌上型雙面海報架，後方地面立著一座銀框可調高度的落地海報架",
    position: "50% 50%",
    mobilePosition: "82% 50%",
  },
  "bulletin-boards": {
    alt: "陽光灑落的明亮走廊上，一座附輪移動式佈告欄，綠色布面以黑色支架撐起，上面釘著幾張紙張與便利貼",
    position: "50% 55%",
    mobilePosition: "82% 50%",
  },
  "digital-signage-lightbox": {
    alt: "餐廳入口的石材地面上，一座黑色弧形單腳立架、圓盤底座的數位看板，橫式螢幕顯示一道香煎魚排料理，後方是採光明亮的用餐區",
    position: "50% 50%",
    mobilePosition: "75% 50%",
  },
  "waste-recycling": {
    alt: "辦公大樓雨遮下的石材廊道旁，沿牆排列著紅綠帶輪回收桶、掛著半透明垃圾袋的彩色蓋折疊分類回收架、不鏽鋼二分類與四分類回收桶、煙灰缸垃圾桶、腳踏垃圾桶與立式煙灰缸",
    position: "50% 55%",
    mobilePosition: "76% 50%",
  },
  "cleaning-hygiene": {
    alt: "明亮的大樓入口大廳，一座黑色立柱圓盤底座的立式感應給皂機立在自動門前，門外是綠意",
    position: "50% 50%",
    mobilePosition: "75% 50%",
  },
  "umbrella-stands": {
    alt: "雨天的大樓入口內側，一座黑色 A 字形摺疊傘架插著三把收好的長柄雨傘，窗外下著雨",
    position: "50% 50%",
    mobilePosition: "80% 50%",
  },
  "carts-tool-carts": {
    alt: "高窗採光的淺灰地坪後場設備間裡，前方是紅黑鐵製工具車與折疊式手推車，周圍停放紅色三層工作推車、黑色房務整備車、帆布汙衣推車、不鏽鋼抽屜工具車、掛桶全配型工作推車與不鏽鋼工作桌",
    position: "50% 55%",
    mobilePosition: "72% 50%",
  },
  "key-boxes": {
    alt: "服務櫃台後方陽光灑落的牆面上，錯落掛著門板打開、掛滿鑰匙與彩色號碼牌的淺藍灰色鑰匙箱，以及不鏽鋼巡邏箱、信箱與意見箱；木質櫃台上放著筆筒、小盆栽與一疊信封",
    position: "50% 50%",
    mobilePosition: "78% 50%",
  },
};

// 只產生已知的分類頁，其他網址回傳 404
export const dynamicParams = false;

// 建置時產生所有分類頁
export function generateStaticParams() {
  return getCatalog().categories.map((c) => ({ category: c.slug }));
}

// 每個分類頁各自的標題、描述與 canonical
export async function generateMetadata({ params }: PageProps<"/products/[category]">): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  const content = categoryContent[category];
  if (!cat || !content) return {};
  return pageMetadata({ title: content.title, description: content.description, path: `/products/${cat.slug}`, image: cat.images[0] });
}

// 頁尾前的小段落：細線上緣，標題在上、內容滿版
function GuidePart({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24 border-t border-ink/15 pt-8 pb-20 sm:scroll-mt-28 sm:pt-10 sm:pb-28">
      <h2 className="text-2xl font-bold text-ink sm:text-[32px]">{title}</h2>
      <div className="mt-8 sm:mt-10">{children}</div>
    </div>
  );
}

// 適用場所：照片＋短標題；手機與平板橫向滑動，電腦每張固定五分之一寬並置中（3、4、5 張都置中）
function PlaceStrip({ cards }: { cards: PlaceCard[] }) {
  return (
    <ul className="-mx-5 flex snap-x scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:justify-center lg:gap-5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
      {cards.map((c) => (
        <li key={c.title} className="w-[60%] flex-none snap-start sm:w-[32%] lg:w-[calc((100%-5rem)/5)]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[14px] bg-white lg:rounded-[18px]">
            <Image src={c.image} alt={c.alt} fill sizes="(min-width: 1440px) 270px, (min-width: 1024px) 19vw, (min-width: 640px) 32vw, 60vw" style={{ objectPosition: c.position }} className="object-cover" />
          </div>
          <p className="mt-4 text-base font-medium text-ink sm:text-lg">{c.title}</p>
        </li>
      ))}
    </ul>
  );
}

// 常見問題：細線分隔的展開列（原生 details，不需 JavaScript；收合時答案仍在 HTML 中，搜尋引擎可讀取）
function FaqLines({ faqs }: { faqs: Faq[] }) {
  return (
    <div>
      {faqs.map((f) => (
        <details key={f.q} className="group border-b border-ink/10 first:-mt-5 last:border-0">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-5 text-base font-medium text-ink transition-colors hover:text-brand-deep sm:py-6 sm:text-xl [&::-webkit-details-marker]:hidden">
            {/* 最後兩個字綁在一起，避免手機上「？」單獨掉到下一行 */}
            <span>
              {f.q.slice(0, -2)}
              <span className="whitespace-nowrap">{f.q.slice(-2)}</span>
            </span>
            <span aria-hidden="true" className="text-2xl leading-none font-normal text-brand-deep transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="max-w-3xl pb-6 text-base leading-8 text-pretty text-ink/80">
            <p>{f.a}</p>
            {f.link && (
              <Link href={f.link.href} className="mt-2 inline-flex min-h-11 items-center text-brand-deep underline underline-offset-4 transition-opacity hover:opacity-70">
                {f.link.label}
              </Link>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

// 手機版每組先顯示的款數（其餘按「顯示全部」才展開）
const MOBILE_LIMIT = 6;

// 商品卡片格：手機一排 2 張、平板 3 張、電腦 4 張；每張連到該品項的介紹頁
// 手機上第 7 款以後先隱藏，按 MobileShowAll 的按鈕展開
function ProductGrid({ items, categoryName }: { items: CatalogItem[]; categoryName: string }) {
  return (
    <MobileShowAll total={items.length} limit={MOBILE_LIMIT}>
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <li key={item.slug} className={i >= MOBILE_LIMIT ? "max-sm:group-data-[open=false]/more:hidden" : undefined}>
            <Link href={item.href} className="group block">
              {/* 正方形圓角圖片框（與首頁商品目錄相同） */}
              <div className="relative aspect-square overflow-hidden rounded-[14px] bg-white lg:rounded-[18px]">
                <Image
                  src={item.image}
                  alt={`世紘${categoryName} ${item.model} ${item.spec ?? ""}`}
                  fill
                  sizes="(min-width: 1024px) 330px, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              {/* 型號（產品照右下角黃色字）與規格 */}
              <span className="mt-3 block text-sm font-medium tracking-[0.08em] transition group-hover:text-brand-deep">{item.model}</span>
              {item.spec && <span className="block text-xs leading-6 text-ink/75">{item.spec}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </MobileShowAll>
  );
}

// 產品分類頁
export default async function CategoryPage({ params }: PageProps<"/products/[category]">) {
  const { category } = await params;
  const cat = getCategory(category);
  const content = categoryContent[category];
  if (!cat || !content) notFound();

  // 網址
  const path = `/products/${cat.slug}`;
  // 麵包屑
  const crumbs = [
    { name: "首頁", path: "/" },
    { name: "產品系列", path: "/products" },
    { name: cat.name, path },
  ];
  // 頁首照片（沒有就用去背圖版型）
  const hero = heroImages[cat.slug];
  // 適用場所照片
  const places = placeCards[cat.slug];
  // 標題拆成主標與副標（以「｜」分隔）
  const [titleMain, titleSub] = content.h1.split("｜");

  return (
    <PageShell>
      {/* 字重示範：本頁內文 400、小標與型號 500、標題 700（導覽列、頁尾與聯絡區維持原本粗體） */}
      <div className={`${productSans.className} font-normal`}>
      {/* 結構化資料：分類頁＋常見問題 */}
      <JsonLd
        data={[
          {
            "@type": "CollectionPage",
            name: content.h1,
            description: content.description,
            url: absoluteUrl(path),
            publisher: { "@id": ORG_ID },
            image: cat.images.slice(0, 4).map(absoluteUrl),
          },
          faqJsonLd(content.faqs),
        ]}
      />

      {hero ? (
        // 頁首：滿版照片橫幅（與目錄、關於世紘等內頁同一個元件）；標題「｜」後半段縮小換行
        <div className="pb-20 sm:pb-28">
          <PhotoHero
            crumbs={crumbs}
            title={
              <>
                {titleMain}
                {titleSub && <span className="mt-3 block text-[0.42em] leading-snug font-medium">{titleSub}</span>}
              </>
            }
            subtitle={content.lead}
            link={{ href: "#contact", label: "專員為您提供服務" }}
            image={{ src: `/product-heroes/${cat.slug}.png`, ...hero }}
          />
        </div>
      ) : (
      /* 頁首：麵包屑、標題與介紹 */
      <section className={`${pageTop} pb-20 sm:pb-28`}>
        <div className={container}>
          <Breadcrumbs items={crumbs} />
          {/* 左：標題與介紹；右：該系列代表產品去背圖（平板以上才顯示） */}
          <div className="mt-10 grid items-center gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-16">
            <div className="max-w-3xl">
              <SectionTitle as="h1" align="left" title={content.h1} />
              <p className="mt-6 text-sm leading-8 text-pretty text-muted sm:text-base sm:leading-8">{content.lead}</p>
              <a href="#contact" className={`${outlineBtn} mt-10`}>
                專員為您提供服務
              </a>
            </div>
            <div className="relative hidden h-80 md:block lg:h-[420px]">
              <Image
                src={`/cutouts/${cat.slug}.png`}
                alt={`世紘${cat.name}`}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1440px) 520px, 36vw"
                quality={90}
                className="object-contain drop-shadow-[0_24px_28px_rgba(15,15,14,.18)]"
              />
            </div>
          </div>
        </div>
      </section>
      )}

      {cat.groups ? (
        <>
          {/* 有小系列：先列小系列導覽卡片，再依小系列分區顯示產品 */}
          <section id="products" className={section}>
            <div className={container}>
              <SectionTitle title={`${cat.groups.length} 大系列，${cat.items.length} 款產品`} desc={`${cat.desc}選擇系列快速查看。`} />
              {/* 小系列導覽卡片：手機與平板為可橫向滑動的一排，電腦每張五分之一寬、一排最多 5 張，不滿一排時置中；點擊跳到該系列 */}
              <ul className="-mx-5 mt-14 flex snap-x scroll-px-5 gap-3 overflow-x-auto px-5 pt-1 pb-3 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:gap-5 sm:px-8 lg:mx-0 lg:flex-wrap lg:justify-center lg:overflow-visible lg:p-0 [&::-webkit-scrollbar]:hidden">
                {cat.groups.map((g) => (
                  <li key={g.id} className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-[calc((100%-5rem)/5)]">
                    <a href={`#${g.id}`} className={`group flex h-full flex-col p-1.5 sm:p-2 ${card} ${cardHover}`}>
                      <div className="relative aspect-square overflow-hidden rounded-[10px] bg-paper lg:rounded-[12px]">
                        <Image src={g.cover} alt={`世紘${g.name}`} fill sizes="(min-width: 1024px) 270px, (min-width: 640px) 30vw, 44vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]" />
                      </div>
                      <div className="flex flex-1 items-end px-2 pt-3 pb-1.5 sm:px-3 sm:pt-4 sm:pb-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium tracking-[0.06em] text-balance text-ink sm:text-lg lg:text-base xl:text-lg">{g.name}</p>
                          <p className="mt-0.5 text-xs text-muted sm:text-sm">{g.items.length} 款</p>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 小系列快速切換列：捲動時固定在 header 下方，可橫向滑動 */}
          <nav aria-label={`${cat.name}系列`} className="sticky top-20 z-20 border-y border-line bg-paper/90 backdrop-blur-md sm:top-22">
            <ul className={`${container} flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
              {cat.groups.map((g) => (
                <li key={g.id} className="shrink-0">
                  <a href={`#${g.id}`} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium tracking-[0.08em] text-ink shadow-[0_0_0_1px_rgba(15,15,14,.08)] transition hover:text-brand-deep hover:shadow-[0_0_0_1px_rgba(214,31,42,.4)]">
                    {g.name}
                    <span className="text-xs text-muted">{g.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* 各小系列：左側標題與說明（電腦版捲動時固定），右側產品格 */}
          {cat.groups.map((g, i) => (
            <section key={g.id} id={g.id} className={`scroll-mt-40 py-16 sm:scroll-mt-44 sm:py-20 ${i > 0 ? "border-t border-line" : ""}`}>
              <div className={`${container} grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14 2xl:grid-cols-[300px_minmax(0,1fr)]`}>
                <div className="lg:sticky lg:top-48 lg:self-start">
                  <h2 className="text-2xl font-bold tracking-[0.12em] text-brand sm:text-3xl">{g.name}</h2>
                  <p className="mt-4 text-sm leading-7 text-pretty text-muted">{g.desc}</p>
                  <p className="mt-6 border-t border-line pt-4 text-xs tracking-[0.25em] text-muted">共 {g.items.length} 款</p>
                </div>
                <ProductGrid items={g.items} categoryName={cat.name} />
              </div>
            </section>
          ))}
        </>
      ) : (
        // 沒有小系列：直接列出全部產品
        <section id="products" className={section}>
          <div className={container}>
            <SectionTitle title={cat.name} desc={`${cat.desc}點擊圖片查看產品介紹。`} />
            <div className="mt-14">
              <ProductGrid items={cat.items} categoryName={cat.name} />
            </div>
          </div>
        </section>
      )}

      {/* 適用場所與常見問題：同一區塊、細線分隔 */}
      <section className="pt-20 sm:pt-28">
        <div className={container}>
          {places && (
            <GuidePart title="適用場所">
              <PlaceStrip cards={places} />
            </GuidePart>
          )}
          <GuidePart id="faq" title="常見問題">
            <FaqLines faqs={content.faqs} />
          </GuidePart>
        </div>
      </section>
      </div>
    </PageShell>
  );
}
