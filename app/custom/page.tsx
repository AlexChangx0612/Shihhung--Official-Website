// 匯入 Next.js 網頁中繼資料型別
import type { Metadata } from "next";
// 匯入客製織帶牆
import BeltWall from "../components/BeltWall";
// 匯入數字滾動
import CountUp from "../components/CountUp";
// 匯入麵包屑
import Breadcrumbs from "../components/Breadcrumbs";
// 匯入常見問題清單
import FaqList, { type Faq } from "../components/FaqList";
// 匯入結構化資料元件
import JsonLd from "../components/JsonLd";
// 匯入內頁外框（底部已有紅色聯絡區塊：電話、E-MAIL、LINE）
import PageShell from "../components/PageShell";
// 匯入互動式客製流程
import ProcessStepper, { type Step } from "../components/ProcessStepper";
// 匯入客製選項總覽
import CustomIndex from "../components/CustomIndex";
// 匯入可客製的產品清單
import { customOptions } from "../lib/custom-options";
// 匯入 SEO 工具
import { absoluteUrl, faqJsonLd, pageMetadata } from "../lib/site";
// 匯入共用樣式
import { container, pageTop, solidBtn } from "../lib/ui";

// 頁面描述
const description =
  "世紘興業客製化服務：伸縮帶織帶印製企業標誌、拒馬看板、告示牌與海報架皆可置入企業識別，並提供企業禮贈品；從需求、規劃、台灣製作到包裝出貨，專員一對一協助。";

// 中繼資料
export const metadata: Metadata = pageMetadata({
  title: "客製化服務｜欄柱・拒馬・告示牌置入企業識別｜世紘興業",
  description,
  path: "/custom",
});

// 客製流程四步：左側為步驟說明與細節，右側「客製需求單」的區塊與欄位（欄位值為示意範例，不代表特定客戶）
const steps: Step[] = [
  {
    title: "提供需求",
    desc: "告訴我們場地、用途與數量，以及要置入的標誌或文字。",
    details: ["電話、E-MAIL 或 LINE 都可以", "有產品型號，專員能更快回覆"],
    section: "需求",
    fields: [
      { label: "場地與用途", value: "大樓入口大廳・訪客排隊動線" },
      { label: "品項", value: "伸縮帶欄柱" },
      { label: "客製內容", value: "織帶印製企業標誌與中文名稱" },
      { label: "標誌檔案", value: "company-logo.ai　已上傳" },
    ],
  },
  {
    title: "專員規劃",
    desc: "專員依場地規劃品項與動線，確認客製內容、可行性與交期。",
    details: ["依場地動線建議品項與擺放", "確認顏色、文字與標誌位置", "確認可行性、數量與交期"],
    section: "規劃",
    fields: [
      { label: "織帶顏色", value: "品牌紅", kind: "swatch", color: "#d61f2a" },
      { label: "柱身", value: "黑色烤漆", kind: "swatch", color: "#1f1f1f" },
      { label: "標誌位置", value: "織帶等距重複印製" },
      { label: "可行性與交期", value: "專員已確認" },
    ],
  },
  {
    title: "台灣製作",
    desc: "印刷與組裝都在台灣完成，出貨前在廠內拉開確認。",
    details: ["織帶印刷、欄柱組裝在台灣完成", "出貨前拉開織帶，確認標誌位置與顏色"],
    section: "製作",
    fields: [
      { label: "織帶印刷", value: "台灣廠內完成", kind: "check" },
      { label: "欄柱組裝", value: "台灣廠內完成", kind: "check" },
      { label: "出貨前檢查", value: "拉開織帶確認標誌位置與顏色", kind: "check" },
    ],
  },
  {
    title: "包裝出貨",
    desc: "分箱包裝、棧板加固後出貨，送到現場拆封即可使用。",
    details: ["逐箱包裝與標示", "棧板與收縮膜加固", "離島馬祖也送過"],
    section: "出貨",
    fields: [
      { label: "包裝", value: "逐箱包裝與標示", kind: "check" },
      { label: "加固", value: "棧板與收縮膜加固", kind: "check" },
      { label: "送達", value: "送到現場，拆封即可使用", kind: "check" },
    ],
  },
];

