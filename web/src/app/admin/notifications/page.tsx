import { createClient } from "@/lib/supabase/server";
import { NotificationRow } from "@/components/notification-row";

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ customer?: string }>;
}) {
  const { customer } = await searchParams;
  const customerId = Number(customer);
  const filtered = Number.isInteger(customerId) && customerId > 0;

  const supabase = await createClient();

  let logQuery = supabase
    .from("notification_log")
    .select("id, customer_id, product_id, message, sent_at");
  if (filtered) {
    logQuery = logQuery.eq("customer_id", customerId);
  }

  const [logs, customers, products] = await Promise.all([
    logQuery.order("sent_at", { ascending: false }).limit(100),
    supabase.from("customers").select("id, name").order("name"),
    supabase.from("products").select("id, name"),
  ]);

  const customerList = customers.data ?? [];
  const productList = products.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Bildirimler
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Müşterilere gönderilen Telegram bildirimlerinin kaydı. En son 100 kayıt
        gösterilir.
      </p>

      {(logs.error || customers.error || products.error) && (
        <p className="mt-6 text-sm text-red-600">Veriler alınamadı.</p>
      )}

      <form method="get" className="mt-6 flex gap-3">
        <select
          name="customer"
          defaultValue={filtered ? String(customerId) : ""}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          <option value="">Tüm müşteriler</option>
          {customerList.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Filtrele
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="px-4 py-3 font-medium">Zaman</th>
              <th className="px-4 py-3 font-medium">Müşteri</th>
              <th className="px-4 py-3 font-medium">Ürün</th>
              <th className="px-4 py-3 font-medium">Mesaj</th>
              <th className="px-4 py-3 font-medium">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {logs.data?.map((log) => (
              <NotificationRow
                key={log.id}
                notification={log}
                customerName={
                  customerList.find((c) => c.id === log.customer_id)?.name ??
                  "-"
                }
                productName={
                  log.product_id === null
                    ? "(silinmiş ürün)"
                    : (productList.find((p) => p.id === log.product_id)?.name ??
                      "-")
                }
              />
            ))}
            {logs.data?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-zinc-500">
                  Kayıt bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}