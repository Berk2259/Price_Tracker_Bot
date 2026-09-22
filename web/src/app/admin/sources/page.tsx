import { createClient } from "@/lib/supabase/server";
import { AddSourceForm } from "@/components/add-source-form";
import { SourceRow } from "@/components/source-row";

export default async function SourcesPage() {
  const supabase = await createClient();

  const { data: sources, error } = await supabase
    .from("sources")
    .select("id, name, method, base_url, is_active")
    .order("id");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Kaynaklar
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Fiyatların çekildiği siteler ve servisler, ve hangi yöntemle
        çekildikleri.
      </p>

      {error && (
        <p className="mt-6 text-sm text-red-600">Kaynaklar alınamadı.</p>
      )}

      <AddSourceForm />

      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="px-4 py-3 font-medium">Ad</th>
              <th className="px-4 py-3 font-medium">Yöntem</th>
              <th className="px-4 py-3 font-medium">Adres</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {sources?.map((source) => (
              <SourceRow key={source.id} source={source} />
            ))}
            {sources?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-zinc-500">
                  Henüz kaynak yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}