// 客製化常見問題
const faqs: Faq[] = [
  {
    q: "伸縮帶欄柱可以客製企業 Logo 嗎？",
    a: "伸縮帶欄柱可搭配柱頭告示框，放入企業標誌或指示內容；織帶印製 Logo 的可行性、數量與交期，請洽專員確認。",
    link: { href: "/products/retractable-belt-stanchions", label: "了解伸縮帶欄柱" },
  },
  {
    q: "告示牌可以客製企業識別嗎？",
    a: "可以。告示牌與海報架皆可置入貴公司的品牌視覺，請提供內容、尺寸與數量洽詢。",
    link: { href: "/products/poster-sign-stands", label: "了解海報架・告示牌" },
  },
  {
    q: "詢問客製化需要準備什麼？",
    a: "請提供場地與用途、需要的品項與數量，以及要置入的標誌或文字內容。詢問特定產品時，提供產品頁或電子目錄上的型號，專員可更快為您提供服務。",
    link: { href: "/catalog", label: "查看產品電子目錄" },
  },
];

// 客製化服務頁
export default function CustomPage() {
  return (
    <PageShell>
      {/* 結構化資料：服務頁＋常見問題 */}
      <JsonLd data={[{ "@type": "WebPage", name: "客製化服務", description, url: absoluteUrl("/custom") }, faqJsonLd(faqs)]} />

      {/* ① 開場：標題、一句說明、產品捷徑（點了跳到總覽並選好該產品） */}
      <section className={`${pageTop} ${container}`}>
        <Breadcrumbs items={[{ name: "首頁", path: "/" }, { name: "客製化服務", path: "/custom" }]} />
        <h1 className="mt-10 text-[clamp(44px,6vw,96px)] leading-[1.05] font-black">客製化服務</h1>
        <p className="mt-6 text-[clamp(18px,1.5vw,22px)] leading-[1.7]">{customOptions.length} 類產品，都能印上您的標誌與顏色。</p>
        <p className="mt-12 text-sm text-muted">我想客製的是：</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {customOptions.map((o) => (
            <li key={o.slug}>
              <a href={`#opt-${o.slug}`} className="inline-flex min-h-12 items-center bg-white px-5 text-base transition hover:bg-ink hover:text-white active:translate-y-px">
                {o.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ② 客製選項總覽：左分組清單，右照片與客製選項 */}
      <section id="options" className={`${container} scroll-mt-28 pt-28 sm:pt-36`}>
        {/* 產品捷徑的錨點：跳到總覽（實際選產品由 CustomIndex 讀網址處理） */}
        {customOptions.map((o) => (
          <span key={o.slug} id={`opt-${o.slug}`} className="block scroll-mt-28" />
        ))}
        <h2 className="sr-only">客製選項總覽</h2>
        <CustomIndex />
        {/* 企業禮贈品：一行帶過 */}
        <p className="mt-16 text-base">
          另提供企業禮贈品，品項與客製方式歡迎
          <a href="#contact" className="ml-1 underline underline-offset-4 transition hover:text-brand-deep">
            洽詢專員 →
          </a>
        </p>
      </section>

      {/* 客製織帶牆：深色底，讓五顏六色的織帶當主角 */}
      <section id="belts" className="mt-32 scroll-mt-24 bg-[#181818] py-28 text-white sm:mt-44">
        <div className={`${container} flex flex-wrap items-end justify-between gap-8`}>
          <div className="min-w-0 flex-[1_1_520px]">
            <h2 className="text-[clamp(30px,3vw,44px)] leading-[1.3] font-bold">
              超過 <CountUp value="100" /> 款客製織帶，都出自於世紘
            </h2>
            <p className="mt-5 max-w-[36em] text-base leading-[1.8]">
              從 gogoro、Dyson、McLaren、太魯閣購物中心，到竹林山觀音寺、高雄捷運與苗栗警察分局。每一條都是我們為客戶印製、實際上線的伸縮帶。
            </p>
          </div>
          <a href="#contact" className={solidBtn}>
            印上您的品牌
          </a>
        </div>
        <div className="mt-16">
          <BeltWall label="世紘歷年承接的客製伸縮帶印刷圖樣，包含 gogoro、Nike、小米、Dyson、McLaren、Longchamp、竹林山觀音寺、高雄捷運等" />
        </div>
      </section>

      {/* 互動式客製流程：深色滿版 */}
      <section id="process" className="mt-32 scroll-mt-0 bg-ink py-24 text-white sm:mt-44 lg:py-0">
        <ProcessStepper steps={steps} />
      </section>

      {/* 常見問題：手機上下排列，電腦左標題右問答 */}
      <section className={`${container} grid gap-12 py-32 sm:py-44 lg:grid-cols-[1fr_2fr] lg:gap-20`}>
        <h2 className="text-[clamp(28px,3vw,46px)] leading-[1.2] font-black">客製化常見問題</h2>
        <FaqList faqs={faqs} />
      </section>
    </PageShell>
  );
}
