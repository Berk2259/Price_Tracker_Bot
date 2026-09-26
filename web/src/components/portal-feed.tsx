import Link from "next/link";
import { AdminIcon } from "@/components/admin-icons";

export type FeedItem = {
  id: number;
  product: string;
  line: string;
  ago: string;
};

export function PortalFeed({ items }: { items: FeedItem[] }) {
  return (
    <div className="rounded-[20px] border border-zinc-800 bg-zinc-900 p-[18px]">
      <h4 className="flex items-center gap-2 text-[15px] font-bold">
        <AdminIcon name="bell" size={16} /> Son bildirimlerin
        <Link
          href="/portal/notifications"
          className="ml-auto inline-flex items-center gap-1 text-[13px] font-bold text-emerald-500 hover:text-emerald-400"
        >
          Tümü <AdminIcon name="arrow" size={14} />
        </Link>
      </h4>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-500">
          Henüz bildirim almadın. Fiyat değişince burada da göreceksin.
        </p>
      ) : (
        <div className="mt-1.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 border-t border-zinc-800 py-2.5 first:border-t-0"
            >
              <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
                <AdminIcon name="send" size={14} />
              </span>
              <span className="min-w-0 flex-1">
                <b className="block text-[13.5px] leading-snug">
                  {item.product}
                </b>
                {item.line && (
                  <small className="block text-zinc-500">{item.line}</small>
                )}
              </span>
              <span className="whitespace-nowrap text-xs text-zinc-500">
                {item.ago}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}