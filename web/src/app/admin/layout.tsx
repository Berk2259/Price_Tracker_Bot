import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // /admin/login sayfası, kendi başına menüsüz görünür
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar email={user.email} />
      <main className="ml-60 min-h-screen px-8 py-8">{children}</main>
    </>
  );
}