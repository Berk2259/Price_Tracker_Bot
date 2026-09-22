"use client";

import { useState, useTransition } from "react";
import { deletePriceRecord } from "@/app/admin/price-history/actions";

type PriceRecord = {
  id: number;
  price: number;
  currency: string;
  in_stock: boolean | null;
  checked_at: string;
};

export function PriceRecordRow({
  record,
  productName,
}: {
  record: PriceRecord;
  productName: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function remove() {
    const ok = confirm("Bu fiyat kaydını silmek istediğine emin misin?");
    if (!ok) return;

    startTransition(async () => {
      const result = await deletePriceRecord(record.id);
      if (!result.ok) {
        setMessage(result.message ?? "Silinemedi.");
      }
    });
  }

  const price = `${Number(record.price).toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${record.currency}`;

  const checkedAt = new Date(record.checked_at).toLocaleString("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <tr>
      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
        {productName}
      </td>
      <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">{price}</td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
        {record.in_stock === null ? "-" : record.in_stock ? "Stokta" : "Yok"}
      </td>
      <td className="px-4 py-3 text-zinc-500">{checkedAt}</td>
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          className="rounded-lg border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
        >
          {pending ? "..." : "Sil"}
        </button>
        {message && <p className="mt-1 text-xs text-red-600">{message}</p>}
      </td>
    </tr>
  );
}