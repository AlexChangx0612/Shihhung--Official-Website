// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入 Next.js 圖片元件
import Image from "next/image";
// 匯入 Next.js 站內連結元件
import Link from "next/link";
// 匯入 404 處理
import { notFound } from "next/navigation";
// 匯入麵包屑
import Breadcrumbs from "../../../components/Breadcrumbs";
// 匯入結構化資料元件
import JsonLd from "../../../components/JsonLd";
// 匯入內頁外框
import PageShell from "../../../components/PageShell";
// 匯入區塊標題
import SectionTitle from "../../../components/SectionTitle";
// 匯入產品規格表（逐列進場）
import SpecLedger, { FeatureLedger } from "../../../components/SpecLedger";
// 匯入適用場所卡片與照片資料
import PlaceCards from "../../../components/PlaceCards";
import { placeCards } from "../../../lib/place-cards";
// 匯入顏色選擇、可變色的產品展示台與型號
import ColorStage from "../../../components/ColorStage";
import VariantModel, { VariantName } from "../../../components/VariantModel";
import VariantPicker from "../../../components/VariantPicker";
import { stageFamilies, swapImages } from "../../../lib/tints";
import SwapStage from "../../../components/SwapStage";
import { beltOptions, variantsOf } from "../../../lib/variants";
// 匯入手機版底部固定詢價列
import StickyInquiry from "../../../components/StickyInquiry";
// 匯入 Email 詢價連結（主旨帶入型號與顏色組合）
import InquiryLink from "../../../components/InquiryLink";
// 匯入分類頁文字內容（適用場所、規格選擇）
import { categoryContent } from "../../../lib/category-content";
// 匯入未登錄品項的產品頁資料產生器
import { autoInfo, type ItemInfo } from "../../../lib/product-auto";
// 匯入品項資料
import { allItemParams, getCategory, getItem, type CatalogItem } from "../../../lib/products";
// 匯入 SEO 工具與公司資料
import { absoluteUrl, company, ORG_ID, pageMetadata } from "../../../lib/site";
// 匯入共用樣式
import { bodyText, container, outlineBtn, pageTop, section } from "../../../lib/ui";

// 只產生已知的品項頁，其他網址回傳 404
export const dynamicParams = false;

// 建置時產生所有品項頁（每張產品照一頁）
export function generateStaticParams() {
  return allItemParams();
}

// 品項標題：已登錄產品用「型號 名稱」，其餘用「型號 分類名稱（規格）」
function itemTitle(item: CatalogItem) {
  return item.detail ? `${item.detail.model} ${item.detail.name}` : `${item.model} ${item.name}${item.spec ? `（${item.spec}）` : ""}`;
}

// 產品頁顯示的名稱、說明、規格與特色：已登錄（product-details.ts）的用手寫資料，其餘依產品照標示自動產生
function itemInfo(item: CatalogItem, list: { slug: string; name: string; desc: string }): ItemInfo {
  if (item.detail) return { ...item.detail, features: item.detail.features ?? [] };
  // 伸縮帶欄柱另外找出所屬小系列
  const group = getCategory(list.slug)?.groups?.find((g) => g.items.some((i) => i.slug === item.slug));
  return autoInfo(item, list, group);
}

// 每個品項頁各自的標題、描述、canonical 與分享圖
export async function generateMetadata({ params }: PageProps<"/products/[category]/[slug]">): Promise<Metadata> {
  const { category, slug } = await params;
  const found = getItem(category, slug);
  if (!found) return {};
  const { item, list } = found;
  const info = itemInfo(item, list);
  const meta = pageMetadata({
    title: `${item.model} ${info.name}｜世紘興業`,
    description: info.description,
    path: item.href,
    image: item.image,
  });
  // 未登錄規格的品項內容較少，先不讓搜尋引擎收錄（補齊資料、登錄到 product-details.ts 後自動開放）
  return item.detail ? meta : { ...meta, robots: { index: false, follow: true } };
}

// 主要詢價按鈕：紅底白字膠囊（與首頁案例區「預約諮詢」相同）
const primaryBtn =
  "inline-flex h-14 items-center rounded-full bg-brand-deep px-8 text-sm tracking-[0.2em] text-white transition hover:bg-brand active:translate-y-px";
// 次要聯絡方式：文字連結，滑鼠移上變紅
const quietLink = "inline-flex min-h-11 items-center text-sm underline decoration-line underline-offset-[6px] transition hover:text-brand-deep hover:decoration-brand-deep";

