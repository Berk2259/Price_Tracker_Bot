"use client";

import { useState, useTransition } from "react";
import { addSubscription } from "@/app/admin/subscriptions/actions";

type Option = { id: number; name: string };

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

export function AddSubscriptionForm({
  customers,
  products,
}: {
  customers: Option[];
  products: Option[];
}) {
  const [customerId, setCustomerId] = useState(String(customers[0]?.id ?? ""));
  const [productId, setProductId] = useState(String(products[0]?.id ?? ""));
  const [targetPrice, setTargetPrice] = useState("");
  const [notifyOnAnyChange, setNotifyOnAnyChange] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (customers.length === 0 || products.length === 0) {
    return (
      <p className="mt-6 text-sm text-zinc-500">
        Takip eklemek için önce en az bir müşteri ve bir ürün eklemelisin.
      </p>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await addSubscription({
        customerId: Number(customerId),
        productId: Number(productId),
        targetPrice,
        notifyOnAnyChange,
      });
      if (result.ok) {
        setTargetPrice("");
        setNotifyOnAnyChange(false);
        setMessage(null);
      } else {
        setMessage(result.message ?? "Eklenemedi.");
      }
    });
  }

  return (
    <form
      onSubmit={submit}
      className="mt-6 grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-2 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <select
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className={inputClass}
      >
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <select
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        className={inputClass}
      >
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <input
        value={targetPrice}
        onChange={(e) => setTargetPrice(e.target.value)}
        inputMode="decimal"
        placeholder="Hedef fiyat (isteğe bağlı, örn. 59,90)"
        className={inputClass}
      />
      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={notifyOnAnyChange}
          onChange={(e) => setNotifyOnAnyChange(e.target.checked)}
        />
        Her değişimde bildir
      </label>
      <div className="flex items-center justify-end gap-3 sm:col-span-2">
        {message && <p className="text-sm text-red-600">{message}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {pending ? "Ekleniyor..." : "Takip ekle"}
        </button>
      </div>
    </form>
  );
}