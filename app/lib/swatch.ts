// 顏色名稱對應的色票（CSS background）：規格表與產品頁顏色選擇共用
// 多色可選（含「、」）或認不出的顏色回傳 null，不顯示色票
export function swatch(value: string): string | null {
  if (value.includes("、")) return null;
  // 雙層織帶：上下兩色
  if (/紅藍/.test(value)) return "linear-gradient(180deg, #d61f2a 0 50%, #1f4fa0 50% 100%)";
  // 條紋／警示配色
  if (/紅白/.test(value)) return "repeating-linear-gradient(135deg, #d61f2a 0 5px, #fff 5px 10px)";
  if (/黃黑/.test(value)) return "repeating-linear-gradient(135deg, #f2c40f 0 5px, #1f1f1f 5px 10px)";
  // 金屬色
  if (/不鏽鋼|銀/.test(value)) return "linear-gradient(135deg, #f4f4f4 0%, #a9adb2 45%, #e6e7e9 60%, #8d9196 100%)";
  if (/古銅/.test(value)) return "linear-gradient(135deg, #b08a5e 0%, #6b4a2b 50%, #a07a4e 100%)";
  if (/金/.test(value)) return "linear-gradient(135deg, #f3e2a6 0%, #c79a3a 50%, #f0d98c 100%)";
  // 透明、印花
  if (/透明/.test(value)) return "linear-gradient(135deg, rgba(255,255,255,.95) 0%, rgba(214,225,232,.7) 50%, rgba(255,255,255,.95) 100%)";
  if (/印花/.test(value)) return "radial-gradient(circle at 30% 30%, #d61f2a 0 3px, transparent 3.5px), radial-gradient(circle at 70% 65%, #1f4fa0 0 3px, transparent 3.5px), #f3efe6";
  // 馬卡龍色系織帶（要在「黃、藍、白」之前判斷）
  if (/櫻花紫/.test(value)) return "#c3aedd";
  if (/檸檬黃/.test(value)) return "#f4e47c";
  if (/湖水藍/.test(value)) return "#86cbd8";
  if (/莓果粉/.test(value)) return "#e895b3";
  // 單色
  if (/酒紅/.test(value)) return "#7d1a26";
  if (/紅/.test(value)) return "#d61f2a";
  if (/藍/.test(value)) return "#1f4fa0";
  if (/黃/.test(value)) return "#f2c40f";
  if (/黑/.test(value)) return "#1f1f1f";
  if (/米白/.test(value)) return "#efe8da";
  if (/白/.test(value)) return "#ffffff";
  if (/淺灰/.test(value)) return "#c9cacc";
  if (/灰/.test(value)) return "#8a8a8a";
  if (/綠/.test(value)) return "#2f7d4f";
  return null;
}
