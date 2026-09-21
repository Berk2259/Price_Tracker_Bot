"use client";

import { useState, useTransition } from "react";
import { CopyButton } from "@/components/copy-button";
import { DeleteCustomerButton } from "@/components/delete-customer-button";
import { updateCustomer } from "@/app/customers/actions";

type Customer = {
  id: number;
  name: string;
  telegram_chat_id: number | null;
  is_active: boolean;
  created_at: string;
};

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50";

const smallButton =
  "rounded-lg border border-zinc-300 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800";

export function CustomerRow({
  customer,
  linkUrl,
}: {
  customer: Customer;
  linkUrl: string | null;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(customer.name);
  const [chatId, setChatId] = useState(
    customer.telegram_chat_id?.toString() ?? "",
  );
  const [isActive, setIsActive] = useState(customer.is_active);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function startEdit() {
    setName(customer.name);
    setChatId(customer.telegram_chat_id?.toString() ?? "");
    setIsActive(customer.is_active);
    setMessage(null);
    setEditing(true);
  }

  function cancel() {
    setMessage(null);
    setEditing(false);
  }

  function save() {
    startTransition(async () => {
      const result = await updateCustomer(customer.id, {
        name,
        telegramChatId: chatId,
        isActive,
      });
      if (result.ok) {
        setMessage(null);
        setEditing(false);
      } else {
        setMessage(result.message ?? "Kaydedilemedi.");
      }
    });
  }

  const createdAt = new Date(customer.created_at).toLocaleDateString("tr-TR");

  if (editing) {
    return (
      <tr className="bg-zinc-50 dark:bg-zinc-800/40">
        <td className="px-4 py-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </td>
        <td className="px-4 py-3">
          <input
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            inputMode="numeric"
            placeholder="Chat ID (boş = bağlı değil)"
            className={inputClass}
          />
        </td>
        <td className="px-4 py-3">
          <label className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Aktif
          </label>
        </td>
        <td className="px-4 py-3 text-zinc-500">{createdAt}</td>
        <td className="px-4 py-3 text-xs text-red-600">{message}</td>
        <td className="px-4 py-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={pending}
              className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {pending ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button
              type="button"
              onClick={cancel}
              disabled={pending}
              className={smallButton}
            >
              İptal
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
        {customer.name}
      </td>
      <td className="px-4 py-3">
        {customer.telegram_chat_id ? (
          <span className="text-emerald-600">Bağlı</span>
        ) : (
          <span className="text-zinc-500">Bağlı değil</span>
        )}
      </td>
      <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">
        {customer.is_active ? "Aktif" : "Pasif"}
      </td>
      <td className="px-4 py-3 text-zinc-500">{createdAt}</td>
      <td className="px-4 py-3">
        {linkUrl ? (
          <CopyButton text={linkUrl} />
        ) : (
          <span className="text-zinc-400">-</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button type="button" onClick={startEdit} className={smallButton}>
            Düzenle
          </button>
          <DeleteCustomerButton id={customer.id} name={customer.name} />
        </div>
      </td>
    </tr>
  );
}