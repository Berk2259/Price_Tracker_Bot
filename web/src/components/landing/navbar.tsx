import Link from "next/link";

export function Navbar({ dark = false }: { dark?: boolean }) {
  return (
    <nav className="flex items-center justify-between py-5">
      <div
        className={`flex items-center gap-2.5 text-[19px] font-extrabold ${
          dark ? "text-white" : "text-ink"
        }`}
      >
        <span
          className={`grid h-[34px] w-[34px] place-items-center rounded-[11px] text-[17px] ${
            dark ? "bg-brand-light text-ink" : "bg-brand shadow-brand"
          }`}
        >
          🔔
        </span>
        Fiyat Takip Botu
      </div>
      <Link
        href="/login"
        className={`rounded-full border-2 px-6 py-3 text-[15px] font-bold transition hover:-translate-y-0.5 ${
          dark
            ? "border-white/60 text-white"
            : "border-ink bg-white text-ink"
        }`}
      >
        Giriş yap
      </Link>
    </nav>
  );
}