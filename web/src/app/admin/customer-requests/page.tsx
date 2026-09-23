import { createClient } from "@/lib/supabase/server";
import { CustomerRequestRow } from "@/components/customer-request-row";

type Row = {
  id: number;
  note: string | null;
  status: string;
  created_at: string;
  customers: { name: string } | { name: string }[] | null;
  categories: { name: string } | { name: string }[] | null;
  customer_request_products: {
    products: { name: string } | { name: string }[] | null;
  }[];
};

function oneName(value: { name: string } | { name: string }[] | null): string {
  if (!value) return "-";
  return Array.isArray(value) ? (value[0]?.name ?? "-") : value.name;
}

export default async function CustomerRequestsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customer_requests")
    .select(
      "id, note, status, created_at, customers(name), categories(name), customer_request_products(products(name))",
    )
    .order("created_at", { ascending: false });

  const requests = (data ?? []) as Row[];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Müşteri talepleri
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Müşterilerin portaldan gönderdiği devam talepleri. Tamamlandı
        işaretlenince seçilen ürünler otomatik takibe eklenir.
      </p>

      {error && (
        <p className="mt-6 text-sm text-red-600">Talepler alınamadı.</p>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="px-4 py-3 font-medium">Müşteri</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Ürünler</th>
              <th className="px-4 py-3 font-medium">Not</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">Zaman</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {requests.map((r) => (
              <CustomerRequestRow
                key={r.id}
                request={{
                  id: r.id,
                  note: r.note,
                  status: r.status,
                  created_at: r.created_at,
                  customerName: oneName(r.customers),
                  categoryName: oneName(r.categories),
                  productNames: r.customer_request_products.map((cp) =>
                    oneName(cp.products),
                  ),
                }}
              />
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-zinc-500">
                  Henüz talep yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}