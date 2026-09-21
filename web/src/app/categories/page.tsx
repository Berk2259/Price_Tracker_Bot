import { createClient } from "@/lib/supabase/server";
import { AddCategoryForm } from "@/components/add-category-form";
import { CategoryRow } from "@/components/category-row";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, created_at")
    .order("id");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Kategoriler
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Ürünlerin ve müşterilerin ilgi alanlarını gruplayan kategoriler.
      </p>

      {error && (
        <p className="mt-6 text-sm text-red-600">Kategoriler alınamadı.</p>
      )}

      <AddCategoryForm />

      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="px-4 py-3 font-medium">Ad</th>
              <th className="px-4 py-3 font-medium">Eklenme</th>
              <th className="px-4 py-3 font-medium">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {categories?.map((category) => (
              <CategoryRow key={category.id} category={category} />
            ))}
            {categories?.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-zinc-500">
                  Henüz kategori yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}