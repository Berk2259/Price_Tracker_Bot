import Link from "next/link";
import { AdminIcon, type AdminIconName } from "@/components/admin-icons";

const items: {
  href: string;
  title: string;
  text: string;
  icon: AdminIconName;
  live?: boolean;
}[] = [
    {
      href: "/portal/reports",
      title: "Haftalık rapor",
      text: "Fiyat değişimlerinin özeti",
      icon: "chart",
      live: true,
    },
    {
      href: "/portal/compare",
      title: "Ürün kıyası",
      text: "Alternatiflerle fiyat kıyasla",
      icon: "scale",
      live: true,
    },
  ];

// Ücretsizde "Premium" (kilit), Premium'da hazırsa "Aç", hazır değilse "Yakında".
export function PortalTeasers({ premium }: { premium: boolean }) {
  return (
    <div className="grid gap-3">
      {items.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className="flex items-center gap-3 rounded-[20px] border border-zinc-800 bg-zinc-900 px-3.5 py-3 transition hover:border-amber-400/50"
        >
          <span className="grid h-8 w-8 flex-none place-items-center rounded-[10px] bg-amber-400/15 text-amber-300">
            <AdminIcon name={t.icon} size={17} />
          </span>
          <span className="min-w-0 flex-1">
            <b className="block text-sm">{t.title}</b>
            <small className="text-zinc-500">{t.text}</small>
          </span>
          {premium && t.live ? (
            <span className="inline-flex flex-none items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11.5px] font-extrabold text-emerald-400">
              Aç <AdminIcon name="arrow" size={11} stroke={2.6} />
            </span>
          ) : (
            <span className="inline-flex flex-none items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-0.5 text-[11.5px] font-extrabold text-amber-300">
              {premium ? (
                "Yakında"
              ) : (
                <>
                  <AdminIcon name="lock" size={11} stroke={2.6} /> Premium
                </>
              )}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}