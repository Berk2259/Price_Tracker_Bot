"use client";

import { useState, useTransition } from "react";
import {
  deleteSubscription,
  updateSubscription,
} from "@/app/admin/subscriptions/actions";

type Subscription = {
  id: number;
  target_price: number | null;
  notify_on_any_change: boolean;
};

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50";

const smallButton =
  "rounded-lg border border-zinc-300 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800";

function formatPrice(value: number | null, currency: string): string {
  if (value === null) return "-";
  return `${Number(value).toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

export function SubscriptionRow({
  subscription,
  customerName,
  productName,
  currentPrice,
  currency,
}: {
  subscription: Subscription;
  customerName: string;
  productName: string;
  currentPrice: number | null;
  currency: string;
}) {
  const [editing, setEditing] = useState(false);
  const [targetPrice, setTargetPrice] = useState(
    subscription.target_price !== null ? String(subscription.target_price) : "",
  );
  const [notifyOnAnyChange, setNotifyOnAnyChange] = useState(
    subscription.notify_on_any_change,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function startEdit() {
    setTargetPrice(
      subscription.target_price !== null
        ? String(subscription.target_price)
        : "",
    );
    setNotifyOnAnyChange(subscription.notify_on_any_change);
    setMessage(null);
    setEditing(true);
  }

  function cancel() {
    setMessage(null);
    setEditing(false);
  }

  function save() {
    startTransition(async () => {
      const result = await updateSubscription(subscription.id, {
        targetPrice,
        notifyOnAnyChange,
      });
      if (result.ok) {
        setMessage(null);
        setEditing(false);
      } else {
        setMessage(result.message ?? "Kaydedilemedi.");
      }
    });
  }

  function remove() {
    const ok = confirm(
      `"${customerName}" müşterisinin "${productName}" takibini silmek istediğine emin misin?`,
    );
    if (!ok) return;

    startTransition(async () => {
      const result = await deleteSubscription(subscription.id);
      if (!result.ok) {
        setMessage(result.message ?? "Silinemedi.");
      }
    });
  }

  const productCell = (
    <td className="px-4 py-3">
      <p className="text-zinc-900 dark:text-zinc-50">{productName}</p>
      <p className="text-xs text-zinc-500">
        Güncel: {formatPrice(currentPrice, currency)}
      </p>
    </td>
  );

  if (editing) {
    return (
      <tr className="bg-zinc-50 dark:bg-zinc-800/40">
        <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
          {customerName}
        </td>
        {productCell}
        <td className="px-4 py-3">
          <input
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            inputMode="decimal"
            placeholder="Hedef fiyat (boş olabilir)"
            className={inputClass}
          />
          {message && <p className="mt-1 text-xs text-red-600">{message}</p>}
        </td>
        <td className="px-4 py-3">
          <label className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={notifyOnAnyChange}
              onChange={(e) => setNotifyOnAnyChange(e.target.checked)}
            />
            Her değişimde
          </label>
        </td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {pending ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button
              type="button"
              onClick={cancel}
              disabled={pending}
              className={smallButton}
            >
              İptal
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
        {customerName}
      </td>
      {productCell}
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
        {formatPrice(subscription.target_price, currency)}
        {message && <p className="mt-1 text-xs text-red-600">{message}</p>}
      </td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
        {subscription.notify_on_any_change ? "Evet" : "Hayır"}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={startEdit}
            disabled={pending}
            className={smallButton}
          >
            Düzenle
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            className="rounded-lg border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
          >
            {pending ? "..." : "Sil"}
          </button>
        </div>
      </td>
    </tr>
  );
}