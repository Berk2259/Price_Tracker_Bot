"use client";

import { useState, useTransition } from "react";
import { AdminIcon } from "@/components/admin-icons";
import { addSource } from "@/app/admin/sources/actions";
import { SOURCE_METHODS } from "@/lib/source-methods";

const inputClass =
  "rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-emerald-500 focus:shadow-[0_0_0_4px_rgba(45,212,191,0.13)]";

export function AddSourceForm() {
  const [name, setName] = useState("");
  const [method, setMethod] = useState("json_ld");
  const [baseUrl, setBaseUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await addSource({
        name,
        method,
        baseUrl,
        isActive: true,
      });
      if (result.ok) {
        setName("");
        setBaseUrl("");
        setMessage(null);
      } else {
        setMessage(result.message ?? "Eklenemedi.");
      }
    });
  }

  return (
    <div className="mt-6">
      <form onSubmit={submit} className="flex flex-wrap gap-2.5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Kaynak adı (örn. Migros)"
          className={`w-56 ${inputClass}`}
        />
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
        <input
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          placeholder="Adres (isteğe bağlı)"
          className={`w-64 ${inputClass}`}
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 rounded-[11px] bg-emerald-500 px-4 py-2.5 text-sm font-bold text-[#052e2b] transition hover:-translate-y-0.5 disabled:opacity-50"
        >
          <AdminIcon name="plus" size={16} />
          {pending ? "Ekleniyor..." : "Kaynak ekle"}
        </button>
      </form>
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </div>
  );
}