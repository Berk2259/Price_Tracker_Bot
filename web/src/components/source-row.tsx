"use client";

import { useState, useTransition } from "react";
import { deleteSource, updateSource } from "@/app/admin/sources/actions";
import { SOURCE_METHODS, methodLabel } from "@/lib/source-methods";

type Source = {
  id: number;
  name: string;
  method: string;
  base_url: string | null;
  is_active: boolean;
};

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50";

const smallButton =
  "rounded-lg border border-zinc-300 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800";

export function SourceRow({ source }: { source: Source }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(source.name);
  const [method, setMethod] = useState(source.method);
  const [baseUrl, setBaseUrl] = useState(source.base_url ?? "");
  const [isActive, setIsActive] = useState(source.is_active);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function startEdit() {
    setName(source.name);
    setMethod(source.method);
    setBaseUrl(source.base_url ?? "");
    setIsActive(source.is_active);
    setMessage(null);
    setEditing(true);
  }

  function cancel() {
    setMessage(null);
    setEditing(false);
  }

  function save() {
    startTransition(async () => {
      const result = await updateSource(source.id, {
        name,
        method,
        baseUrl,
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
      `"${source.name}" kaynağını silmek istediğine emin misin?`,
    );
    if (!ok) return;

    startTransition(async () => {
      const result = await deleteSource(source.id);
      if (!result.ok) {
        setMessage(result.message ?? "Silinemedi.");
      }
    });
  }

  if (editing) {
    return (
      <tr className="bg-zinc-50 dark:bg-zinc-800/40">
        <td className="px-4 py-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
          {message && <p className="mt-1 text-xs text-red-600">{message}</p>}
        </td>
        <td className="px-4 py-3">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className={inputClass}
          >
            {SOURCE_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </td>
        <td className="px-4 py-3">
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="Adres (isteğe bağlı)"
            className={inputClass}
          />
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
        <span className="font-medium text-zinc-900 dark:text-zinc-50">
          {source.name}
        </span>
        {message && <p className="mt-1 text-xs text-red-600">{message}</p>}
      </td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
        {methodLabel(source.method)}
      </td>
      <td className="px-4 py-3 text-zinc-500">{source.base_url ?? "-"}</td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
        {source.is_active ? "Aktif" : "Pasif"}
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