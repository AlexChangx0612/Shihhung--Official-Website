// 去背產品圖的上色：以不鏽鋼色柱身＋紅色織帶的去背圖為底，用遮罩把柱身、織帶換成選擇的顏色
// 柱身：以 multiply 疊色，保留金屬反光的明暗；織帶：直接填色（含警示條紋）
// 回傳 null 代表無法模擬（透明、印花），改顯示原本的產品照

// 有去背圖與遮罩的款式（同一種柱頭造型）：萬向系列 RS-A4、RS-A5
export const stageFamilies = /^RS-A[45][A-Z]/;

// 其他系列：每個顏色事先算好一張去背圖（public/cutouts/variants），換色時新圖由上往下流過
// 由各系列的去背圖產生：塑膠欄柱 PS-03、拒馬 TS-209（看板改素面）、海報架 DRP-S41、給皂機架 HDS-A40
export const swapImages: Record<string, string> = Object.fromEntries(
  ["PS-03YB2", "PS-03RW2", "TS-209RD", "TS-209BK", "TS-209BZ", "TS-209SR", "DRP-S41BK", "DRP-S41SR", "HDS-A40BK", "HDS-A40SR"].map((m) => [m, `/cutouts/variants/${m}.png`]),
);

// 去背圖與遮罩路徑
export const stageImages = {
  base: "/cutouts/retractable-belt-stanchions.png",
  post: "/cutouts/rs-a4/post-mask.png",
  belt: "/cutouts/rs-a4/belt-mask.png",
  width: 891,
  height: 2155,
};

// 柱身疊色（undefined = 原本的不鏽鋼色，不疊色）
export function postTint(color: string): string | undefined | null {
  if (/透明|印花/.test(color)) return null;
  if (/不鏽鋼|銀/.test(color)) return undefined;
  if (/黃黑/.test(color)) return "repeating-linear-gradient(180deg, #f2c40f 0 9%, #2a2a2a 9% 18%)";
  if (/紅白/.test(color)) return "repeating-linear-gradient(180deg, #e0303a 0 9%, #ffffff 9% 18%)";
  if (/古銅/.test(color)) return "#8a6036";
  if (/金/.test(color)) return "#d9aa45";
  if (/淺灰/.test(color)) return "#c4c6c9";
  if (/紅/.test(color)) return "#e0303a";
  if (/藍/.test(color)) return "#2c5cb8";
  if (/黃/.test(color)) return "#ffe24a";
  if (/黑/.test(color)) return "#2b2b2b";
  if (/白/.test(color)) return "#ffffff";
  return null;
}

// 織帶填色（上亮下暗的柔和陰影另外疊加）
export function beltFill(color: string): string | null {
  if (/紅白/.test(color)) return "repeating-linear-gradient(115deg, #d61f2a 0 14px, #f7f7f7 14px 28px)";
  if (/黃黑/.test(color)) return "repeating-linear-gradient(115deg, #f2c40f 0 14px, #1f1f1f 14px 28px)";
  if (/紅藍/.test(color)) return "linear-gradient(180deg, #d61f2a 0 50%, #1f4fa0 50% 100%)";
  // 馬卡龍色系（要在「黃、藍、白」之前判斷）
  if (/櫻花紫/.test(color)) return "#c3aedd";
  if (/檸檬黃/.test(color)) return "#f4e47c";
  if (/湖水藍/.test(color)) return "#86cbd8";
  if (/莓果粉/.test(color)) return "#e895b3";
  if (/米白/.test(color)) return "#efe8da";
  if (/酒紅/.test(color)) return "#7d1a26";
  if (/紅/.test(color)) return "#c8212b";
  if (/藍/.test(color)) return "#1f4fa0";
  if (/黑/.test(color)) return "#1c1c1c";
  if (/黃/.test(color)) return "#f2c40f";
  if (/灰/.test(color)) return "#8a8a8a";
  return null;
}
