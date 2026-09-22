"use client";

import { useState, useTransition } from "react";
import { deleteNotification } from "@/app/admin/notifications/actions";

type Notification = {
  id: number;
  message: string;
  sent_at: string;
};

export function NotificationRow({
  notification,
  customerName,
  productName,
}: {
  notification: Notification;
  customerName: string;
  productName: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function remove() {
    const ok = confirm("Bu bildirim kaydını silmek istediğine emin misin?");
    if (!ok) return;

    startTransition(async () => {
      const result = await deleteNotification(notification.id);
      if (!result.ok) {
        setMessage(result.message ?? "Silinemedi.");
      }
    });
  }

  const sentAt = new Date(notification.sent_at).toLocaleString("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <tr>
      <td className="px-4 py-3 text-zinc-500">{sentAt}</td>
      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
        {customerName}
      </td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
        {productName}
      </td>
      <td className="max-w-md whitespace-pre-line px-4 py-3 text-xs text-zinc-600 dark:text-zinc-400">
        {notification.message}
      </td>
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