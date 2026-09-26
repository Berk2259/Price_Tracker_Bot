"use client";

import { useState, useTransition } from "react";
import { AdminIcon } from "@/components/admin-icons";
import { deletePriceRecord } from "@/app/admin/price-history/actions";

export type PriceItem = {
  id: number;
  productName: string;
  price: number;
  currency: string;
  inStock: boolean | null;
  when: string;
  changePct: number | null;
};

export function PriceRecordRow({ item }: { item: PriceItem }) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function remove() {
    const ok = confirm("Bu fiyat kaydını silmek istediğine emin misin?");
    if (!ok) return;

    startTransition(async () => {
      const result = await deletePriceRecord(item.id);
      if (!result.ok) {
        setMessage(result.message ?? "Silinemedi.");
      }
    });
  }

  const price = `${item.price.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${item.currency}`;

  const change =
    item.changePct === null
      ? { text: "—", cls: "text-zinc-500" }
      : Math.abs(item.changePct) < 0.005
        ? { text: "değişmedi", cls: "bg-zinc-700/40 text-zinc-400" }
        : item.changePct < 0
          ? {
              text: `↓ %${Math.abs(item.changePct).toFixed(1).replace(".", ",")}`,
              cls: "bg-emerald-500/15 text-emerald-400",
            }
          : {
              text: `↑ %${item.changePct.toFixed(1).replace(".", ",")}`,
              cls: "bg-red-500/15 text-red-400",
            };

  return (
    <tr className="transition-colors hover:bg-emerald-500/5">
      <td className="px-4 py-3 text-zinc-500">{item.when}</td>
      <td className="px-4 py-3 font-bold text-zinc-50">{item.productName}</td>
      <td className="px-4 py-3 font-extrabold tabular-nums text-zinc-50">
        {price}
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${change.cls}`}
        >
          {change.text}
        </span>
      </td>
      <td className="px-4 py-3">
        {item.inStock === null ? (
          <span className="text-zinc-500">-</span>
        ) : (
          <span
            className={
              "inline-block rounded-full px-2.5 py-0.5 text-xs font-bold " +
              (item.inStock
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-red-500/15 text-red-400")
            }
          >
            {item.inStock ? "Stokta" : "Yok"}
          </span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            title="Sil"
            aria-label="Sil"
            className="grid h-[34px] w-[34px] place-items-center rounded-[10px] border border-zinc-800 bg-zinc-900 text-zinc-500 transition hover:-translate-y-0.5 hover:border-red-500 hover:text-red-400 disabled:opacity-50"
          >
            <AdminIcon name="trash" size={16} />
          </button>
        </div>
        {message && (
          <p className="mt-1 text-right text-xs text-red-500">{message}</p>
        )}
      </td>
    </tr>
  );
}