"use client";

import { useEffect, useState, useTransition } from "react";
import { AdminIcon } from "@/components/admin-icons";
import { addCustomer, updateCustomer } from "@/app/admin/customers/actions";

export type Option = { id: number; name: string };

export type CustomerItem = {
  id: number;
  name: string;
  plan: string;
  bound: boolean;
  chatId: number | null;
  active: boolean;
  added: string;
  categoryIds: number[];
  subCount: number;
  linkUrl: string | null;
  hasPortal: boolean;
};

const fieldClass =
  "w-full rounded-[11px] border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-50 outline-none transition focus:border-emerald-500 focus:shadow-[0_0_0_4px_rgba(45,212,191,0.13)]";

const labelClass = "mb-1.5 block text-xs font-bold text-zinc-500";

// editing null ise yeni müşteri ekleme, değilse düzenleme.
export function CustomerDrawer({
  editing,
  categories,
  onClose,
}: {
  editing: CustomerItem | null;
  categories: Option[];
  onClose: () => void;
}) {
  const isNew = editing === null;

  const [name, setName] = useState(editing?.name ?? "");
  const [plan, setPlan] = useState(editing?.plan ?? "free");
  const [chatId, setChatId] = useState(editing?.chatId?.toString() ?? "");
  const [isActive, setIsActive] = useState(editing?.active ?? true);
  const [categoryIds, setCategoryIds] = useState<number[]>(
    editing?.categoryIds ?? [],
  );
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // Esc ile kapat.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function toggleCategory(id: number) {
    setCategoryIds((current) =>
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id],
    );
  }

  function save() {
    if (!name.trim()) {
      setMessage("Ad boş olamaz.");
      return;
    }

    startTransition(async () => {
      if (!editing) {
        const formData = new FormData();
        formData.set("name", name);
        await addCustomer(formData);
        onClose();
        return;
      }

      const result = await updateCustomer(editing.id, {
        name,
        plan,
        telegramChatId: chatId,
        isActive,
        categoryIds,
      });
      if (result.ok) {
        onClose();
      } else {
        setMessage(result.message ?? "Kaydedilemedi.");
      }
    });
  }

  return (
    <>
      <div
        className="ad-fade fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <aside className="ad-slide fixed inset-y-0 right-0 z-50 w-[420px] max-w-full overflow-y-auto border-l border-zinc-800 bg-zinc-900 p-6 shadow-[-20px_0_60px_rgba(0,0,0,0.4)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-zinc-50">
              {isNew ? "Yeni müşteri" : "Müşteriyi düzenle"}
            </h3>
            <p className="mt-0.5 text-sm text-zinc-500">
              {isNew
                ? "Önce adını gir. Ekledikten sonra bağlama linkini kartından kopyalarsın."
                : "Değişiklikler kaydedilince hemen geçerli olur."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="grid h-[34px] w-[34px] flex-none place-items-center rounded-[10px] border border-zinc-800 text-zinc-500 transition hover:border-emerald-500 hover:text-emerald-500"
          >
            <AdminIcon name="x" size={16} />
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <div>
            <label className={labelClass}>Müşteri adı</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className={fieldClass}
            />
          </div>

          {!isNew && (
            <>
              <div>
                <label className={labelClass}>Plan</label>
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                  className={fieldClass}
                >
                  <option value="free">Ücretsiz (1 kategori, 3 ürün)</option>
                  <option value="premium">Premium (sınırsız)</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  Telegram chat ID (boş = bağlı değil)
                </label>
                <input
                  value={chatId}
                  onChange={(e) => setChatId(e.target.value)}
                  inputMode="numeric"
                  className={fieldClass}
                />
                <p className="mt-1.5 text-xs text-zinc-500">
                  Normalde müşteri bağlama linkiyle kendisi bağlanır, elle
                  girmen gerekmez.
                </p>
              </div>

              <div>
                <label className={labelClass}>İlgilendiği kategoriler</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => {
                    const on = categoryIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleCategory(c.id)}
                        className={
                          "rounded-full border px-3 py-1.5 text-[13px] font-bold transition " +
                          (on
                            ? "border-emerald-500 bg-emerald-500 text-[#052e2b]"
                            : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-emerald-500 hover:text-zinc-50")
                        }
                      >
                        {c.name}
                      </button>
                    );
                  })}
                  {categories.length === 0 && (
                    <span className="text-xs text-zinc-500">Kategori yok.</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                onClick={() => setIsActive(!isActive)}
                className="flex items-center gap-2.5 text-left text-sm font-semibold text-zinc-50"
              >
                <span
                  className={
                    "relative h-6 w-[42px] flex-none rounded-full transition-colors " +
                    (isActive ? "bg-emerald-500" : "bg-zinc-700")
                  }
                >
                  <span
                    className={
                      "absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all " +
                      (isActive ? "left-[21px]" : "left-[3px]")
                    }
                  />
                </span>
                Müşteri aktif (pasifse bildirim gitmez)
              </button>
            </>
          )}
        </div>

        {message && <p className="mt-4 text-sm text-red-500">{message}</p>}

        <div className="mt-6 flex items-center gap-2.5">
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="rounded-[11px] bg-emerald-500 px-4 py-2.5 text-sm font-bold text-[#052e2b] transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {pending
              ? isNew
                ? "Ekleniyor..."
                : "Kaydediliyor..."
              : isNew
                ? "Müşteriyi ekle"
                : "Kaydet"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="rounded-[11px] border border-zinc-800 px-4 py-2.5 text-sm font-bold text-zinc-50 transition hover:border-emerald-500 disabled:opacity-50"
          >
            İptal
          </button>
        </div>
      </aside>
    </>
  );
}