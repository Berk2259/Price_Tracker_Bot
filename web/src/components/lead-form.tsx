"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { submitLead } from "@/app/actions";

const icons = {
  check: <path d="M20 6 9 17l-5-5" />,
  send: (
    <>
      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
      <path d="m21.854 2.147-10.94 10.939" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </>
  ),
  crown: (
    <>
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
      <path d="M5 21h14" />
    </>
  ),
};

function Icon({
  name,
  size,
  stroke = 2.2,
}: {
  name: keyof typeof icons;
  size: number;
  stroke?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

const stars = [
  { left: 12, top: 14, size: 14 },
  { left: 80, top: 10, size: 10 },
  { left: 88, top: 40, size: 16 },
  { left: 10, top: 62, size: 11 },
  { left: 70, top: 82, size: 12 },
  { left: 40, top: 90, size: 9 },
  { left: 92, top: 72, size: 10 },
];

const bullets = [
  "Ücretsiz plan ile hemen deneyebilirsin",
  "Talebini inceleyip hesabını biz açarız",
  "Fiyat değişince bildirimi Telegram'dan alırsın",
];

const confettiColors = [
  "#0d9488",
  "#5eead4",
  "#f59e0b",
  "#38bdf8",
  "#f472b6",
  "#a78bfa",
];

type Confetti = { color: string; x: number; y: number; r: number; delay: number };

function makeConfetti(): Confetti[] {
  return Array.from({ length: 26 }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 130;
    return {
      color: confettiColors[i % confettiColors.length],
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 20,
      r: Math.random() * 720 - 360,
      delay: 0.35 + Math.random() * 0.15,
    };
  });
}

function Field({
  id,
  label,
  value,
  onChange,
  required,
  textarea,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <div className="lf-field">
      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          className="lf-input"
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder=" "
          autoComplete="off"
          className="lf-input"
        />
      )}
      <label htmlFor={id} className="lf-label">
        {label}
      </label>
      <span className="lf-ok">
        <Icon name="check" size={12} stroke={3.2} />
      </span>
    </div>
  );
}

