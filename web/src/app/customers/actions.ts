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

export async function updateCustomer(
  id: number,
  input: { name: string; telegramChatId: string; isActive: boolean },
): Promise<{ ok: boolean; message?: string }> {
  const name = input.name.trim();
  const chatIdRaw = input.telegramChatId.trim();
  const telegramChatId = chatIdRaw === "" ? null : Number(chatIdRaw);

  if (!name) {
    return { ok: false, message: "Ad boş olamaz." };
  }
  if (telegramChatId !== null && !Number.isInteger(telegramChatId)) {
    return { ok: false, message: "Chat ID sayı olmalı." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("customers")
    .update({
      name,
      is_active: input.isActive,
      telegram_chat_id: telegramChatId,
    })
    .eq("id", id);

  if (error) {
    return {
      ok: false,
      message: "Kaydedilemedi. Bu Telegram hesabı başka bir müşteriye bağlı olabilir.",
    };
  }

  revalidatePath("/customers");
  return { ok: true };
}