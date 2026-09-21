"use client";

import { useState, useTransition } from "react";
import { addProduct } from "@/app/products/actions";

type Option = { id: number; name: string };

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

export function AddProductForm({
  categories,
  sources,
}: {
  categories: Option[];
  sources: Option[];
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState(String(categories[0]?.id ?? ""));
  const [sourceId, setSourceId] = useState(String(sources[0]?.id ?? ""));
  const [interval, setInterval] = useState("60");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (categories.length === 0 || sources.length === 0) {
    return (
      <p className="mt-6 text-sm text-zinc-500">
        Ürün eklemek için önce en az bir kategori ve bir kaynak eklemelisin.
      </p>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await addProduct({
        name,
        url,
        categoryId: Number(categoryId),
        sourceId: Number(sourceId),
        checkIntervalMinutes: Number(interval),
        isActive: true,
      });
      if (result.ok) {
        setName("");
        setUrl("");
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
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="Ürün adı"
        className={inputClass}
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        placeholder="Ürün linki (https://...)"
        className={inputClass}
      />
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
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={5}
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className={`w-24 ${inputClass}`}
        />
        <span className="text-sm text-zinc-500">dakikada bir kontrol</span>
      </div>
      <div className="flex items-center justify-end gap-3">
        {message && <p className="text-sm text-red-600">{message}</p>}
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {pending ? "Ekleniyor..." : "Ürün ekle"}
        </button>
      </div>
    </form>
  );
}