export function LeadForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [planRequested, setPlanRequested] = useState<"free" | "premium">("free");
  const [categoryInterest, setCategoryInterest] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [visible, setVisible] = useState(false);
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);

  // Bölüm ekrana girince kart yükselerek gelir.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filled = [name, contact, categoryInterest, note].filter(
    (v) => v.trim() !== "",
  ).length;
  const ready = name.trim() !== "" && contact.trim() !== "";
  const progressLabel =
    filled === 0 ? "Başlayalım" : ready ? "Hazırsın!" : "Devam et…";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await submitLead({
        name,
        contact,
        planRequested,
        categoryInterest,
        note,
      });
      if (result.ok) {
        setConfetti(makeConfetti());
        setSent(true);
        setMessage(null);
      } else {
        setMessage(result.message ?? "Gönderilemedi.");
      }
    });
  }

  return (
    <div ref={rootRef} className={visible ? "lf-in" : ""}>
      <div className="lf-rise mx-auto grid max-w-[960px] overflow-hidden rounded-[34px] border border-line bg-white text-left shadow-[0_30px_70px_rgba(13,43,41,0.22)] md:grid-cols-[0.85fr_1.15fr]">
        {/* Sol: tanıtım paneli */}
        <div className="relative flex flex-col justify-center overflow-hidden bg-[linear-gradient(160deg,#0a3b35,#0d2b29_55%,#041c19)] px-[34px] py-[38px] text-white md:min-h-[440px]">
          {stars.map((s, i) => (
            <span
              key={i}
              className="lf-star"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                fontSize: s.size,
                animationDelay: `${i * 0.4}s`,
              }}
              aria-hidden="true"
            >
              ✦
            </span>
          ))}

          <div className="lf-rocket">
            <b aria-hidden="true">🚀</b>
          </div>
          <h3 className="relative mb-2 mt-[26px] text-[28px] font-bold tracking-[-0.02em]">
            Birkaç dakikada başla
          </h3>
          <p className="relative text-[#a9cdc7]">
            Talebini bırak, gerisini biz hazırlayalım.
          </p>
          <ul className="relative mt-[22px] grid gap-3 text-[15px]">
            {bullets.map((text, i) => (
              <li
                key={text}
                className="lf-li flex items-center gap-[11px]"
                style={{ "--k": i } as React.CSSProperties}
              >
                <span className="grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-brand-light/15 text-brand-light">
                  <Icon name="check" size={12} stroke={3.4} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* Sağ: form ya da başarı ekranı */}
        <div className="bg-white p-6 sm:p-9">
          {sent ? (
            <div className="lf-done relative px-6 py-14 text-center">
              {confetti.map((c, i) => (
                <i
                  key={i}
                  className="lf-cf"
                  style={
                    {
                      background: c.color,
                      "--x": `${c.x}px`,
                      "--y": `${c.y}px`,
                      "--r": `${c.r}deg`,
                      animationDelay: `${c.delay}s`,
                    } as React.CSSProperties
                  }
                />
              ))}
              <div className="lf-bigck mx-auto grid h-[92px] w-[92px] place-items-center rounded-full bg-brand text-white">
                <Icon name="check" size={46} stroke={3} />
              </div>
              <p className="mt-[18px] text-[26px] font-bold tracking-[-0.02em] text-ink">
                Talebiniz alındı ✅
              </p>
              <p className="mt-1.5 text-[15px] text-muted">
                En kısa sürede sizinle iletişime geçeceğiz.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-[22px] flex items-center gap-3 text-[13px] font-bold text-muted">
                <span>Form durumu</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-tint">
                  <div
                    className="lf-bar h-full rounded-full bg-[linear-gradient(90deg,#0d9488,#5eead4)]"
                    style={{ width: `${filled * 25}%` }}
                  />
                </div>
                <b className="min-w-[88px] text-right text-brand-dark">
                  {progressLabel}
                </b>
              </div>

              <form onSubmit={submit} className="grid gap-3.5">
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <Field
                    id="lf-name"
                    label="Adınız"
                    value={name}
                    onChange={setName}
                    required
                  />
                  <Field
                    id="lf-contact"
                    label="E-posta ya da telefon"
                    value={contact}
                    onChange={setContact}
                    required
                  />
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="lf-seg" data-v={planRequested}>
                    <i className="lf-seg-thumb" />
                    <button
                      type="button"
                      aria-pressed={planRequested === "free"}
                      onClick={() => setPlanRequested("free")}
                    >
                      <Icon name="gift" size={16} stroke={2} />
                      Ücretsiz
                    </button>
                    <button
                      type="button"
                      aria-pressed={planRequested === "premium"}
                      onClick={() => setPlanRequested("premium")}
                    >
                      <Icon name="crown" size={16} stroke={2} />
                      Premium
                    </button>
                  </div>
                  <Field
                    id="lf-category"
                    label="Kategori (örn. Market)"
                    value={categoryInterest}
                    onChange={setCategoryInterest}
                  />
                </div>

                <Field
                  id="lf-note"
                  label="Ne takip etmek istediğinizi kısaca yazın (isteğe bağlı)"
                  value={note}
                  onChange={setNote}
                  textarea
                />

                {message && <p className="text-sm text-red-600">{message}</p>}

                <button
                  type="submit"
                  disabled={pending}
                  className={
                    "lf-send flex w-full items-center justify-center gap-2.5 rounded-full bg-brand px-6 py-[15px] text-base font-extrabold text-white shadow-[0_14px_30px_rgba(13,148,136,0.32)] transition hover:-translate-y-[3px] hover:bg-brand-dark disabled:hover:translate-y-0 " +
                    (pending ? "lf-sending" : "")
                  }
                >
                  <span>{pending ? "Gönderiliyor" : "Talep gönder"}</span>
                  <Icon name="send" size={19} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}