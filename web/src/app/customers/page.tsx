import { createClient } from "@/lib/supabase/server";
import { CopyButton } from "@/components/copy-button";
import { DeleteCustomerButton } from "@/components/delete-customer-button";
import { addCustomer } from "./actions";

export default async function CustomersPage() {
  const supabase = await createClient();
  const botUsername = process.env.TELEGRAM_BOT_USERNAME;

  const { data: customers, error } = await supabase
    .from("customers")
    .select("id, name, telegram_chat_id, link_token, is_active, created_at")
    .order("id");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Müşteriler
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Sisteme kayıtlı tüm müşteriler ve Telegram bağlantı durumları.
      </p>

      {error && (
        <p className="mt-6 text-sm text-red-600">Müşteriler alınamadı.</p>
      )}

      <form action={addCustomer} className="mt-6 flex gap-3">
        <input
          name="name"
          required
          placeholder="Müşteri adı"
          className="w-64 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Müşteri ekle
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800">
            <tr>
              <th className="px-4 py-3 font-medium">Ad</th>
              <th className="px-4 py-3 font-medium">Telegram</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">Eklenme</th>
              <th className="px-4 py-3 font-medium">Bağlama</th>
              <th className="px-4 py-3 font-medium">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {customers?.map((customer) => (
              <tr key={customer.id}>
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                  {customer.name}
                </td>
                <td className="px-4 py-3">
                  {customer.telegram_chat_id ? (
                    <span className="text-emerald-600">Bağlı</span>
                  ) : (
                    <span className="text-zinc-500">Bağlı değil</span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
                  {customer.is_active ? "Aktif" : "Pasif"}
                </td>
                <td className="px-4 py-3 text-zinc-500">
                  {new Date(customer.created_at).toLocaleDateString("tr-TR")}
                </td>
                <td className="px-4 py-3">
                  {!customer.telegram_chat_id && botUsername ? (
                    <CopyButton
                      text={`https://t.me/${botUsername}?start=${customer.link_token}`}
                    />
                  ) : (
                    <span className="text-zinc-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <DeleteCustomerButton id={customer.id} name={customer.name} />
                </td>
              </tr>
            ))}
            {customers?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-zinc-500">
                  Henüz müşteri yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}