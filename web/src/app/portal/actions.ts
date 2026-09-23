"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: boolean; message?: string };

export async function submitCustomerRequest(input: {
  categoryId: number;
  productIds: number[];
  note: string;
}): Promise<Result> {
  if (!Number.isInteger(input.categoryId) || input.categoryId <= 0) {
    return { ok: false, message: "Kategori seç." };
  }
  if (input.productIds.length === 0) {
    return { ok: false, message: "En az bir ürün seç." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: customer } = await supabase
    .from("customers")
    .select("id")
    .eq("auth_user_id", user?.id ?? "")
    .maybeSingle();

  if (!customer) {
    return { ok: false, message: "Müşteri kaydınız bulunamadı." };
  }

  const { data: request, error: requestError } = await supabase
    .from("customer_requests")
    .insert({
      customer_id: customer.id,
      category_id: input.categoryId,
      note: input.note.trim() || null,
    })
    .select("id")
    .single();

  if (requestError || !request) {
    return { ok: false, message: "Talep gönderilemedi." };
  }

  const { error: productsError } = await supabase
    .from("customer_request_products")
    .insert(
      input.productIds.map((product_id) => ({
        request_id: request.id,
        product_id,
      })),
    );

  if (productsError) {
    return { ok: false, message: "Ürünler kaydedilemedi." };
  }

  revalidatePath("/portal/requests");
  return { ok: true };
}