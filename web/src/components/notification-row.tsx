"use client";

import { useState, useTransition } from "react";
import { AdminIcon } from "@/components/admin-icons";
import { deleteNotification } from "@/app/admin/notifications/actions";

export type NotificationItem = {
  id: number;
  customerId: number;
  customerName: string;
  productName: string;
  message: string;
  day: string;
  time: string;
};

export function NotificationRow({ item }: { item: NotificationItem }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function remove() {
    const ok = confirm("Bu bildirim kaydını silmek istediğine emin misin?");
    if (!ok) return;

    startTransition(async () => {
      const result = await deleteNotification(item.id);
      if (!result.ok) {
        setError(result.message ?? "Silinemedi.");
      }
    });
  }

  return (
    <div className="flex items-start gap-3.5 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-emerald-500/40">
      <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
        <AdminIcon name="send" size={17} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <b className="text-[15px] text-zinc-50">{item.productName}</b>
          <span className="text-sm text-zinc-500">→ {item.customerName}</span>
          <small className="ml-auto text-zinc-500">{item.time}</small>
        </div>

        <div className="mt-2 whitespace-pre-line rounded-xl rounded-tl-sm border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-300">
          {item.message}
        </div>

        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </div>

      <button
        type="button"
        onClick={remove}
        disabled={pending}
        title="Sil"
        aria-label="Sil"
        className="grid h-[34px] w-[34px] flex-none place-items-center rounded-[10px] border border-zinc-800 bg-zinc-900 text-zinc-500 transition hover:-translate-y-0.5 hover:border-red-500 hover:text-red-400 disabled:opacity-50"
      >
        <AdminIcon name="trash" size={16} />
      </button>
    </div>
  );
}