"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: boolean; message?: string };

const STATUSES = ["bekliyor", "inceleniyor", "tamamlandi", "reddedildi"];

export async function updateLeadStatus(
  id: number,
  status: string,
): Promise<Result> {
  if (!STATUSES.includes(status)) {
    return { ok: false, message: "Geçersiz durum." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { ok: false, message: "Kaydedilemedi." };
  }

  revalidatePath("/admin/leads");
  return { ok: true };
}

export async function deleteLead(id: number): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);

  if (error) {
    return { ok: false, message: "Silinemedi." };
  }

  revalidatePath("/admin/leads");
  return { ok: true };
}