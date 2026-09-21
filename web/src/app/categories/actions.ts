"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { ok: boolean; message?: string };

export async function addCategory(name: string): Promise<Result> {
  const trimmed = name.trim();
  if (!trimmed) {
    return { ok: false, message: "Kategori adı boş olamaz." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .insert({ name: trimmed });

  if (error) {
    return {
      ok: false,
      message:
        error.code === "23505"
          ? "Bu isimde bir kategori zaten var."
          : "Kategori eklenemedi.",
    };
  }

  revalidatePath("/categories");
  return { ok: true };
}

export async function updateCategory(
  id: number,
  name: string,
): Promise<Result> {
  const trimmed = name.trim();
  if (!trimmed) {
    return { ok: false, message: "Kategori adı boş olamaz." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ name: trimmed })
    .eq("id", id);

  if (error) {
    return {
      ok: false,
      message:
        error.code === "23505"
          ? "Bu isimde bir kategori zaten var."
          : "Kaydedilemedi.",
    };
  }

  revalidatePath("/categories");
  return { ok: true };
}

export async function deleteCategory(id: number): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return {
      ok: false,
      message:
        error.code === "23503"
          ? "Bu kategoriye bağlı ürünler var. Önce ürünleri başka kategoriye taşı ya da sil."
          : "Silinemedi.",
    };
  }

  revalidatePath("/categories");
  return { ok: true };
}