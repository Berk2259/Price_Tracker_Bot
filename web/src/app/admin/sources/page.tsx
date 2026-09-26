import { createClient } from "@/lib/supabase/server";
import { AddSourceForm } from "@/components/add-source-form";
import { SourceRow } from "@/components/source-row";

export default async function SourcesPage() {
  const supabase = await createClient();

  const [sources, products] = await Promise.all([
    supabase
      .from("sources")
      .select("id, name, method, base_url, is_active")
      .order("id"),
    supabase.from("products").select("source_id"),
  ]);

  const items = (sources.data ?? []).map((s) => ({
    ...s,
    productCount: (products.data ?? []).filter((p) => p.source_id === s.id)
      .length,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-[-0.02em] text-zinc-50">
        Kaynaklar
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Fiyatların çekildiği siteler ve servisler, ve hangi yöntemle
        çekildikleri.
      </p>

      {(sources.error || products.error) && (
        <p className="mt-6 text-sm text-red-600">Veriler alınamadı.</p>
      )}

      <AddSourceForm />

      <div className="mt-6 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((source, i) => (
          <div
            key={source.id}
            className="ad-in"
            style={{ "--i": Math.min(i, 8) } as React.CSSProperties}
          >
            <SourceRow source={source} />
          </div>
        ))}
        {items.length === 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-10 text-center text-zinc-500 sm:col-span-2 xl:col-span-3">
            Henüz kaynak yok.
          </div>
        )}
      </div>
    </div>
  );
}