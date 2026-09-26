"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { AdminIcon } from "@/components/admin-icons";
import { CopyButton } from "@/components/copy-button";
import {
  CustomerDrawer,
  type CustomerItem,
  type Option,
} from "@/components/customer-drawer";
import { deleteCustomer } from "@/app/admin/customers/actions";

type Filter = "all" | "unbound" | "premium" | "off";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "unbound", label: "Telegram bağlı değil" },
  { value: "premium", label: "Premium" },
  { value: "off", label: "Pasif" },
];

function matches(c: CustomerItem, filter: Filter) {
  if (filter === "unbound") return !c.bound;
  if (filter === "premium") return c.plan === "premium";
  if (filter === "off") return !c.active;
  return true;
}

const iconButton =
  "grid h-[34px] w-[34px] place-items-center rounded-[10px] border border-zinc-800 bg-zinc-900 text-zinc-500 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-500 disabled:opacity-50";

function CustomerCard({
  customer,
  categories,
  onEdit,
}: {
  customer: CustomerItem;
  categories: Option[];
  onEdit: (c: CustomerItem) => void;
}) {
  const [pending, startTransition] = useTransition();

  function remove() {
    const ok = confirm(
      `"${customer.name}" müşterisini silmek istediğine emin misin? Takipleri ve bildirim kayıtları da silinir.`,
    );
    if (ok) {
      startTransition(() => deleteCustomer(customer.id));
    }
  }

  const names = categories
    .filter((c) => customer.categoryIds.includes(c.id))
    .map((c) => c.name);

  return (
    <div
      className={
        "rounded-2xl border border-zinc-800 bg-zinc-900 p-[18px] transition-colors hover:border-emerald-500/40 " +
        (customer.active ? "" : "opacity-60")
      }
    >
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-emerald-500/15 text-base font-extrabold text-emerald-400">
          {(customer.name.trim()[0] ?? "?").toUpperCase()}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <b className="truncate text-[15px] text-zinc-50">{customer.name}</b>
            <span
              className={
                "rounded-full px-2.5 py-0.5 text-xs font-bold " +
                (customer.plan === "premium"
                  ? "bg-amber-400/15 text-amber-300"
                  : "bg-zinc-700/40 text-zinc-400")
              }
            >
              {customer.plan === "premium" ? "Premium" : "Ücretsiz"}
            </span>
            {!customer.active && (
              <span className="rounded-full bg-zinc-700/40 px-2.5 py-0.5 text-xs font-bold text-zinc-400">
                Pasif
              </span>
            )}
          </div>
          <small className="text-zinc-500">
            Eklenme: {customer.added}
            {customer.hasPortal && " · Portal hesabı var"}
          </small>
        </div>

        <div className="flex gap-1.5">
          <Link
            href={`/admin/notifications?customer=${customer.id}`}
            title="Bildirimleri"
            aria-label="Bildirimleri"
            className={iconButton}
          >
            <AdminIcon name="bell" size={16} />
          </Link>
          <button
            type="button"
            onClick={() => onEdit(customer)}
            disabled={pending}
            title="Düzenle"
            aria-label="Düzenle"
            className={iconButton}
          >
            <AdminIcon name="edit" size={16} />
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            title="Sil"
            aria-label="Sil"
            className={`${iconButton} hover:!border-red-500 hover:!text-red-400`}
          >
            <AdminIcon name="trash" size={16} />
          </button>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        {names.length > 0 ? (
          names.map((n) => (
            <span
              key={n}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-300"
            >
              <AdminIcon name="tag" size={12} />
              {n}
            </span>
          ))
        ) : (
          <span className="text-xs text-zinc-500">Kategori atanmamış</span>
        )}
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-zinc-800 pt-3.5">
        {customer.bound ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
            <AdminIcon name="send" size={12} />
            Telegram bağlı
          </span>
        ) : (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-bold text-red-400">
              <AdminIcon name="alert" size={12} />
              Bağlı değil
            </span>
            {customer.linkUrl ? (
              <CopyButton text={customer.linkUrl} />
            ) : (
              <span className="text-xs text-zinc-500">
                Bağlama linki için TELEGRAM_BOT_USERNAME tanımlı olmalı
              </span>
            )}
          </>
        )}
        <Link
          href="/admin/subscriptions"
          className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-emerald-500 hover:text-emerald-400"
        >
          {customer.subCount} takip <AdminIcon name="arrow" size={13} />
        </Link>
      </div>
    </div>
  );
}

export function CustomersList({
  customers,
  categories,
}: {
  customers: CustomerItem[];
  categories: Option[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<CustomerItem | null>(null);
  const [adding, setAdding] = useState(false);

  const q = query.trim().toLocaleLowerCase("tr");
  const visible = customers.filter(
    (c) =>
      matches(c, filter) && (!q || c.name.toLocaleLowerCase("tr").includes(q)),
  );

  function closeDrawer() {
    setEditing(null);
    setAdding(false);
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <label className="flex min-w-[240px] items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-500 transition focus-within:border-emerald-500 focus-within:shadow-[0_0_0_4px_rgba(45,212,191,0.13)]">
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
            placeholder="Müşteri ara…"
            className="w-full bg-transparent text-sm text-zinc-50 outline-none placeholder:text-zinc-500"
          />
        </label>

        <div className="flex flex-wrap gap-1.5">
          {filters.map((f) => {
            const count = customers.filter((c) => matches(c, f.value)).length;
            const on = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={
                  "rounded-full border px-3.5 py-1.5 text-[13px] font-bold transition " +
                  (on
                    ? "border-emerald-500 bg-emerald-500 text-[#052e2b]"
                    : "border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-emerald-500 hover:text-zinc-50")
                }
              >
                {f.label}
                <span className="ml-1.5 opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setAdding(true)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-[11px] bg-emerald-500 px-3.5 py-2 text-sm font-bold text-[#052e2b] transition hover:-translate-y-0.5"
        >
          <AdminIcon name="plus" size={16} /> Müşteri ekle
        </button>
      </div>

      <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((customer, i) => (
          <div
            key={customer.id}
            className="ad-in"
            style={{ "--i": Math.min(i, 8) } as React.CSSProperties}
          >
            <CustomerCard
              customer={customer}
              categories={categories}
              onEdit={setEditing}
            />
          </div>
        ))}
        {visible.length === 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-10 text-center text-zinc-500 md:col-span-2 xl:col-span-3">
            {customers.length === 0
              ? "Henüz müşteri yok."
              : "Bu aramaya uyan müşteri yok."}
          </div>
        )}
      </div>

      {(editing || adding) && (
        <CustomerDrawer
          key={editing?.id ?? "new"}
          editing={editing}
          categories={categories}
          onClose={closeDrawer}
        />
      )}
    </div>
  );
}