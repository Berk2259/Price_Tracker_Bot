"use client";

import { useEffect, useState, useTransition } from "react";
import { AdminIcon } from "@/components/admin-icons";
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from "@/app/admin/products/actions";

export type Option = { id: number; name: string };

export type ProductData = {
  id: number;
  name: string;
  url: string;
  category_id: number;
  source_id: number;
  current_price: number | null;
  currency: string;
  check_interval_minutes: number;
  last_checked_at: string | null;
  last_status: string | null;
  is_active: boolean;
  force_check_requested: boolean;
  comparison_group: string | null;
};

const fieldClass =
  "w-full rounded-[11px] border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-50 outline-none transition focus:border-emerald-500 focus:shadow-[0_0_0_4px_rgba(45,212,191,0.13)]";

const labelClass = "mb-1.5 block text-xs font-bold text-zinc-500";

// product null ise yeni ürün ekleme, değilse düzenleme.
export function ProductDrawer({
  product,
  categories,
  sources,
  groups,
  onClose,
}: {
  product: ProductData | null;
  categories: Option[];
  sources: Option[];
  groups: string[];
  onClose: () => void;
}) {
  const isNew = product === null;

  const [name, setName] = useState(product?.name ?? "");
  const [url, setUrl] = useState(product?.url ?? "");
  const [categoryId, setCategoryId] = useState(
    String(product?.category_id ?? categories[0]?.id ?? ""),
  );
  const [sourceId, setSourceId] = useState(
    String(product?.source_id ?? sources[0]?.id ?? ""),
  );
  const [interval, setInterval] = useState(
    String(product?.check_interval_minutes ?? 60),
  );
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [group, setGroup] = useState(product?.comparison_group ?? "");
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

  function save() {
    const input = {
      name,
      url,
      categoryId: Number(categoryId),
      sourceId: Number(sourceId),
      checkIntervalMinutes: Number(interval),
      isActive,
      comparisonGroup: group,
    };

    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, input)
        : await addProduct(input);
      if (result.ok) {
        onClose();
      } else {
        setMessage(result.message ?? "Kaydedilemedi.");
      }
    });
  }

  function remove() {
    if (!product) return;
    const ok = confirm(
      `"${product.name}" ürününü silmek istediğine emin misin? Takipleri ve fiyat geçmişi de silinir.`,
    );
    if (!ok) return;

    startTransition(async () => {
      const result = await deleteProduct(product.id);
      if (result.ok) {
        onClose();
      } else {
        setMessage(result.message ?? "Silinemedi.");
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
              {isNew ? "Yeni ürün" : "Ürünü düzenle"}
            </h3>
            <p className="mt-0.5 text-sm text-zinc-500">
              {isNew
                ? "Linki yapıştır, kategori ve kaynağı seç."
                : "Kaydedince bot bir sonraki turda yeni bilgiyi kullanır."}
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
            <label className={labelClass}>Ürün adı</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus={isNew}
              placeholder="Örn. Süt 1 L"
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>Ürün linki</label>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className={fieldClass}
            />
            {url.trim() !== "" && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-block text-xs font-bold text-emerald-500 hover:text-emerald-400"
              >
                Ürün sayfasını aç ↗
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={fieldClass}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Kaynak</label>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className={fieldClass}
              >
                {sources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Kontrol aralığı (dakika, en az 5)
            </label>
            <input
              type="number"
              min={5}
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>Karşılaştırma grubu (isteğe bağlı)</label>
            <input
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              list="comparison-groups"
              placeholder="örn. coca-cola-1-5l"
              className={fieldClass}
            />
            <datalist id="comparison-groups">
              {groups.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
              Aynı ürünün farklı satıcılardaki (market, e-ticaret ya da bilet
              sitesi) kayıtlarına aynı grup adını yaz (örn. Migros ve
              CarrefourSA&apos;daki Coca-Cola 1,5 L için{" "}
              <b>coca-cola-1-5l</b>). Premium müşteriler takip ettikleri
              ürünün diğer satıcılardaki fiyatını &quot;Ürün kıyası&quot;nda
              görür.
            </p>
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
                "relative h-6 w-[42px] rounded-full transition-colors " +
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
            Takip aktif
          </button>
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
                ? "Ürünü ekle"
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
          {!isNew && (
            <button
              type="button"
              onClick={remove}
              disabled={pending}
              className="ml-auto text-sm font-bold text-red-400 hover:text-red-300 disabled:opacity-50"
            >
              Sil
            </button>
          )}
        </div>
      </aside>
    </>
  );
}