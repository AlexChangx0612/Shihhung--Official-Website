// 匯入 Next.js 圖片元件
import Image from "next/image";

// 舞台座標（1000 × 700 單位，全部換算成百分比，隨寬度等比縮放）
const W = 1000;
const H = 700;
// 欄柱去背圖原尺寸 891 × 2155；在舞台上高 600 單位
const POST_H = 600;
const POST_W = (POST_H * 891) / 2155;
const TOP = 50;
// 原圖像素換算成舞台單位的比例
const sx = POST_W / 891;
const sy = POST_H / 2155;
// 原圖中：收納盒左緣 x=312、右緣 x=490；織帶 y=84～215；柱頭右側短織帶與扣頭在 y<270
const BOX_L = 312;
const BOX_R = 490;
const BELT_T = 84;
const BELT_B = 215;
const HEAD_B = 270;
// 三支欄柱的左緣位置
const posts = [40, 380, 720];

// 換算成百分比字串
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

// 前兩支欄柱只裁掉柱頭右側的短織帶與扣頭（底座保留）
const headClip = `polygon(0 0, ${(BOX_R / 891) * 100}% 0, ${(BOX_R / 891) * 100}% ${(HEAD_B / 2155) * 100}%, 100% ${(HEAD_B / 2155) * 100}%, 100% 100%, 0 100%)`;

// 織帶印字：重複印上 Shung 白色標誌
function Logos() {
  return (
    <div aria-hidden="true" className="flex h-full items-center gap-8 pl-4">
      {Array.from({ length: 5 }, (_, i) => (
        <Image key={i} src="/brand/logo-shung-white.png" alt="" width={240} height={139} className="h-[60%] w-auto max-w-none flex-none" />
      ))}
    </div>
  );
}

// 三支伸縮帶欄柱以紅色織帶連起，圍出一段動線
export default function OrderStage() {
  return (
    <div className="relative aspect-[10/7] w-full">
      {posts.map((x, i) => {
        const last = i === posts.length - 1;
        return (
          <div key={x}>
            {/* 地面陰影 */}
            <div
              aria-hidden="true"
              className="absolute rounded-[50%] bg-black/25 blur-md"
              style={{ left: pct(x + POST_W * 0.05, W), top: pct(TOP + POST_H - 14, H), width: pct(POST_W * 0.85, W), height: pct(26, H) }}
            />
            {/* 欄柱去背圖 */}
            <Image
              src="/cutouts/retractable-belt-stanchions.png"
              alt={i === 0 ? "三支世紘伸縮帶欄柱以紅色織帶圍出動線" : ""}
              width={891}
              height={2155}
              sizes="(min-width: 1024px) 14vw, 30vw"
              className="absolute h-auto"
              style={{ left: pct(x, W), top: pct(TOP, H), width: pct(POST_W, W), clipPath: last ? undefined : headClip }}
            />
            {/* 織帶：從這支收納盒右緣拉到下一支收納盒左緣 */}
            {!last && (
              <div
                className="belt-strip absolute"
                style={{
                  left: pct(x + BOX_R * sx, W),
                  top: pct(TOP + BELT_T * sy, H),
                  width: pct(posts[i + 1] + BOX_L * sx - (x + BOX_R * sx), W),
                  height: pct((BELT_B - BELT_T) * sy, H),
                }}
              >
                <Logos />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
