// "12 dk önce", "3 sa önce" gibi kısa göreli zaman.
export function timeAgo(iso: string | null): string {
  if (!iso) return "-";
  const minutes = Math.max(
    0,
    Math.round((Date.now() - new Date(iso).getTime()) / 60000),
  );
  if (minutes < 1) return "az önce";
  if (minutes < 60) return `${minutes} dk önce`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} sa önce`;
  return `${Math.round(hours / 24)} gün önce`;
}

// Bugünün başlangıcı (sunucunun yerel saatine göre), ISO metin olarak.
export function startOfTodayIso(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}