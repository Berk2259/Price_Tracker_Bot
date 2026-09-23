"use client";

import { useState, useTransition } from "react";
import { deleteLead, updateLeadStatus } from "@/app/admin/leads/actions";

type Lead = {
  id: number;
  name: string;
  contact: string;
  plan_requested: string;
  category_interest: string | null;
  note: string | null;
  status: string;
  created_at: string;
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

export function LeadRow({ lead }: { lead: Lead }) {
  const [status, setStatus] = useState(lead.status);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function changeStatus(newStatus: string) {
    const previous = status;
    setStatus(newStatus);
    startTransition(async () => {
      const result = await updateLeadStatus(lead.id, newStatus);
      if (!result.ok) {
        setStatus(previous);
        setMessage(result.message ?? "Kaydedilemedi.");
      } else {
        setMessage(null);
      }
    });
  }

  function remove() {
    const ok = confirm(`"${lead.name}" talebini silmek istediğine emin misin?`);
    if (!ok) return;

    startTransition(async () => {
      const result = await deleteLead(lead.id);
      if (!result.ok) {
        setMessage(result.message ?? "Silinemedi.");
      }
    });
  }

  const createdAt = new Date(lead.created_at).toLocaleString("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <tr>
      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
        {lead.name}
      </td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
        {lead.contact}
      </td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
        {lead.plan_requested === "premium" ? "Premium" : "Ücretsiz"}
      </td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
        {lead.category_interest ?? "-"}
      </td>
      <td className="max-w-xs px-4 py-3 text-xs text-zinc-500">
        {lead.note ?? "-"}
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
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          className="rounded-lg border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
        >
          Sil
        </button>
      </td>
    </tr>
  );
}