import { AdminIcon } from "@/components/admin-icons";

// Hedef fiyatının altına inen ürün varsa çıkan yeşil bant.
export function PortalDealBanner({
  names,
  url,
}: {
  names: string[];
  url: string;
}) {
  return (
    <div className="ad-in mt-4 flex flex-wrap items-center gap-3.5 rounded-[20px] border border-green-400/35 bg-[linear-gradient(135deg,rgba(74,222,128,0.16),rgba(45,212,191,0.08))] px-[18px] py-3.5">
      <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-[14px] bg-green-400/20 text-green-400">
        <AdminIcon name="party" size={22} />
      </span>
      <span className="min-w-0 flex-1">
        <b className="block text-base">
          {names.length} ürün hedef fiyatının altında! 🎉
        </b>
        <small className="text-zinc-500">
          {names.join(", ")}: şimdi almak için iyi bir zaman.
        </small>
      </span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3.5 py-2 text-sm font-extrabold text-[#052e2b] transition hover:-translate-y-0.5"
      >
        <AdminIcon name="external" size={15} /> Mağazada aç
      </a>
    </div>
  );
}