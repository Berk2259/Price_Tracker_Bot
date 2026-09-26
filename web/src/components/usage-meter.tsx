// Plan kullanımı çubuğu. max sonsuzsa "sınırsız" gösterir.
// extra: seçimle birlikte eklenecek miktar (talep formunda önizleme için).
export function UsageMeter({
  label,
  used,
  max,
  extra = 0,
}: {
  label: string;
  used: number;
  max: number;
  extra?: number;
}) {
  const unlimited = !Number.isFinite(max);
  const width = unlimited ? 18 : Math.min(100, (used / max) * 100);
  const extraWidth = unlimited
    ? 0
    : Math.min(100 - width, (extra / max) * 100);
  const over = !unlimited && used + extra > max;

  const text = unlimited
    ? `${used} · sınırsız`
    : `${used}${extra > 0 ? ` + ${extra}` : ""} / ${max}`;

  return (
    <div className="mt-3">
      <div className="flex justify-between text-[13.5px] font-bold">
        <span>{label}</span>
        <span className="font-semibold text-zinc-500">{text}</span>
      </div>
      <div className="relative mt-1.5 h-[9px] overflow-hidden rounded-full bg-zinc-800">
        <div
          className="ad-grow absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#2dd4bf,#5eead4)]"
          style={{ width: `${width}%` }}
        />
        {extra > 0 && !unlimited && (
          <div
            className={
              "absolute inset-y-0 rounded-full " +
              (over ? "bg-red-400" : "bg-amber-400/80")
            }
            style={{ left: `${width}%`, width: `${extraWidth}%` }}
          />
        )}
      </div>
    </div>
  );
}