"use client";

import { useState, useTransition } from "react";
import { submitLead } from "@/app/actions";

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

export function LeadForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [planRequested, setPlanRequested] = useState("free");
  const [categoryInterest, setCategoryInterest] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await submitLead({
        name,
        contact,
        planRequested,
        categoryInterest,
        note,
      });
      if (result.ok) {
        setSent(true);
        setMessage(null);
      } else {
        setMessage(result.message ?? "Gönderilemedi.");
      }
    });
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900 dark:bg-emerald-950">
        <p className="font-medium text-emerald-700 dark:text-emerald-400">
          Talebiniz alındı ✅
        </p>
        <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-500">
          En kısa sürede sizinle iletişime geçeceğiz.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-4 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Adınız"
          className={inputClass}
        />
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
          placeholder="E-posta ya da telefon"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <select
          value={planRequested}
          onChange={(e) => setPlanRequested(e.target.value)}
          className={inputClass}
        >
          <option value="free">Ücretsiz plan</option>
          <option value="premium">Premium plan</option>
        </select>
        <input
          value={categoryInterest}
          onChange={(e) => setCategoryInterest(e.target.value)}
          placeholder="İlgilendiğiniz kategori (örn. Market)"
          className={inputClass}
        />
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        placeholder="Ne takip etmek istediğinizi kısaca yazın (isteğe bağlı)"
        className={inputClass}
      />

      {message && <p className="text-sm text-red-600">{message}</p>}

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