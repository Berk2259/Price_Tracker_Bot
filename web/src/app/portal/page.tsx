import { createClient } from "@/lib/supabase/server";

type Product = {
  name: string;
  url: string;
  current_price: number | null;
  currency: string;
  last_checked_at: string | null;
};

type Subscription = {
  id: number;
  target_price: number | null;
  notify_on_any_change: boolean;
  products: Product | Product[] | null;
};

function formatMoney(value: number, currency: string): string {
  return `${value.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

export default async function PortalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("auth_user_id", user?.id ?? "")
    .maybeSingle();

  if (!customer) return null;

  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      "id, target_price, notify_on_any_change, products(name, url, current_price, currency, last_checked_at)",
    )
    .eq("customer_id", customer.id);

  const subscriptions = (data ?? []) as Subscription[];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Takip ettiğim ürünler
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Fiyat değiştiğinde ya da hedef fiyata düştüğünde Telegram'dan haber
        alırsınız.
      </p>

      {error && (
        <p className="mt-6 text-sm text-red-600">Ürünler alınamadı.</p>
      )}

      <div className="mt-6 space-y-3">
        {subscriptions.map((sub) => {
          const product = Array.isArray(sub.products)
            ? sub.products[0]
            : sub.products;
          if (!product) return null;

          const price =
            product.current_price !== null
              ? formatMoney(product.current_price, product.currency)
              : "Henüz kontrol edilmedi";

          return (
            <div
              key={sub.id}
              className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-zinc-900 hover:text-emerald-600 dark:text-zinc-50"
              >
                {product.name}
              </a>
              <p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {price}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {sub.target_price !== null &&
                  `Hedef fiyat: ${formatMoney(sub.target_price, product.currency)}`}
                {sub.target_price !== null && sub.notify_on_any_change && " · "}
                {sub.notify_on_any_change && "Her değişimde bildirim"}
              </p>
            </div>
          );
        })}

        {subscriptions.length === 0 && (
          <p className="text-sm text-zinc-500">
            Henüz takip edilen bir ürününüz yok.
          </p>
        )}
      </div>
    </div>
  );
}