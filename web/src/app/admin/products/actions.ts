"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: boolean; message?: string };

type ProductInput = {
  name: string;
  url: string;
  categoryId: number;
  sourceId: number;
  checkIntervalMinutes: number;
  isActive: boolean;
};

function validate(input: ProductInput): string | null {
  if (!input.name.trim()) return "Ürün adı boş olamaz.";

  try {
    const url = new URL(input.url.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "Link http:// veya https:// ile başlamalı.";
    }
  } catch {
    return "Geçerli bir ürün linki gir.";
  }

  if (!Number.isInteger(input.categoryId) || input.categoryId <= 0) {
    return "Kategori seç.";
  }
  if (!Number.isInteger(input.sourceId) || input.sourceId <= 0) {
    return "Kaynak seç.";
  }
  if (
    !Number.isInteger(input.checkIntervalMinutes) ||
    input.checkIntervalMinutes < 5
  ) {
    return "Kontrol aralığı en az 5 dakika olmalı.";
  }
  return null;
}

function errorMessage(code: string | undefined, fallback: string): string {
  if (code === "23505") return "Bu link zaten başka bir üründe kayıtlı.";
  if (code === "23503") return "Seçilen kategori ya da kaynak bulunamadı.";
  return fallback;
}

export async function addProduct(input: ProductInput): Promise<Result> {
  const problem = validate(input);
  if (problem) return { ok: false, message: problem };

  const supabase = await createClient();
  const { error } = await supabase.from("products").insert({
    name: input.name.trim(),
    url: input.url.trim(),
    category_id: input.categoryId,
    source_id: input.sourceId,
    check_interval_minutes: input.checkIntervalMinutes,
    is_active: input.isActive,
  });

  if (error) {
    return { ok: false, message: errorMessage(error.code, "Ürün eklenemedi.") };
  }

  revalidatePath("/admin/products");
  return { ok: true };
}

export async function updateProduct(
  id: number,
  input: ProductInput,
): Promise<Result> {
  const problem = validate(input);
  if (problem) return { ok: false, message: problem };

  const supabase = await createClient();
  const newUrl = input.url.trim();

  // Link değiştiyse eski fiyat anlamsızlaşır, sıfırla
  const { data: existing } = await supabase
    .from("products")
    .select("url")
    .eq("id", id)
    .single();
  const urlChanged = existing !== null && existing.url !== newUrl;

  const { error } = await supabase
    .from("products")
    .update({
      name: input.name.trim(),
      url: newUrl,
      category_id: input.categoryId,
      source_id: input.sourceId,
      check_interval_minutes: input.checkIntervalMinutes,
      is_active: input.isActive,
      ...(urlChanged
        ? { current_price: null, last_checked_at: null, last_status: null }
        : {}),
    })
    .eq("id", id);

  if (error) {
    return { ok: false, message: errorMessage(error.code, "Kaydedilemedi.") };
  }

  revalidatePath("/admin/products");
  return { ok: true };
}

export async function deleteProduct(id: number): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { ok: false, message: "Silinemedi." };
  }

  revalidatePath("/admin/products");
  return { ok: true };
}