"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-[10px] border border-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/10"
    >
      {copied ? "Kopyalandı ✓" : "Bağlama linkini kopyala"}
    </button>
  );
}