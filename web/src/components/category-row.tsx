"use client";

import { useState, useTransition } from "react";
import { deleteCategory, updateCategory } from "@/app/admin/categories/actions";

type Category = { id: number; name: string; created_at: string };

const smallButton =
  "rounded-lg border border-zinc-300 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800";

export function CategoryRow({ category }: { category: Category }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function startEdit() {
    setName(category.name);
    setMessage(null);
    setEditing(true);
  }

  function cancel() {
    setMessage(null);
    setEditing(false);
  }

  function save() {
    startTransition(async () => {
      const result = await updateCategory(category.id, name);
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
      `"${category.name}" kategorisini silmek istediğine emin misin?`,
    );
    if (!ok) return;

    startTransition(async () => {
      const result = await deleteCategory(category.id);
      if (!result.ok) {
        setMessage(result.message ?? "Silinemedi.");
      }
    });
  }

  const createdAt = new Date(category.created_at).toLocaleDateString("tr-TR");

  if (editing) {
    return (
      <tr className="bg-zinc-50 dark:bg-zinc-800/40">
        <td className="px-4 py-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
          {message && <p className="mt-1 text-xs text-red-600">{message}</p>}
        </td>
        <td className="px-4 py-3 text-zinc-500">{createdAt}</td>
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
        <span className="font-medium text-zinc-900 dark:text-zinc-50">
          {category.name}
        </span>
        {message && <p className="mt-1 text-xs text-red-600">{message}</p>}
      </td>
      <td className="px-4 py-3 text-zinc-500">{createdAt}</td>
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