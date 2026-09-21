"use client";

import { useState, useTransition } from "react";
import { deleteProduct, updateProduct } from "@/app/products/actions";

type Option = { id: number; name: string };

type Product = {
  id: number;
  name: string;
  url: string;
  category_id: number;
  source_id: number;
  current_price: number | null;
  currency: string;
  check_interval_minutes: number;
  last_checked_at: string | null;
  last_status: string | null;
  is_active: boolean;
};

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50";

const smallButton =
  "rounded-lg border border-zinc-300 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800";

export function ProductRow({
  product,
  categories,
  sources,
}: {
  product: Product;
  categories: Option[];
  sources: Option[];
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(product.name);
  const [url, setUrl] = useState(product.url);
  const [categoryId, setCategoryId] = useState(String(product.category_id));
  const [sourceId, setSourceId] = useState(String(product.source_id));
  const [interval, setInterval] = useState(
    String(product.check_interval_minutes),
  );
  const [isActive, setIsActive] = useState(product.is_active);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function startEdit() {
    setName(product.name);
    setUrl(product.url);
    setCategoryId(String(product.category_id));
    setSourceId(String(product.source_id));
    setInterval(String(product.check_interval_minutes));
    setIsActive(product.is_active);
    setMessage(null);
    setEditing(true);
  }

  function cancel() {
    setMessage(null);
    setEditing(false);
  }

  function save() {
    startTransition(async () => {
      const result = await updateProduct(product.id, {
        name,
        url,
        categoryId: Number(categoryId),
        sourceId: Number(sourceId),
        checkIntervalMinutes: Number(interval),
        isActive,
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
      `"${product.name}" ürününü silmek istediğine emin misin? Takipleri ve fiyat geçmişi de silinir.`,
    );
    if (!ok) return;

    startTransition(async () => {
      const result = await deleteProduct(product.id);
      if (!result.ok) {
        setMessage(result.message ?? "Silinemedi.");
      }
    });
  }

  const categoryName =
    categories.find((c) => c.id === product.category_id)?.name ?? "-";
  const sourceName = sources.find((s) => s.id === product.source_id)?.name ?? "-";

  const price =
    product.current_price !== null
      ? `${Number(product.current_price).toLocaleString("tr-TR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} ${product.currency}`
      : "-";

  const lastChecked = product.last_checked_at
    ? new Date(product.last_checked_at).toLocaleString("tr-TR", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "Henüz kontrol edilmedi";

  const hasError = product.last_status && product.last_status !== "ok";

  if (editing) {
    return (
      <tr className="bg-zinc-50 dark:bg-zinc-800/40">
        <td className="space-y-2 px-4 py-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ürün adı"
            className={inputClass}
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ürün linki"
            className={inputClass}
          />
          {message && <p className="text-xs text-red-600">{message}</p>}
        </td>
        <td className="px-4 py-3">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </td>
        <td className="px-4 py-3">
          <select
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            className={inputClass}
          >
            {sources.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </td>
        <td className="px-4 py-3 text-zinc-500">{price}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={5}
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className={`w-20 ${inputClass}`}
            />
            <span className="text-xs text-zinc-500">dk</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <label className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Aktif
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
      <td className="px-4 py-3">
        <p className="font-medium text-zinc-900 dark:text-zinc-50">
          {product.name}
        </p>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block max-w-xs truncate text-xs text-zinc-500 hover:text-emerald-600"
        >
          {product.url}
        </a>
        {message && <p className="mt-1 text-xs text-red-600">{message}</p>}
      </td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
        {categoryName}
      </td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
        {sourceName}
      </td>
      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
        {price}
      </td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
        {product.check_interval_minutes} dk
      </td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
        {product.is_active ? "Aktif" : "Pasif"}
        <p className="text-xs text-zinc-500">{lastChecked}</p>
        {hasError && (
          <p className="max-w-xs truncate text-xs text-red-600">
            {product.last_status}
          </p>
        )}
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