// 案例總覽頁 /cases 的照片挑選：左側固定大圖（直式框）與右側兩張配圖
// 每個案例的照片是從 public/cases/<slug>/ 逐張挑出構圖最好的；pos 為裁切對齊位置（CSS object-position），讓主角留在框內
// 新增案例時若沒有在這裡挑選，會自動退回封面照與故事照片
// 匯入案例資料型別
import type { CasePhoto, CaseStudy } from "./cases";

// 一張挑選過的照片；credit 為網路開放授權照片的署名（CC 授權規定必須標示作者、授權與來源）
export type StagePhoto = CasePhoto & { pos?: string; credit?: { text: string; href: string } };

// 一個案例的照片組
export type CaseStage = { hero: StagePhoto; side: [StagePhoto, StagePhoto] };

// 逐案挑選
const picks: Record<string, CaseStage> = {
  "chihai-cultural-park": {
    hero: { src: "/cases/chihai-cultural-park/06.jpg", alt: "經國七海文化園區長廊兩側的黑色伸縮帶欄柱" },
    side: [
      { src: "/cases/chihai-cultural-park/01-sign.jpg", alt: "經國七海文化園區入口石碑" },
      { src: "/cases/chihai-cultural-park/04.jpg", alt: "印有園區標誌的灰色拒馬" },
    ],
  },
  "zhulinshan-guanyin-temple": {
    hero: { src: "/cases/zhulinshan-guanyin-temple/01.jpg", alt: "竹林山觀音寺殿前的金色欄柱與紅色織帶" },
    side: [
      { src: "/cases/zhulinshan-guanyin-temple/03.jpg", alt: "印有「竹林山觀音寺－平安餐」的紅色織帶" },
      { src: "/cases/zhulinshan-guanyin-temple/05.jpg", alt: "組裝完成、整齊排列的金色欄柱", pos: "50% 60%" },
    ],
  },
  "tainan-tiantan-temple": {
    // 大圖：客戶場域照（Wikimedia Commons 開放授權），配圖：世紘自己拍的印字織帶
    hero: {
      src: "/venues/tainan-tiantan-temple-interior.jpg",
      alt: "台灣首廟天壇天公廟殿內的木雕樑柱與燈籠",
      pos: "50% 40%",
      credit: { text: "照片：Pascal Terjan／CC BY-SA 2.0／Wikimedia Commons", href: "https://commons.wikimedia.org/w/index.php?curid=116382380" },
    },
    side: [
      { src: "/cases/tainan-tiantan-temple/03.jpg", alt: "拉開檢查的「台灣首廟天壇天公廟」印字織帶", pos: "50% 30%" },
      { src: "/cases/tainan-tiantan-temple/01.jpg", alt: "印有廟名的紅色織帶從金色欄柱拉出" },
    ],
  },
  "kham-art-ntsec": {
    hero: { src: "/cases/kham-art-ntsec/09.jpg", alt: "樂高獅子展品四周的黑色欄柱與圍繩", pos: "50% 45%" },
    side: [
      { src: "/cases/kham-art-ntsec/02.jpg", alt: "「大動物奇積 樂高藝術」特展主視覺" },
      { src: "/cases/kham-art-ntsec/07.jpg", alt: "樂高野牛展品與黑色欄柱" },
    ],
  },
  "lienchiang-meishi-arts-center": {
    hero: { src: "/cases/lienchiang-meishi-arts-center/01.jpg", alt: "印有「馬祖梅石藝文中心」的黑色織帶", pos: "50% 40%" },
    side: [
      { src: "/cases/lienchiang-meishi-arts-center/03.jpg", alt: "裝箱中的黑色伸縮帶欄柱與配件" },
      { src: "/cases/lienchiang-meishi-arts-center/06.jpg", alt: "以堆高機將棧板貨物裝上貨車" },
    ],
  },
  "xiaomi-store": {
    hero: { src: "/cases/xiaomi-store/05.jpg", alt: "小米門市外觀與門口的欄柱", pos: "35% 50%" },
    side: [
      { src: "/cases/xiaomi-store/03.jpg", alt: "印有小米標誌的紅色織帶" },
      { src: "/cases/xiaomi-store/04.jpg", alt: "張貼維修服務資訊的黑色烤漆告示牌", pos: "50% 35%" },
    ],
  },
  "tsg-hawks": {
    // 大圖：台鋼雄鷹主場澄清湖棒球場（Wikimedia Commons 開放授權），配圖：世紘自己拍的印字織帶
    hero: {
      src: "/venues/chengcing-lake-baseball-stadium.jpg",
      alt: "台鋼雄鷹主場：高雄澄清湖棒球場外觀",
      pos: "50% 50%",
      credit: {
        text: "照片：勤岸／CC BY-SA 3.0／Wikimedia Commons",
        href: "https://commons.wikimedia.org/wiki/File:%E6%BE%84%E6%B8%85%E6%B9%96%E6%A3%92%E7%90%83%E5%A0%B4%E5%85%A7%E9%87%8E%E5%85%A5%E5%8F%A3%E5%81%B4_20120908.jpg",
      },
    },
    side: [
      { src: "/cases/tsg-hawks/02.jpg", alt: "拉開的 TSG HAWKS 綠色織帶", pos: "55% 50%" },
      { src: "/cases/tsg-hawks/03.jpg", alt: "綠色織帶上的 TSG HAWKS 字樣" },
    ],
  },
  "barrier-printing-portfolio": {
    hero: { src: "/cases/barrier-printing-portfolio/01.jpg", alt: "新光華山金融中心人行道上的黑色客製拒馬", pos: "50% 60%" },
    side: [
      { src: "/cases/barrier-printing-portfolio/06.jpg", alt: "印有臺南慈濟高中校名的藍色拒馬" },
      { src: "/cases/barrier-printing-portfolio/15.jpg", alt: "印有柏昶新世界標誌的黑色拒馬" },
    ],
  },
};

// 取得案例的照片組（沒有挑選時退回封面與故事照片）
export function getStage(c: CaseStudy): CaseStage {
  return picks[c.slug] ?? { hero: c.cover, side: [c.story[1].photo, c.story[2].photo] };
}
