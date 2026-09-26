"use client";

import { useEffect, useState, useTransition } from "react";
import { AdminIcon } from "@/components/admin-icons";
import {
  addSubscription,
  updateSubscription,
} from "@/app/admin/subscriptions/actions";

export type Option = { id: number; name: string };

export type SubscriptionEdit = {
  id: number;
  customerName: string;
  productName: string;
  targetPrice: number | null;
  notifyAny: boolean;
};

const fieldClass =
  "w-full rounded-[11px] border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-50 outline-none transition focus:border-emerald-500 focus:shadow-[0_0_0_4px_rgba(45,212,191,0.13)]";

const labelClass = "mb-1.5 block text-xs font-bold text-zinc-500";

// editing null ise yeni takip ekleme, değilse düzenleme.
export function SubscriptionDrawer({
  editing,
  customers,
  products,
  onClose,
}: {
  editing: SubscriptionEdit | null;
  customers: Option[];
  products: Option[];
  onClose: () => void;
}) {
  const isNew = editing === null;

  const [customerId, setCustomerId] = useState(String(customers[0]?.id ?? ""));
  const [productId, setProductId] = useState(String(products[0]?.id ?? ""));
  const [targetPrice, setTargetPrice] = useState(
    editing?.targetPrice != null
      ? String(editing.targetPrice).replace(".", ",")
      : "",
  );
  const [notifyAny, setNotifyAny] = useState(editing?.notifyAny ?? false);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Esc ile kapat.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function save() {
    startTransition(async () => {
      const result = editing
        ? await updateSubscription(editing.id, {
            targetPrice,
            notifyOnAnyChange: notifyAny,
          })
        : await addSubscription({
            customerId: Number(customerId),
            productId: Number(productId),
            targetPrice,
            notifyOnAnyChange: notifyAny,
          });
      if (result.ok) {
        onClose();
      } else {
        setMessage(result.message ?? "Kaydedilemedi.");
      }
    });
  }

  return (
    <>
      <div
        className="ad-fade fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside className="ad-slide fixed inset-y-0 right-0 z-50 w-[420px] max-w-full overflow-y-auto border-l border-zinc-800 bg-zinc-900 p-6 shadow-[-20px_0_60px_rgba(0,0,0,0.4)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-zinc-50">
              {isNew ? "Yeni takip" : "Takibi düzenle"}
            </h3>
            <p className="mt-0.5 text-sm text-zinc-500">
              {isNew
                ? "Müşteriyi ve ürünü seç, bildirim kuralını belirle."
                : `${editing.customerName} · ${editing.productName}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="grid h-[34px] w-[34px] flex-none place-items-center rounded-[10px] border border-zinc-800 text-zinc-500 transition hover:border-emerald-500 hover:text-emerald-500"
          >
            <AdminIcon name="x" size={16} />
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          {isNew && (
            <>
              <div>
                <label className={labelClass}>Müşteri</label>
                <select
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className={fieldClass}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Ürün</label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className={fieldClass}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className={labelClass}>Hedef fiyat (isteğe bağlı)</label>
            <input
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              inputMode="decimal"
              placeholder="örn. 59,90"
              autoFocus={!isNew}
              className={fieldClass}
            />
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={notifyAny}
            onClick={() => setNotifyAny(!notifyAny)}
            className="flex items-center gap-2.5 text-left text-sm font-semibold text-zinc-50"
          >
            <span
              className={
                "relative h-6 w-[42px] flex-none rounded-full transition-colors " +
                (notifyAny ? "bg-emerald-500" : "bg-zinc-700")
              }
            >
              <span
                className={
                  "absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all " +
                  (notifyAny ? "left-[21px]" : "left-[3px]")
                }
              />
            </span>
            Her değişimde bildir
          </button>

          <p className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-xs leading-relaxed text-zinc-500">
            Hedef fiyat girersen, fiyat hedefin üstündeyken hedefe ya da altına
            indiğinde bildirim gider. &quot;Her değişimde&quot; açıksa her fiyat
            değişiminde de gider. İkisinden en az biri gerekli.
          </p>
        </div>

        {message && <p className="mt-4 text-sm text-red-500">{message}</p>}

        <div className="mt-6 flex items-center gap-2.5">
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="rounded-[11px] bg-emerald-500 px-4 py-2.5 text-sm font-bold text-[#052e2b] transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {pending
              ? isNew
                ? "Ekleniyor..."
                : "Kaydediliyor..."
              : isNew
                ? "Takibi ekle"
                : "Kaydet"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="rounded-[11px] border border-zinc-800 px-4 py-2.5 text-sm font-bold text-zinc-50 transition hover:border-emerald-500 disabled:opacity-50"
          >
            İptal
          </button>
        </div>
      </aside>
    </>
  );
}