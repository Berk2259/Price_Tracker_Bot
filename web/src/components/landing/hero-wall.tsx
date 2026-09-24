import type { ReactNode } from "react";

const icons: Record<string, ReactNode> = {
  milk: (
    <>
      <path d="M8 2h8" />
      <path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2" />
      <path d="M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0" />
    </>
  ),
  headphones: (
    <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
  ),
  coffee: (
    <>
      <path d="M10 2v2" />
      <path d="M14 2v2" />
      <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
      <path d="M6 2v2" />
    </>
  ),
  shirt: (
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
  ),
  keyboard: (
    <>
      <path d="M10 8h.01" />
      <path d="M12 12h.01" />
      <path d="M14 8h.01" />
      <path d="M16 12h.01" />
      <path d="M18 8h.01" />
      <path d="M6 8h.01" />
      <path d="M7 16h10" />
      <path d="M8 12h.01" />
      <rect width="20" height="16" x="2" y="4" rx="2" />
    </>
  ),
  sparkle: (
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.29 1.29L3 12l5.8 1.9a2 2 0 0 1 1.29 1.29L12 21l1.9-5.8a2 2 0 0 1 1.29-1.29L21 12l-5.8-1.9a2 2 0 0 1-1.29-1.29Z" />
  ),
  soda: (
    <>
      <path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8" />
      <path d="M5 8h14" />
      <path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0" />
      <path d="m12 8 1-6h2" />
    </>
  ),
  footprints: (
    <>
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
      <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
      <path d="M16 17h4" />
      <path d="M4 13h4" />
    </>
  ),
};

const items = [
  { name: "Süt 1 L", old: "32,90", now: "29,50", icon: "milk", bg: "bg-[#0284c7]" },
  { name: "Bluetooth Kulaklık", old: "1.499", now: "1.199", icon: "headphones", bg: "bg-[#475569]" },
  { name: "Siyah Çay 1 Kg", old: "409,95", now: "259,95", icon: "coffee", bg: "bg-[#d97706]" },
  { name: "Mont", old: "2.199", now: "1.649", icon: "shirt", bg: "bg-[#e11d48]" },
  { name: "Klavye", old: "899", now: "749", icon: "keyboard", bg: "bg-[#0891b2]" },
  { name: "Parfüm", old: "1.250", now: "990", icon: "sparkle", bg: "bg-[#ea580c]" },
  { name: "Gazoz 1 L", old: "50,00", now: "39,90", icon: "soda", bg: "bg-[#059669]" },
  { name: "Ayakkabı", old: "1.799", now: "1.399", icon: "footprints", bg: "bg-[#0d9488]" },
];

type Item = (typeof items)[number];

function WallCard({ item }: { item: Item }) {
  return (
    <div className="hv-wc">
      <div className={`ic ${item.bg}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.9}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icons[item.icon]}
        </svg>
      </div>
      <div>
        <b>🔔 {item.name}</b>
        <span>
          <s>{item.old}</s> → <span className="new">{item.now} TL</span>
        </span>
      </div>
    </div>
  );
}

// Kesintisiz akış için liste iki kez yan yana basılır
function WallRow({ list, reverse }: { list: Item[]; reverse?: boolean }) {
  return (
    <div className={reverse ? "hv-row hv-row-rev" : "hv-row"}>
      {list.map((item) => (
        <WallCard key={item.name} item={item} />
      ))}
      {list.map((item) => (
        <WallCard key={`${item.name}-kopya`} item={item} />
      ))}
    </div>
  );
}

export function HeroWall() {
  return (
    <div className="hv-wall" aria-hidden="true">
      <WallRow list={items} />
      <WallRow list={[...items].reverse()} reverse />
    </div>
  );
}