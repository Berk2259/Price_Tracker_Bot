import { AdminIcon } from "@/components/admin-icons";

// Telegram bağlı mı? Bağlı değilse bağlama linkini gösterir.
export function PortalTelegramCard({
  bound,
  linkUrl,
}: {
  bound: boolean;
  linkUrl: string | null;
}) {
  if (bound) {
    return (
      <div className="flex items-center gap-3 rounded-[18px] bg-green-400/10 px-4 py-3.5">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-[11px] bg-green-400/20 text-green-400">
          <AdminIcon name="send" size={17} />
        </span>
        <span>
          <b className="block">Telegram bağlı</b>
          <small className="text-zinc-500">Bildirimler açık.</small>
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-amber-400/30 bg-amber-400/10 px-4 py-3.5">
      <span className="grid h-9 w-9 flex-none place-items-center rounded-[11px] bg-amber-400/20 text-amber-300">
        <AdminIcon name="alert" size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <b className="block">Telegram bağlı değil</b>
        <small className="text-zinc-500">Bağlanmazsan bildirim gelmez.</small>
      </span>
      {linkUrl && (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl bg-emerald-500 px-3 py-1.5 text-[13px] font-extrabold text-[#052e2b] transition hover:-translate-y-0.5"
        >
          Bağlan
        </a>
      )}
    </div>
  );
}