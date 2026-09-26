"use client";

import { useState } from "react";
import { AdminIcon } from "@/components/admin-icons";

export type NotificationItem = {
  id: number;
  product: string;
  message: string;
  day: string;
  time: string;
};

// Mesajdaki bağlantıları tıklanabilir yapar.
function MessageBody({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) =>
        line.startsWith("http") ? (
          <a
            key={i}
            href={line}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-emerald-500 hover:text-emerald-400"
          >
            {line}
          </a>
        ) : (
          <span key={i} className="block">
            {line}
          </span>
        ),
      )}
    </>
  );
}

export function PortalNotificationsList({
  items,
}: {
  items: NotificationItem[];
}) {
  const [query, setQuery] = useState("");

  const q = query.trim().toLocaleLowerCase("tr");
  const visible = items.filter(
    (n) =>
      !q || `${n.product} ${n.message}`.toLocaleLowerCase("tr").includes(q),
  );

  // Liste zaten yeniden eskiye sıralı, aynı günleri art arda grupla.
  const groups: { label: string; items: NotificationItem[] }[] = [];
  for (const n of visible) {
    const last = groups[groups.length - 1];
    if (last && last.label === n.day) {
      last.items.push(n);
    } else {
      groups.push({ label: n.day, items: [n] });
    }
  }

  return (
    <div className="mt-5">
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <label className="flex min-w-0 flex-1 basis-[220px] items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-500 transition focus-within:border-emerald-500 focus-within:shadow-[0_0_0_4px_rgba(45,212,191,0.13)] sm:max-w-[340px]">
          <AdminIcon name="search" size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün ya da mesaj ara…"
            className="w-full bg-transparent text-sm text-zinc-50 outline-none placeholder:text-zinc-500"
          />
        </label>
        <span className="ml-auto text-sm text-zinc-500">
          {visible.length} bildirim
        </span>
      </div>

      {groups.map((group) => (
        <section key={group.label} className="mb-5">
          <h3 className="mb-2.5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-zinc-500">
            {group.label}
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-400">
              {group.items.length}
            </span>
          </h3>
          <div className="grid gap-2.5">
            {group.items.map((n, i) => (
              <div
                key={n.id}
                className="ad-in flex items-start gap-3.5 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-emerald-500/40"
                style={{ "--i": Math.min(i, 8) } as React.CSSProperties}
              >
                <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <AdminIcon name="send" size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <b className="text-[15px]">{n.product}</b>
                    <small className="ml-auto text-zinc-500">{n.time}</small>
                  </div>
                  <div className="mt-2 rounded-xl rounded-tl-sm border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-300">
                    <MessageBody text={n.message} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {visible.length === 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-10 text-center text-zinc-500">
          {items.length === 0
            ? "Henüz bildirim almadın. Fiyat değişince burada göreceksin."
            : "Aramana uyan bildirim yok."}
        </div>
      )}
    </div>
  );
}