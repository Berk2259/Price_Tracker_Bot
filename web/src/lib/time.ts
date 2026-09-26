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

const TIME_ZONE = "Europe/Istanbul";

function dayKey(d: Date): string {
  return d.toLocaleDateString("en-CA", { timeZone: TIME_ZONE });
}

// "Bugün", "Dün" ya da "12 Eylül 2026" (Türkiye saatine göre).
export function dayLabel(iso: string): string {
  const key = dayKey(new Date(iso));
  if (key === dayKey(new Date())) return "Bugün";
  if (key === dayKey(new Date(Date.now() - 24 * 60 * 60 * 1000))) return "Dün";
  return new Date(iso).toLocaleDateString("tr-TR", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// "14:32" (Türkiye saatine göre).
export function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("tr-TR", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  });
}

// "24 Eyl" (Türkiye saatine göre).
export function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "short",
  });
}

// "24 Eyl 23:19" (Türkiye saatine göre).
export function shortDateTime(iso: string): string {
  return new Date(iso).toLocaleString("tr-TR", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}