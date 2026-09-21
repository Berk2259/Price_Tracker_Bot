import { createClient } from "@/lib/supabase/server";
import { PriceRecordRow } from "@/components/price-record-row";

export default async function PriceHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const productId = Number(product);
  const filtered = Number.isInteger(productId) && productId > 0;

  const supabase = await createClient();

  let recordsQuery = supabase
    .from("price_history")
    .select("id, product_id, price, currency, in_stock, checked_at");
  if (filtered) {
    recordsQuery = recordsQuery.eq("product_id", productId);
  }

  const [records, products] = await Promise.all([
    recordsQuery.order("checked_at", { ascending: false }).limit(100),
    supabase.from("products").select("id, name").order("name"),
  ]);

  const productList = products.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Fiyat geçmişi
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Botun her kontrolde kaydettiği fiyatlar. En son 100 kayıt gösterilir.
      </p>

      {(records.error || products.error) && (
        <p className="mt-6 text-sm text-red-600">Veriler alınamadı.</p>
      )}

      <form method="get" className="mt-6 flex gap-3">
        <select
          name="product"
          defaultValue={filtered ? String(productId) : ""}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          <option value="">Tüm ürünler</option>
          {productList.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
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
              <th className="px-4 py-3 font-medium">Ürün</th>
              <th className="px-4 py-3 font-medium">Fiyat</th>
              <th className="px-4 py-3 font-medium">Stok</th>
              <th className="px-4 py-3 font-medium">Zaman</th>
              <th className="px-4 py-3 font-medium">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {records.data?.map((record) => (
              <PriceRecordRow
                key={record.id}
                record={record}
                productName={
                  productList.find((p) => p.id === record.product_id)?.name ??
                  "-"
                }
              />
            ))}
            {records.data?.length === 0 && (
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