"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addCustomer(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const supabase = await createClient();
  await supabase.from("customers").insert({ name });

  revalidatePath("/customers");
}

export async function deleteCustomer(id: number) {
  const supabase = await createClient();
  await supabase.from("customers").delete().eq("id", id);

  revalidatePath("/customers");
}