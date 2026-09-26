import { createClient } from "@/lib/supabase/server";
import { PortalShell } from "@/components/portal-shell";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: customer } = await supabase
    .from("customers")
    .select("id, name, plan, telegram_chat_id, link_token")
    .eq("auth_user_id", user?.id ?? "")
    .maybeSingle();

  if (!customer) {
    return (
      <div className="force-dark grid min-h-screen place-items-center bg-zinc-950 px-4 text-zinc-50">
        <p className="max-w-md text-center text-sm text-red-400">
          Bu hesaba bağlı bir müşteri kaydı bulunamadı. Lütfen yönetici ile
          iletişime geçin.
        </p>
      </div>
    );
  }

  // Menüdeki rozet: henüz sonuçlanmamış taleplerim.
  const pending = await supabase
    .from("customer_requests")
    .select("*", { count: "exact", head: true })
    .eq("customer_id", customer.id)
    .in("status", ["bekliyor", "inceleniyor"]);

  const botUsername = process.env.TELEGRAM_BOT_USERNAME;
  const bound = !!customer.telegram_chat_id;
  const linkUrl =
    !bound && botUsername && customer.link_token
      ? `https://t.me/${botUsername}?start=${customer.link_token}`
      : null;

  return (
    <div className="force-dark">
      <PortalShell
        name={customer.name}
        plan={customer.plan ?? "free"}
        bound={bound}
        linkUrl={linkUrl}
        pending={pending.count ?? 0}
      >
        {children}
      </PortalShell>
    </div>
  );
}