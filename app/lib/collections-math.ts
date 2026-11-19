// 輪播循環計算（純函式，不讀檔）：client 元件可直接匯入，不會把 fs 帶進瀏覽器

// 把任何整數索引轉成 0..n-1（負數往回繞、超出範圍往前繞）
export function wrapIndex(i: number, n: number): number {
  // JavaScript 的 % 對負數會得到負值，所以加 n 再取一次餘數
  return ((i % n) + n) % n;
}

// 位置文字：first 為目前第一張（0 起算），perView 為一次可見張數，total 為總張數；例 rangeLabel(0,4,13) → "01 – 04 / 13"
export function rangeLabel(first: number, perView: number, total: number): string {
  // 數字補成兩位數
  const pad = (n: number) => String(n).padStart(2, "0");
  // 第一張與最後一張（可環繞到開頭），轉成 1 起算
  const from = wrapIndex(first, total) + 1;
  const to = wrapIndex(first + perView - 1, total) + 1;
  return `${pad(from)} – ${pad(to)} / ${pad(total)}`;
}
