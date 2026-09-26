"use client";

import { useState, useTransition } from "react";
import { AdminIcon } from "@/components/admin-icons";
import { deleteCategory, updateCategory } from "@/app/admin/categories/actions";

export type CategoryItem = {
  id: number;
  name: string;
  added: string;
  productCount: number;
  customerCount: number;
};

const iconButton =
  "grid h-[34px] w-[34px] place-items-center rounded-[10px] border border-zinc-800 bg-zinc-900 text-zinc-500 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-500 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:border-zinc-800 disabled:hover:text-zinc-500";

export function CategoryRow({ category }: { category: CategoryItem }) {
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

  const hasProducts = category.productCount > 0;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-[18px] transition-colors hover:border-emerald-500/40">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
          <AdminIcon name="tag" size={18} />
        </span>

        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") cancel();
              }}
              autoFocus
              className="w-full rounded-[10px] border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-sm text-zinc-50 outline-none focus:border-emerald-500"
            />
          ) : (
            <b className="block truncate text-[15px] text-zinc-50">
              {category.name}
            </b>
          )}
          <small className="text-zinc-500">Eklenme: {category.added}</small>
        </div>

        <div className="flex gap-1.5">
          {editing ? (
            <>
              <button
                type="button"
                onClick={save}
                disabled={pending}
                title="Kaydet"
                aria-label="Kaydet"
                className={iconButton}
              >
                <AdminIcon name="check" size={16} stroke={3} />
              </button>
              <button
                type="button"
                onClick={cancel}
                disabled={pending}
                title="İptal"
                aria-label="İptal"
                className={iconButton}
              >
                <AdminIcon name="x" size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={startEdit}
                disabled={pending}
                title="Adı düzenle"
                aria-label="Adı düzenle"
                className={iconButton}
              >
                <AdminIcon name="edit" size={16} />
              </button>
              <button
                type="button"
                onClick={remove}
                disabled={pending || hasProducts}
                title={
                  hasProducts
                    ? "Bağlı ürünler var, önce onları taşı ya da sil"
                    : "Sil"
                }
                aria-label="Sil"
                className={iconButton}
              >
                <AdminIcon name="trash" size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-300">
          <AdminIcon name="package" size={13} />
          {category.productCount} ürün
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-300">
          <AdminIcon name="users" size={13} />
          {category.customerCount} müşteri
        </span>
      </div>

      {message && <p className="mt-3 text-xs text-red-500">{message}</p>}
    </div>
  );
}