// 單一品項頁
export default async function ProductPage({ params }: PageProps<"/products/[category]/[slug]">) {
  const { category, slug } = await params;
  const found = getItem(category, slug);
  if (!found) notFound();
  const { item, index, list } = found;
  const detail = item.detail;

  // 分類頁內容
  const content = categoryContent[list.slug];
  // 適用場所：沿用分類頁內容
  const places = content?.places ?? [];
  // 上一項／下一項（同一列表內）
  const prev = list.items[index - 1];
  const next = list.items[index + 1];
  // 同列表的其他品項：已登錄的優先，其次取前後相鄰的品項，最多 8 個
  const others = list.items.filter((i) => i.slug !== item.slug);
  const related = [
    ...others.filter((i) => i.detail),
    ...others.filter((i) => !i.detail).sort((a, b) => Math.abs(list.items.indexOf(a) - index) - Math.abs(list.items.indexOf(b) - index)),
  ].slice(0, 8);
  // 名稱、說明、規格與特色
  const info = itemInfo(item, list);
  // 標題與替代文字
  const title = `${item.model} ${info.name}`;
  const images = detail?.images ?? [item.image];
  // 所屬小系列（伸縮帶欄柱才有，例如「萬向系列」）
  const group = getCategory(list.slug)?.groups?.find((g) => g.items.some((i) => i.slug === item.slug));
  // 規格表：型號已是頁面大標，不再重複列出
  const specs = info.specs.filter((s) => s.label !== "型號");
  // 同款的所有顏色（伸縮帶欄柱）：有柱身與織帶顏色的品項都顯示顏色選擇
  const familyVariants = variantsOf(item, list.items);
  // 可選的織帶顏色：全部單層織帶顏色（雙層織帶款式只列自己的）
  const belts = familyVariants ? beltOptions(familyVariants) : [];
  const variants = familyVariants?.map((v) => ({
    slug: v.item.slug,
    model: v.item.model,
    post: v.post,
    belt: v.belt,
    href: v.item.href,
    image: v.item.image,
  }));
  // 有去背展示台的款式（萬向系列 RS-A4／A5）：選顏色時產品圖直接變色
  const paint = !!variants && stageFamilies.test(item.model);
  // 其他系列有事先算好各色去背圖的款式（塑膠欄柱 PS-03、拒馬 TS-209、海報架 DRP-S41、給皂機架 HDS-A40）：換色時切換去背圖
  const swap = !!variants && variants.length > 1 && variants.every((v) => v.model in swapImages);
  const stage = paint || swap;

  return (
    <PageShell>
      {/* 結構化資料：產品（只有已登錄型號與規格的產品才輸出；沒有價格、評價、庫存資料，因此不輸出 offers 與 rating） */}
      {detail && (
        <JsonLd
          data={{
            "@type": "Product",
            name: title,
            model: detail.model,
            description: detail.description,
            image: images.map(absoluteUrl),
            url: absoluteUrl(item.href),
            category: list.name,
            brand: { "@type": "Brand", name: company.shortName },
            manufacturer: { "@id": ORG_ID },
            additionalProperty: detail.specs
              .filter((s) => s.label !== "型號")
              .map((s) => ({ "@type": "PropertyValue", name: s.label, value: s.value })),
          }}
        />
      )}

      {/* 產品主資訊：手機上下排列，電腦左圖右文 */}
      <section className={`${pageTop} pb-20 sm:pb-28`}>
        <div className={container}>
          <Breadcrumbs
            items={[
              { name: "首頁", path: "/" },
              { name: "產品系列", path: "/products" },
              { name: list.name, path: list.listHref },
              { name: item.model, path: item.href },
            ]}
          />
          <div className="mt-10 grid items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-20">
            {/* 產品照：正方形圓角白底；第一張為主圖，其餘為細節圖；電腦版捲動時固定在畫面中 */}
            <div className="grid gap-4 lg:sticky lg:top-48">
              {/* 有去背展示台的款式：主圖改為可變色的去背產品圖 */}
              {paint && variants && <ColorStage variants={variants} pageSlug={item.slug} title={title} />}
              {swap && variants && <SwapStage variants={variants} pageSlug={item.slug} images={swapImages} title={title} />}
              {(stage ? images.slice(1) : images).map((src, i) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-[14px] bg-white lg:rounded-[22px]">
                  <Image
                    src={src}
                    alt={`世紘 ${title}${i > 0 ? ` 細節圖 ${i}` : ""}`}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* 產品文字 */}
            <div className="lg:pt-4">
              {/* 產品名稱：型號用特粗英文大字當主角，中文品名在下方 */}
              <h1>
                {variants ? (
                  // 有顏色選擇時：型號跟著選擇的顏色即時更換
                  <VariantModel
                    variants={variants}
                    pageSlug={item.slug}
                    className="block font-display text-[clamp(48px,6vw,88px)] leading-[0.95] font-black tracking-[-0.02em] text-ink"
                  />
                ) : (
                  <span className="block font-display text-[clamp(48px,6vw,88px)] leading-[0.95] font-black tracking-[-0.02em] text-ink">{item.model}</span>
                )}
                {variants ? (
                  <VariantName variants={variants} pageSlug={item.slug} name={info.name} className="mt-5 block text-[clamp(20px,1.7vw,26px)] leading-[1.45] font-black text-balance" />
                ) : (
                  <span className="mt-5 block text-[clamp(20px,1.7vw,26px)] leading-[1.45] font-black text-balance">{info.name}</span>
                )}
              </h1>
              {/* 分類與小系列：紅色分類＋灰色小系列（與案例頁「場域／地點」相同寫法） */}
              <p className="mt-4 text-base">
                <Link href={list.listHref} className="text-brand-deep transition hover:text-ink">
                  {list.name}
                </Link>
                {group && (
                  <>
                    <span className="mx-2 text-muted" aria-hidden="true">
                      ／
                    </span>
                    <span className="text-muted">{group.name}</span>
                  </>
                )}
              </p>
              <p className="mt-8 max-w-[30em] text-[clamp(17px,1.25vw,19px)] leading-[1.85] text-pretty">{info.description}</p>

              {/* 顏色選擇：按下顏色切換到該顏色的型號與產品照 */}
              {variants && <VariantPicker variants={variants} belts={belts} pageSlug={item.slug} animate={stage} />}

              {/* 詢價：主要按鈕 Email（主旨帶入型號），電話與 LINE 為文字連結 */}
              <div id="inquiry" className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                <InquiryLink email={company.email} model={item.model} variants={variants} pageSlug={item.slug} className={primaryBtn}>
                  詢價此型號
                </InquiryLink>
                <a href={company.phoneHref} className={quietLink}>
                  {company.phone}
                </a>
                {/* LINE 為站外連結，另開新分頁 */}
                <a href={company.line} target="_blank" rel="noopener noreferrer" className={quietLink}>
                  LINE 詢價
                </a>
              </div>

              {/* 規格表：織帶章節標籤＋逐列進場 */}
              <SpecLedger specs={specs} note="尺寸、重量與其他規格，請洽世紘專員確認。" variants={variants} pageSlug={item.slug} />

              {/* 產品特色 */}
              {info.features.length > 0 && <FeatureLedger features={info.features} />}

              {/* 詢價提醒：LINE QR Code 與完整聯絡方式在頁面底部紅色聯絡區 */}
              <p className={`${bodyText} mt-12`}>詢價時提供型號「{item.model}」，專員可更快為您確認。</p>
            </div>
          </div>

          {/* 上一項／下一項：直接顯示型號 */}
          <nav aria-label="同系列品項" className="mt-20 grid grid-cols-2 gap-4 border-t border-line pt-6">
            {prev ? (
              <Link href={prev.href} className="group flex min-h-11 flex-col justify-center">
                <span className="text-xs tracking-[0.12em] text-muted">← 上一項</span>
                <span className="mt-1 font-display text-lg font-black transition group-hover:text-brand-deep sm:text-xl">{prev.model}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={next.href} className="group flex min-h-11 flex-col items-end justify-center justify-self-end text-right">
                <span className="text-xs tracking-[0.12em] text-muted">下一項 →</span>
                <span className="mt-1 font-display text-lg font-black transition group-hover:text-brand-deep sm:text-xl">{next.model}</span>
              </Link>
            )}
          </nav>
        </div>
      </section>

      {/* 適用場所 */}
      {places.length > 0 && (
        <section className={section}>
          <div className={container}>
            <SectionTitle align="left" title="適用場所" />
            {placeCards[list.slug] ? (
              // 有照片的分類：場所卡片
              <PlaceCards cards={placeCards[list.slug]} />
            ) : (
              // 其他分類：場所清單（滿版多欄）
              <ul className="mt-10 grid border-t border-line sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-4">
                {places.map((p) => (
                  <li key={p} className="border-b border-line py-4 text-base tracking-[0.06em]">
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* 相關產品 */}
      {related.length > 0 && (
        <section className={section}>
          <div className={container}>
            <SectionTitle title={`更多${list.name}`} />
            <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={p.href} className="group block">
                    <div className="relative aspect-square overflow-hidden rounded-[14px] bg-white lg:rounded-[18px]">
                      <Image
                        src={p.image}
                        alt={`世紘 ${itemTitle(p)}`}
                        fill
                        sizes="(min-width: 1024px) 330px, (min-width: 768px) 33vw, 50vw"
                        className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                    <span className="mt-3 block text-sm tracking-[0.08em] transition group-hover:text-brand-deep">{p.model}</span>
                    {p.spec && <span className="block text-xs leading-6 text-muted">{p.spec}</span>}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-12 text-center">
              <Link href={list.listHref} className={outlineBtn}>
                查看全部{list.name}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 手機版底部固定詢價列 */}
      <StickyInquiry model={item.model} email={company.email} phoneHref={company.phoneHref} variants={variants} pageSlug={item.slug} />
    </PageShell>
  );
}
