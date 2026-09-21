"use client";

import { useTransition } from "react";
import { deleteCustomer } from "@/app/customers/actions";

export function DeleteCustomerButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const ok = confirm(
      `"${name}" müşterisini silmek istediğine emin misin? Takipleri ve bildirim kayıtları da silinir.`,
    );
    if (ok) {
      startTransition(() => deleteCustomer(id));
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="rounded-lg border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
    >
      {pending ? "Siliniyor..." : "Sil"}
    </button>
  );
}