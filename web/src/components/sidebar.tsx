"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

const items = [
  { href: "/admin", label: "Ana sayfa" },
  { href: "/admin/leads", label: "Talepler" },
  { href: "/admin/customers", label: "Müşteriler" },
  { href: "/admin/categories", label: "Kategoriler" },
  { href: "/admin/sources", label: "Kaynaklar" },
  { href: "/admin/products", label: "Ürünler" },
  { href: "/admin/subscriptions", label: "Takipler" },
  { href: "/admin/price-history", label: "Fiyat geçmişi" },
  { href: "/admin/notifications", label: "Bildirimler" },
];

export function Sidebar({ email }: { email: string | undefined }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 flex w-60 flex-col bg-zinc-950 text-zinc-300">
      <div className="border-b border-zinc-800 px-5 py-5 text-base font-semibold text-white">
        Fiyat Takip Botu
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-emerald-600 text-white"
                  : "hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <p className="mb-3 truncate text-xs text-zinc-500">{email}</p>
        <LogoutButton />
      </div>
    </aside>
  );
}