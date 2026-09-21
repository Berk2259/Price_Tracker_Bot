import Link from "next/link";
import { createClient } from "@/lib/supabase/server";


const cards = [
  { table: "customers", label: "Müşteriler", href: "/customers" },
  { table: "categories", label: "Kategoriler", href: "/categories" },
  { table: "sources", label: "Kaynaklar", href: "/sources" },
  { table: "products", label: "Ürünler", href: "/products" },
  { table: "subscriptions", label: "Takipler", href: "/subscriptions" },
  { table: "price_history", label: "Fiyat kayıtları", href: "/price-history" },
  { table: "notification_log", label: "Bildirimler", href: "/notifications" },
];

export default async function HomePage() {
  const supabase = await createClient();

  const counts = await Promise.all(
    cards.map((card) =>
      supabase.from(card.table).select("*", { count: "exact", head: true }),
    ),
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Hoş geldin
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Fiyat takip sisteminin genel durumu.
      </p>

      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <Link
            key={card.table}
            href={card.href}
            className="rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-500"
          >
            <p className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
              {counts[i].count ?? "hata"}
            </p>
            <p className="mt-1 text-sm text-zinc-500">{card.label}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}