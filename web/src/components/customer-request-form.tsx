"use client";

import { useMemo, useState, useTransition } from "react";
import { submitCustomerRequest } from "@/app/portal/actions";

type Category = { id: number; name: string };
type Product = { id: number; name: string; category_id: number };

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

export function CustomerRequestForm({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const [categoryId, setCategoryId] = useState(String(categories[0]?.id ?? ""));
  const [productIds, setProductIds] = useState<number[]>([]);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  const filteredProducts = useMemo(
    () => products.filter((p) => p.category_id === Number(categoryId)),
    [products, categoryId],
  );

  function toggleProduct(id: number) {
    setProductIds((current) =>
      current.includes(id)
        ? current.filter((p) => p !== id)
        : [...current, id],
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await submitCustomerRequest({
        categoryId: Number(categoryId),
        productIds,
        note,
      });
      if (result.ok) {
        setSent(true);
        setProductIds([]);
        setNote("");
        setMessage(null);
      } else {
        setMessage(result.message ?? "Gönderilemedi.");
      }
    });
  }

  if (categories.length === 0) {
    return (
      <p className="text-sm text-zinc-500">Şu an seçilebilecek kategori yok.</p>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Kategori
        </label>
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setProductIds([]);
          }}
          className={inputClass}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Takip etmek istediğiniz ürünler
        </label>
        {filteredProducts.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Bu kategoride henüz ürün yok.
          </p>
        ) : (
          <div className="space-y-1 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
            {filteredProducts.map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
              >
                <input
                  type="checkbox"
                  checked={productIds.includes(p.id)}
                  onChange={() => toggleProduct(p.id)}
                />
                {p.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Not (isteğe bağlı)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className={inputClass}
        />
      </div>

      {message && <p className="text-sm text-red-600">{message}</p>}
      {sent && (
        <p className="text-sm text-emerald-600">Talebiniz gönderildi ✅</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {pending ? "Gönderiliyor..." : "Talep gönder"}
      </button>
    </form>
  );
}