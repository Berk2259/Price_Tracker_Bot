"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { adminPages } from "@/components/admin-nav";

export function AdminTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const title =
    adminPages.find((p) =>
      p.href === "/admin" ? pathname === "/admin" : pathname.startsWith(p.href),
    )?.label ?? "Admin";

  const q = query.trim().toLocaleLowerCase("tr");
  const results = adminPages.filter(
    (p) =>
      p.label.toLocaleLowerCase("tr").includes(q) ||
      p.group.toLocaleLowerCase("tr").includes(q),
  );

  function openPalette() {
    setQuery("");
    setActive(0);
    setOpen(true);
  }

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  // Ctrl+K ile aç, Esc ile kapat.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setQuery("");
        setActive(0);
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      go(results[active].href);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-zinc-800 bg-zinc-900/80 px-8 py-3.5 backdrop-blur">
        <h2 className="text-lg font-bold tracking-[-0.01em] text-zinc-50">
          {title}
        </h2>

        <button
          type="button"
          onClick={openPalette}
          className="ml-auto flex w-[280px] items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-500 transition-colors hover:border-emerald-500"
        >
          <svg
            viewBox="0 0 24 24"
            width={16}
            height={16}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span>Ara…</span>
          <kbd className="ml-auto rounded-md border border-zinc-800 bg-zinc-900 px-1.5 text-[11px]">
            Ctrl K
          </kbd>
        </button>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        >
          <div
            className="ad-pop mx-auto mt-24 w-[520px] max-w-[92%] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKey}
              placeholder="Sayfa ara…"
              className="w-full border-b border-zinc-800 bg-transparent px-[18px] py-4 text-zinc-50 outline-none placeholder:text-zinc-500"
            />
            <div className="max-h-[320px] overflow-y-auto p-1.5">
              {results.map((p, i) => (
                <button
                  key={p.href}
                  type="button"
                  onClick={() => go(p.href)}
                  onMouseEnter={() => setActive(i)}
                  className={
                    "flex w-full items-center rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors " +
                    (i === active
                      ? "bg-emerald-500/15 text-zinc-50"
                      : "text-zinc-300")
                  }
                >
                  {p.label}
                  <span className="ml-auto text-xs font-medium text-zinc-500">
                    {p.group}
                  </span>
                </button>
              ))}
              {results.length === 0 && (
                <p className="px-3.5 py-6 text-center text-sm text-zinc-500">
                  Sonuç bulunamadı.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}