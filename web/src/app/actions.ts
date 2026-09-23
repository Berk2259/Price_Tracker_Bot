"use server";

import { createClient } from "@/lib/supabase/server";

type Result = { ok: boolean; message?: string };

export async function submitLead(input: {
  name: string;
  contact: string;
  planRequested: string;
  categoryInterest: string;
  note: string;
}): Promise<Result> {
  const name = input.name.trim();
  const contact = input.contact.trim();

  if (!name) return { ok: false, message: "Ad boş olamaz." };
  if (!contact) return { ok: false, message: "İletişim bilgisi boş olamaz." };
  if (input.planRequested !== "free" && input.planRequested !== "premium") {
    return { ok: false, message: "Geçersiz plan." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    name,
    contact,
    plan_requested: input.planRequested,
    category_interest: input.categoryInterest.trim() || null,
    note: input.note.trim() || null,
  });

  if (error) {
    return { ok: false, message: "Gönderilemedi, lütfen tekrar dene." };
  }

  return { ok: true };
}