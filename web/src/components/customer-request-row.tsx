"use client";

import { useState, useTransition } from "react";
import { updateCustomerRequestStatus } from "@/app/admin/customer-requests/actions";

type CustomerRequest = {
  id: number;
  note: string | null;
  status: string;
  created_at: string;
  customerName: string;
  categoryName: string;
  productNames: string[];
};

const STATUS_OPTIONS = [
  { value: "bekliyor", label: "Bekliyor" },
  { value: "inceleniyor", label: "İnceleniyor" },
  { value: "tamamlandi", label: "Tamamlandı" },
  { value: "reddedildi", label: "Reddedildi" },
];

const STATUS_COLOR: Record<string, string> = {
  bekliyor: "text-zinc-500",
  inceleniyor: "text-amber-600",
  tamamlandi: "text-emerald-600",
  reddedildi: "text-red-600",
};

const selectClass =
  "rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50";

export function CustomerRequestRow({ request }: { request: CustomerRequest }) {
  const [status, setStatus] = useState(request.status);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function changeStatus(newStatus: string) {
    const previous = status;
    setStatus(newStatus);
    startTransition(async () => {
      const result = await updateCustomerRequestStatus(request.id, newStatus);
      if (!result.ok) {
        setStatus(previous);
        setMessage(result.message ?? "Kaydedilemedi.");
      } else {
        setMessage(null);
      }
    });
  }

  const createdAt = new Date(request.created_at).toLocaleString("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <tr>
      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
        {request.customerName}
      </td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
        {request.categoryName}
      </td>
      <td className="max-w-xs px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">
        {request.productNames.join(", ") || "-"}
      </td>
      <td className="max-w-xs px-4 py-3 text-xs text-zinc-500">
        {request.note ?? "-"}
      </td>
      <td className="px-4 py-3">
        <select
          value={status}
          onChange={(e) => changeStatus(e.target.value)}
          disabled={pending}
          className={`${selectClass} ${STATUS_COLOR[status] ?? ""}`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        {message && <p className="mt-1 text-xs text-red-600">{message}</p>}
      </td>
      <td className="px-4 py-3 text-zinc-500">{createdAt}</td>
    </tr>
  );
}