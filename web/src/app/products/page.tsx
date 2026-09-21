import { createClient } from "@/lib/supabase/server";
import { AddProductForm } from "@/components/add-product-form";
import { ProductRow } from "@/components/product-row";

export default async function ProductsPage() {
  const supabase = await createClient();

  const [products, categories, sources] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, name, url, category_id, source_id, current_price, currency, check_interval_minutes, last_checked_at, last_status, is_active",
      )
      .order("id"),
    supabase.from("categories").select("id, name").order("name"),
    supabase.from("sources").select("id, name").order("name"),
  ]);

  const categoryList = categories.data ?? [];
  const sourceList = sources.data ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Ürünler
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Fiyatı takip edilen ürünler. Bot bu listeyi okuyup fiyatları kontrol
        eder.
      </p>

      {(products.error || categories.error || sources.error) && (
        <p className="mt-6 text-sm text-red-600">Veriler alınamadı.</p>
      )}

      <AddProductForm categories={categoryList} sources={sourceList} />

      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="px-4 py-3 font-medium">Ürün</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Kaynak</th>
              <th className="px-4 py-3 font-medium">Fiyat</th>
              <th className="px-4 py-3 font-medium">Aralık</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {products.data?.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                categories={categoryList}
                sources={sourceList}
              />
            ))}
            {products.data?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-zinc-500">
                  Henüz ürün yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}