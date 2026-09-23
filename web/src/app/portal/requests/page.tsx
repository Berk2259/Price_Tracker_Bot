import { createClient } from "@/lib/supabase/server";
import { CustomerRequestForm } from "@/components/customer-request-form";

type RequestRow = {
  id: number;
  note: string | null;
  status: string;
  created_at: string;
  categories: { name: string } | { name: string }[] | null;
  customer_request_products: { products: { name: string } | { name: string }[] | null }[];
};

const STATUS_LABEL: Record<string, string> = {
  bekliyor: "Bekliyor",
  inceleniyor: "İnceleniyor",
  tamamlandi: "Tamamlandı",
  reddedildi: "Reddedildi",
};

const STATUS_COLOR: Record<string, string> = {
  bekliyor: "text-zinc-500",
  inceleniyor: "text-amber-600",
  tamamlandi: "text-emerald-600",
  reddedildi: "text-red-600",
};

function oneName(value: { name: string } | { name: string }[] | null): string {
  if (!value) return "-";
  return Array.isArray(value) ? (value[0]?.name ?? "-") : value.name;
}

export default async function CustomerRequestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("auth_user_id", user?.id ?? "")
    .maybeSingle();

  const [categories, products, requests] = await Promise.all([
    supabase.from("categories").select("id, name").order("name"),
    supabase.from("products").select("id, name, category_id").eq("is_active", true),
    customer
      ? supabase
          .from("customer_requests")
          .select(
            "id, note, status, created_at, categories(name), customer_request_products(products(name))",
          )
          .eq("customer_id", customer.id)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] as RequestRow[] }),
  ]);

  const requestList = (requests.data ?? []) as RequestRow[];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Yeni talep gönder
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Takip etmek istediğiniz kategori ve ürünleri seçin, size dönüş
          yapalım.
        </p>
        <div className="mt-4">
          <CustomerRequestForm
            categories={categories.data ?? []}
            products={products.data ?? []}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Taleplerim
        </h2>
        <div className="mt-4 space-y-3">
          {requestList.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {oneName(r.categories)}
                </p>
                <span className={`text-xs ${STATUS_COLOR[r.status] ?? ""}`}>
                  {STATUS_LABEL[r.status] ?? r.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-500">
                {r.customer_request_products
                  .map((cp) => oneName(cp.products))
                  .join(", ")}
              </p>
              {r.note && (
                <p className="mt-1 text-xs text-zinc-500">Not: {r.note}</p>
              )}
              <p className="mt-1 text-xs text-zinc-400">
                {new Date(r.created_at).toLocaleDateString("tr-TR")}
              </p>
            </div>
          ))}
          {requestList.length === 0 && (
            <p className="text-sm text-zinc-500">Henüz talep göndermediniz.</p>
          )}
        </div>
      </div>
    </div>
  );
}