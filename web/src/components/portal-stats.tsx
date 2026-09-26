import { AdminIcon, type AdminIconName } from "@/components/admin-icons";

type Tile = {
  label: string;
  value: string;
  suffix?: string;
  text: string;
  icon: AdminIconName;
  tone: "teal" | "green" | "amber";
  small?: boolean;
};

const toneClass = {
  teal: "bg-emerald-500/15 text-emerald-400",
  green: "bg-green-400/15 text-green-400",
  amber: "bg-amber-400/15 text-amber-300",
};

export function PortalStats({
  total,
  categories,
  belowTarget,
  withTarget,
  dropped,
  lastChecked,
}: {
  total: number;
  categories: number;
  belowTarget: number;
  withTarget: number;
  dropped: number;
  lastChecked: string;
}) {
  const tiles: Tile[] = [
    {
      label: "Takipteki ürün",
      value: String(total),
      text: `${categories} kategoride`,
      icon: "package",
      tone: "teal",
    },
    {
      label: "Hedefte",
      value: String(belowTarget),
      suffix: `/ ${withTarget}`,
      text: "hedefinin altındaki ürün",
      icon: "check",
      tone: "green",
    },
    {
      label: "Fiyatı düşen",
      value: String(dropped),
      text: "son 7 kayıtta",
      icon: "trend",
      tone: "amber",
    },
    {
      label: "Son kontrol",
      value: lastChecked,
      text: "bot ürünleri düzenli kontrol eder",
      icon: "clock",
      tone: "teal",
      small: true,
    },
  ];

  return (
    <div className="mt-4 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
      {tiles.map((t, i) => (
        <div
          key={t.label}
          className="ad-in rounded-[20px] border border-zinc-800 bg-zinc-900 px-[18px] py-4 transition hover:-translate-y-[3px] hover:border-emerald-500"
          style={{ "--i": i } as React.CSSProperties}
        >
          <div className="flex items-center gap-2.5 text-[13.5px] font-bold text-zinc-500">
            <span
              className={`grid h-7 w-7 place-items-center rounded-[9px] ${toneClass[t.tone]}`}
            >
              <AdminIcon name={t.icon} size={16} />
            </span>
            {t.label}
          </div>
          <div
            className={
              "font-extrabold tracking-[-0.03em] " +
              (t.small ? "mt-3 text-[22px]" : "mt-2 text-[30px]")
            }
          >
            {t.value}
            {t.suffix && (
              <small className="ml-1 text-sm font-bold tracking-normal text-zinc-500">
                {t.suffix}
              </small>
            )}
          </div>
          <div className="text-[12.5px] font-bold text-zinc-500">{t.text}</div>
        </div>
      ))}
    </div>
  );
}