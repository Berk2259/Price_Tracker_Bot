"use client";

import { useState } from "react";
import { LeadRow, STATUS_OPTIONS, type Lead } from "@/components/lead-row";

type Filter = "all" | string;

export function LeadsList({ leads }: { leads: Lead[] }) {
  // Bekleyen talep varsa "Bekliyor" filtresiyle açılır.
  const [filter, setFilter] = useState<Filter>(
    leads.some((l) => l.status === "bekliyor") ? "bekliyor" : "all",
  );
  const [query, setQuery] = useState("");

  const chips: { value: Filter; label: string }[] = [
    { value: "all", label: "Tümü" },
    ...STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label })),
  ];

  const q = query.trim().toLocaleLowerCase("tr");
  const visible = leads.filter((l) => {
    if (filter !== "all" && l.status !== filter) return false;
    if (!q) return true;
    return `${l.name} ${l.contact} ${l.note ?? ""} ${l.category_interest ?? ""}`
      .toLocaleLowerCase("tr")
      .includes(q);
  });

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
            placeholder="Ad, iletişim ya da not ara…"
            className="w-full bg-transparent text-sm text-zinc-50 outline-none placeholder:text-zinc-500"
          />
        </label>

        <div className="flex flex-wrap gap-1.5">
          {chips.map((c) => {
            const count =
              c.value === "all"
                ? leads.length
                : leads.filter((l) => l.status === c.value).length;
            const on = filter === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setFilter(c.value)}
                className={
                  "rounded-full border px-3.5 py-1.5 text-[13px] font-bold transition " +
                  (on
                    ? "border-emerald-500 bg-emerald-500 text-[#052e2b]"
                    : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-emerald-500 hover:text-zinc-50")
                }
              >
                {c.label}
                <span className="ml-1.5 opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3">
        {visible.map((lead, i) => (
          <div
            key={lead.id}
            className="ad-in"
            style={{ "--i": Math.min(i, 8) } as React.CSSProperties}
          >
            <LeadRow lead={lead} />
          </div>
        ))}
        {visible.length === 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-10 text-center text-zinc-500">
            {leads.length === 0
              ? "Henüz talep yok."
              : "Bu filtreye uyan talep yok."}
          </div>
        )}
      </div>
    </div>
  );
}