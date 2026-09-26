"use client";

import { useRouter } from "next/navigation";

type Product = { id: number; name: string };

export function PriceHistoryFilter({
  products,
  current,
}: {
  products: Product[];
  current: string;
}) {
  const router = useRouter();

  return (
    <select
      value={current}
      onChange={(e) => {
        const value = e.target.value;
        router.push(
          value ? `/admin/price-history?product=${value}` : "/admin/price-history",
        );
      }}
      aria-label="Ürün"
      className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none transition focus:border-emerald-500"
    >
      <option value="">Tüm ürünler</option>
      {products.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}