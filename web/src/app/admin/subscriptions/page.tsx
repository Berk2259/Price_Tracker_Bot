import { createClient } from "@/lib/supabase/server";
import { AddSubscriptionForm } from "@/components/add-subscription-form";
import { SubscriptionRow } from "@/components/subscription-row";

export default async function SubscriptionsPage() {
  const supabase = await createClient();

  const [subscriptions, customers, products] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("id, customer_id, product_id, target_price, notify_on_any_change")
      .order("id"),
    supabase.from("customers").select("id, name").order("name"),
    supabase
      .from("products")
      .select("id, name, current_price, currency")
      .order("name"),
  ]);

  const customerList = customers.data ?? [];
  const productList = products.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Takipler
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Hangi müşteri hangi ürünü, hangi kurala göre takip ediyor. Bildirimler
        bu kurallara göre gider.
      </p>

      {(subscriptions.error || customers.error || products.error) && (
        <p className="mt-6 text-sm text-red-600">Veriler alınamadı.</p>
      )}

      <AddSubscriptionForm customers={customerList} products={productList} />

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="px-4 py-3 font-medium">Müşteri</th>
              <th className="px-4 py-3 font-medium">Ürün</th>
              <th className="px-4 py-3 font-medium">Hedef fiyat</th>
              <th className="px-4 py-3 font-medium">Her değişimde bildir</th>
              <th className="px-4 py-3 font-medium">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {subscriptions.data?.map((subscription) => {
              const customer = customerList.find(
                (c) => c.id === subscription.customer_id,
              );
              const product = productList.find(
                (p) => p.id === subscription.product_id,
              );

              return (
                <SubscriptionRow
                  key={subscription.id}
                  subscription={subscription}
                  customerName={customer?.name ?? "-"}
                  productName={product?.name ?? "-"}
                  currentPrice={product?.current_price ?? null}
                  currency={product?.currency ?? "TRY"}
                />
              );
            })}
            {subscriptions.data?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-zinc-500">
                  Henüz takip yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}