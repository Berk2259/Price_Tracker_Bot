import type { PortalProduct } from "@/components/portal-product-card";

// Son 7 fiyat kaydındaki değişim (%). Yeterli kayıt yoksa null.
export function changePct(series: number[]): number | null {
  if (series.length < 2) return null;
  const start = series[Math.max(0, series.length - 7)];
  const end = series[series.length - 1];
  return start > 0 ? ((end - start) / start) * 100 : null;
}

// Güncel fiyatın hedefe göre farkı (%). Negatif ya da sıfır = hedefin altında.
export function gapPct(item: PortalProduct): number | null {
  if (item.targetPrice === null || item.currentPrice === null) return null;
  return ((item.currentPrice - item.targetPrice) / item.targetPrice) * 100;
}