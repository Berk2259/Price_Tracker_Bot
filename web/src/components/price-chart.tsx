import { shortDate } from "@/lib/time";

type Point = { price: number; at: string };

function fmt(value: number, currency: string) {
  return `${value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

// points: eskiden yeniye sıralı.
export function PriceChart({
  productName,
  currency,
  points,
}: {
  productName: string;
  currency: string;
  points: Point[];
}) {
  if (points.length < 2) {
    return (
      <div className="ad-in mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-[18px]">
        <h3 className="text-[15px] font-bold text-zinc-50">{productName}</h3>
        <p className="mt-2 text-sm text-zinc-500">
          Grafik için en az 2 fiyat kaydı gerekir.
        </p>
      </div>
    );
  }

  const prices = points.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const first = prices[0];
  const last = prices[prices.length - 1];
  const change = first > 0 ? ((last - first) / first) * 100 : 0;

  const W = 800;
  const H = 180;
  const padX = 6;
  const padTop = 14;
  const padBottom = 14;
  const range = max - min || 1;

  const x = (i: number) => padX + (i / (points.length - 1)) * (W - padX * 2);
  const y = (p: number) =>
    padTop + (1 - (p - min) / range) * (H - padTop - padBottom);

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.price).toFixed(1)}`)
    .join(" ");
  const area = `${line} L${x(points.length - 1).toFixed(1)},${H} L${x(0).toFixed(1)},${H} Z`;

  const stats = [
    { label: "Güncel", value: fmt(last, currency) },
    { label: "En düşük", value: fmt(min, currency) },
    { label: "En yüksek", value: fmt(max, currency) },
  ];

  return (
    <div className="ad-in mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-[18px]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-[15px] font-bold text-zinc-50">{productName}</h3>
          <p className="text-xs text-zinc-500">
            Son {points.length} kayıt · {shortDate(points[0].at)} –{" "}
            {shortDate(points[points.length - 1].at)}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-xs font-semibold text-zinc-500">{s.label}</p>
              <p className="text-[15px] font-extrabold tabular-nums text-zinc-50">
                {s.value}
              </p>
            </div>
          ))}
          <div>
            <p className="text-xs font-semibold text-zinc-500">Değişim</p>
            <p
              className={
                "text-[15px] font-extrabold tabular-nums " +
                (change < 0
                  ? "text-emerald-400"
                  : change > 0
                    ? "text-red-400"
                    : "text-zinc-400")
              }
            >
              {change === 0
                ? "değişmedi"
                : `${change < 0 ? "↓" : "↑"} %${Math.abs(change)
                    .toFixed(1)
                    .replace(".", ",")}`}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 h-[180px]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="h-full w-full"
          role="img"
          aria-label={`${productName} fiyat grafiği`}
        >
          <defs>
            <linearGradient id="price-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#price-area)" />
          <path
            d={line}
            fill="none"
            stroke="#2dd4bf"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}