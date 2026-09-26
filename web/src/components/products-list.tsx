"use client";

import { useState } from "react";
import { AdminIcon } from "@/components/admin-icons";
import { ProductRow } from "@/components/product-row";
import {
  ProductDrawer,
  type Option,
  type ProductData,
} from "@/components/product-drawer";

type Filter = "all" | "error" | "waiting" | "off";

function isError(status: string | null) {
  return !!status && status !== "ok";
}

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "error", label: "Hatalı" },
  { value: "waiting", label: "Sırada" },
  { value: "off", label: "Pasif" },
];

function matches(p: ProductData, filter: Filter) {
  if (filter === "error") return p.is_active && isError(p.last_status);
  if (filter === "waiting") return p.is_active && !p.last_status;
  if (filter === "off") return !p.is_active;
  return true;
}

export function ProductsList({
  products,
  categories,
  sources,
}: {
  products: ProductData[];
  categories: Option[];
  sources: Option[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<ProductData | null>(null);
  const [adding, setAdding] = useState(false);

  const canAdd = categories.length > 0 && sources.length > 0;

  const categoryName = (id: number) =>
    categories.find((c) => c.id === id)?.name ?? "";
  const sourceName = (id: number) =>
    sources.find((s) => s.id === id)?.name ?? "";

  const q = query.trim().toLocaleLowerCase("tr");
  const visible = products.filter((p) => {
    if (!matches(p, filter)) return false;
    if (!q) return true;
    return `${p.name} ${categoryName(p.category_id)} ${sourceName(p.source_id)}`
      .toLocaleLowerCase("tr")
      .includes(q);
  });

  function closeDrawer() {
    setEditing(null);
    setAdding(false);
  }

  return (
    <div className="mt-6">
      <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
        <label className="flex min-w-[260px] items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-500 transition focus-within:border-emerald-500 focus-within:shadow-[0_0_0_4px_rgba(45,212,191,0.13)]">
          <svg
            viewBox="0 0 24 24"
            width={16}
            height={16}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün, kategori ya da kaynak ara…"
            className="w-full bg-transparent text-sm text-zinc-50 outline-none placeholder:text-zinc-500"
          />
        </label>

        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => {
            const count = products.filter((p) => matches(p, f.value)).length;
            const on = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={
                  "rounded-full border px-3.5 py-1.5 text-[13px] font-bold transition " +
                  (on
                    ? "border-emerald-500 bg-emerald-500 text-[#052e2b]"
                    : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-emerald-500 hover:text-zinc-50")
                }
              >
                {f.label}
                <span className="ml-1.5 opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        {canAdd ? (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-[11px] bg-emerald-500 px-3.5 py-2 text-sm font-bold text-[#052e2b] transition hover:-translate-y-0.5"
          >
            <AdminIcon name="plus" size={16} /> Ürün ekle
          </button>
        ) : (
          <p className="ml-auto text-sm text-zinc-500">
            Ürün eklemek için önce en az bir kategori ve bir kaynak ekle.
          </p>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-bold">Ürün</th>
              <th className="px-4 py-3 font-bold">Fiyat</th>
              <th className="px-4 py-3 font-bold">Son kontrol</th>
              <th className="px-4 py-3 font-bold">Durum</th>
              <th className="px-4 py-3 text-right font-bold">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {visible.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                categories={categories}
                sources={sources}
                onEdit={setEditing}
              />
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  {products.length === 0
                    ? "Henüz ürün yok."
                    : "Aramana uyan ürün bulunamadı."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(editing || adding) && (
        <ProductDrawer
          key={editing?.id ?? "new"}
          product={editing}
          categories={categories}
          sources={sources}
          groups={[
            ...new Set(
              products
                .map((p) => p.comparison_group)
                .filter((g): g is string => !!g),
            ),
          ]}
          onClose={closeDrawer}
        />
      )}
    </div>
  );
}