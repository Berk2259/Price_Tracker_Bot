import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { planLabel } from "@/lib/plan-limits";

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
    .select("name, plan")
    .eq("auth_user_id", user?.id ?? "")
    .maybeSingle();

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-50">
              Fiyat Takip Botu
            </p>
            {customer && (
              <p className="text-xs text-zinc-500">
                {customer.name} · {planLabel(customer.plan)} plan
              </p>
            )}
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">
        {customer ? (
          children
        ) : (
          <p className="text-sm text-red-600">
            Bu hesaba bağlı bir müşteri kaydı bulunamadı. Lütfen yönetici ile
            iletişime geçin.
          </p>
        )}
      </main>
    </div>
  );
}