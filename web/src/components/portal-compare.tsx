import { AdminIcon } from "@/components/admin-icons";

export type CompareRow = {
  id: number;
  name: string;
  source: string;
  price: number | null;
  currency: string;
  url: string;
  lastChecked: string;
  mine: boolean;
};

export type CompareGroup = { key: string; rows: CompareRow[] };
export type SoloProduct = { id: number; name: string; source: string };

function money(value: number, currency: string) {
  return `${value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

function pct(value: number) {
  return Math.abs(value).toFixed(1).replace(".", ",");
}

export function PortalCompare({
  groups,
  solo,
  lastUpdated,
}: {
  groups: CompareGroup[];
  solo: SoloProduct[];
  lastUpdated: string;
}) {
  // Her grup için: en ucuz satır ve takip edilen ürünle arasındaki fark.
  const analysed = groups.map((g) => {
    const priced = g.rows.filter((r) => r.price !== null);
    const sorted = [...g.rows].sort(
      (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity),
    );
    const cheapest = priced.length
      ? priced.reduce((a, b) => ((b.price as number) < (a.price as number) ? b : a))
      : null;
    const minePrices = g.rows
      .filter((r) => r.mine && r.price !== null)
      .map((r) => r.price as number);
    const myBest = minePrices.length ? Math.min(...minePrices) : null;
    const saving =
      cheapest && myBest !== null && myBest > (cheapest.price as number)
        ? myBest - (cheapest.price as number)
        : 0;
    return { g, sorted, cheapest, saving };
  });

  const totalSaving = analysed.reduce((s, a) => s + a.saving, 0);
  const cheaperExists = analysed.filter((a) => a.saving > 0.001).length;
  const currency = groups[0]?.rows[0]?.currency ?? "TRY";

  const tiles = [
    {
      label: "Karşılaştırılan",
      value: String(groups.length),
      text: "ürünün alternatifi var",
      icon: "scale" as const,
      tone: "bg-emerald-500/15 text-emerald-400",
    },
    {
      label: "Tasarruf potansiyeli",
      value: money(totalSaving, currency),
      text: "en ucuz alternatifleri seçersen",
      icon: "coin" as const,
      tone: "bg-green-400/15 text-green-400",
    },
    {
      label: "Daha ucuzu var",
      value: `${cheaperExists} / ${groups.length}`,
      text: "üründe daha ucuz alternatif var",
      icon: "trend" as const,
      tone: "bg-amber-400/15 text-amber-300",
    },
    {
      label: "Son güncelleme",
      value: lastUpdated,
      text: "bot fiyatları düzenli kontrol eder",
      icon: "clock" as const,
      tone: "bg-emerald-500/15 text-emerald-400",
    },
  ];

  return (
    <div>
      <div className="ad-in">
        <h1 className="text-[26px] font-bold tracking-[-0.02em]">
          Alternatiflerle fiyat kıyaslama
        </h1>
        <p className="mt-0.5 text-zinc-500">
          Takip ettiğin ürünlerin, yerine alabileceğin alternatifleriyle fiyat
          karşılaştırması.
        </p>
      </div>

      {groups.length === 0 ? (
        <div className="mt-5 rounded-[20px] border-2 border-dashed border-zinc-800 px-5 py-12 text-center text-zinc-500">
          Takip ettiğin ürünlerin henüz bir alternatifi eklenmemiş.
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
            {tiles.map((t, i) => (
              <div
                key={t.label}
                className="ad-in rounded-[20px] border border-zinc-800 bg-zinc-900 px-[18px] py-4 transition hover:-translate-y-[3px] hover:border-emerald-500"
                style={{ "--i": i } as React.CSSProperties}
              >
                <div className="flex items-center gap-2.5 text-[13.5px] font-bold text-zinc-500">
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-[9px] ${t.tone}`}
                  >
                    <AdminIcon name={t.icon} size={16} />
                  </span>
                  {t.label}
                </div>
                <div className="mt-2 text-[24px] font-extrabold leading-[1.15] tracking-[-0.03em]">
                  {t.value}
                </div>
                <div className="mt-0.5 text-[12.5px] font-bold text-zinc-500">
                  {t.text}
                </div>
              </div>
            ))}
          </div>

          {analysed.map(({ g, sorted, cheapest, saving }, gi) => {
            const mine = g.rows.filter((r) => r.mine);
            const title = mine[0]?.name ?? g.key;
            return (
              <div
                key={g.key}
                className="ad-in mt-4 overflow-hidden rounded-[20px] border border-zinc-800 bg-zinc-900"
                style={{ "--i": Math.min(gi + 4, 10) } as React.CSSProperties}
              >
                <div className="flex flex-wrap items-center gap-3 border-b border-zinc-800 px-[18px] py-4">
                  <b className="text-base">{title}</b>
                  <span className="rounded-lg bg-emerald-500/15 px-2 py-0.5 text-[11.5px] font-extrabold text-emerald-300">
                    {g.rows.length} ürün
                  </span>
                  {saving > 0.001 && cheapest ? (
                    <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-green-400/15 px-3 py-1 text-[13px] font-extrabold text-green-400">
                      <AdminIcon name="coin" size={14} />
                      {cheapest.name} {money(saving, cheapest.currency)} daha ucuz
                    </span>
                  ) : (
                    <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-green-400/15 px-3 py-1 text-[13px] font-extrabold text-green-400">
                      <AdminIcon name="check" size={14} stroke={3} />
                      Takip ettiğin ürün en ucuz
                    </span>
                  )}
                </div>

                {sorted.map((r) => {
                  const isCheapest = cheapest !== null && r.id === cheapest.id;
                  const diff =
                    cheapest && r.price !== null
                      ? ((r.price - (cheapest.price as number)) /
                          (cheapest.price as number)) *
                        100
                      : 0;
                  const barWidth =
                    cheapest && r.price !== null
                      ? Math.max(8, ((cheapest.price as number) / r.price) * 100)
                      : 0;
                  return (
                    <div
                      key={r.id}
                      className={
                        "grid items-center gap-3.5 border-t border-zinc-800 px-[18px] py-3 transition-colors first-of-type:border-t-0 hover:bg-emerald-500/10 sm:grid-cols-[1.4fr_130px_170px_100px_60px] " +
                        (r.mine ? "bg-emerald-500/[0.06]" : "")
                      }
                    >
                      <div className="min-w-0">
                        <b className="block font-extrabold">{r.name}</b>
                        <small className="text-zinc-500">
                          {r.source}
                          {r.mine && (
                            <span className="ml-2 font-bold text-emerald-300">
                              Takip ettiğin
                            </span>
                          )}
                        </small>
                      </div>

                      <div
                        className={
                          "text-[17px] font-extrabold tabular-nums " +
                          (isCheapest ? "text-green-400" : "")
                        }
                      >
                        {r.price !== null ? money(r.price, r.currency) : "—"}
                      </div>

                      <div>
                        {r.price === null ? (
                          <span className="text-[13px] text-zinc-500">
                            Henüz kontrol edilmedi
                          </span>
                        ) : (
                          <>
                            {isCheapest ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-400/15 px-2.5 py-0.5 text-xs font-extrabold text-green-400">
                                <AdminIcon name="check" size={12} stroke={3.2} />
                                En ucuz
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-red-400/15 px-2.5 py-0.5 text-xs font-extrabold text-red-400">
                                +%{pct(diff)} daha pahalı
                              </span>
                            )}
                            <div className="mt-1.5 h-[7px] overflow-hidden rounded-full bg-zinc-800">
                              <div
                                className={
                                  "ad-grow h-full rounded-full " +
                                  (isCheapest
                                    ? "bg-[linear-gradient(90deg,#22c55e,#4ade80)]"
                                    : "bg-[linear-gradient(90deg,#2dd4bf,#5eead4)]")
                                }
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>
                          </>
                        )}
                      </div>

                      <div className="text-[13px] text-zinc-500">
                        {r.lastChecked}
                      </div>

                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-extrabold text-emerald-500 transition-all hover:gap-2 hover:text-emerald-400 sm:justify-end"
                      >
                        Aç <AdminIcon name="external" size={13} />
                      </a>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </>
      )}

      {solo.length > 0 && (
        <div className="mt-4 overflow-hidden rounded-[20px] border border-zinc-800 bg-zinc-900">
          <div className="flex items-center gap-3 border-b border-zinc-800 px-[18px] py-4">
            <b className="text-base">Alternatifi olmayan ürünler</b>
            <span className="rounded-lg bg-zinc-800 px-2 py-0.5 text-[11.5px] font-extrabold text-zinc-400">
              {solo.length}
            </span>
          </div>
          {solo.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 border-t border-zinc-800 px-[18px] py-3 text-zinc-500 first:border-t-0"
            >
              <AdminIcon name="package" size={18} />
              <span>
                <b className="text-zinc-50">{p.name}</b>
                {p.source && ` · ${p.source}`}
                <small className="block">
                  Bu ürün için henüz alternatif eklenmedi.
                </small>
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-3 rounded-[20px] border border-zinc-800 bg-zinc-900 px-[18px] py-3.5 text-[13.5px] text-zinc-500">
        <AdminIcon name="help" size={20} />
        <span>
          Alternatifleri ekibimiz ekler. Bir ürün için alternatif görmek
          istersen <b className="text-emerald-500">Talep gönder</b> sayfasından
          not bırakabilirsin.
        </span>
      </div>
    </div>
  );
}