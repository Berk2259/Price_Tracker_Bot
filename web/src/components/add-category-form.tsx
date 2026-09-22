"use client";

import { useState, useTransition } from "react";
import { addCategory } from "@/app/admin/categories/actions";

export function AddCategoryForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await addCategory(name);
      if (result.ok) {
        setName("");
        setMessage(null);
      } else {
        setMessage(result.message ?? "Eklenemedi.");
      }
    });
  }

  return (
    <div className="mt-6">
      <form onSubmit={submit} className="flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Kategori adı"
          className="w-64 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {pending ? "Ekleniyor..." : "Kategori ekle"}
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
    </div>
  );
}