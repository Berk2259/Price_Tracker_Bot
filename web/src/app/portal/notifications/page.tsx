import { createClient } from "@/lib/supabase/server";
import { clockTime, dayLabel } from "@/lib/time";
import { PortalNotificationsList } from "@/components/portal-notifications-list";

export default async function PortalNotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("auth_user_id", user?.id ?? "")
    .maybeSingle();

  if (!customer) return null;

  const { data, error } = await supabase
    .from("notification_log")
    .select("id, message, sent_at, products(name)")
    .eq("customer_id", customer.id)
    .order("sent_at", { ascending: false })
    .limit(100);

  const items = (data ?? []).map((n) => {
    const product = Array.isArray(n.products) ? n.products[0] : n.products;
    const lines = String(n.message).split("\n");
    return {
      id: n.id,
      product: product?.name ?? lines[1] ?? "Bildirim",
      message: String(n.message),
      day: dayLabel(n.sent_at),
      time: clockTime(n.sent_at),
    };
  });

  return (
    <div>
      <div className="ad-in">
        <h1 className="text-[26px] font-bold tracking-[-0.02em]">
          Bildirimlerim
        </h1>
        <p className="mt-1 text-zinc-500">
          Telegram&apos;dan aldığın fiyat bildirimlerinin kaydı. En son 100
          bildirim gösterilir.
        </p>
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-500">Bildirimler alınamadı.</p>
      )}

      <PortalNotificationsList items={items} />
    </div>
  );
}