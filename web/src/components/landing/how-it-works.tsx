import type { ReactNode } from "react";

function StepCard({
  number,
  title,
  text,
  children,
}: {
  number: number;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div className="relative rounded-[28px] border border-line bg-white px-[26px] pb-8 pt-[26px] shadow-soft">
      <div className="absolute left-4 top-4 z-[3] grid h-7 w-7 place-items-center rounded-[9px] bg-brand text-[13px] font-extrabold text-white">
        {number}
      </div>
      <div
        className="relative mb-5 mt-2 grid h-[158px] place-items-center overflow-hidden rounded-[18px] bg-tint"
        aria-hidden="true"
      >
        {children}
      </div>
      <h3 className="mb-1.5 text-xl font-bold text-ink">{title}</h3>
      <p className="text-[15px] text-muted">{text}</p>
    </div>
  );
}

function FormDemo() {
  return (
    <div className="hiw-form">
      <div className="hiw-row">
        <span className="hiw-field hiw-f1">
          <span className="hiw-ph hiw-ph-a">Adınız</span>
          <span className="hiw-ty hiw-ty-a">Ayşe</span>
        </span>
        <span className="hiw-field hiw-f2">
          <span className="hiw-ph hiw-ph-b">E-posta ya da telefon</span>
          <span className="hiw-ty hiw-ty-b">ayse@mail.com</span>
        </span>
      </div>
      <div className="hiw-row">
        <span className="hiw-field hiw-f3 hiw-select">
          Ücretsiz plan <em>▾</em>
        </span>
        <span className="hiw-field hiw-f4">
          <span className="hiw-ph hiw-ph-c">Kategori (örn. Market)</span>
          <span className="hiw-ty hiw-ty-c">Market</span>
        </span>
      </div>
      <span className="hiw-field hiw-textarea hiw-f5">
        <span className="hiw-ph hiw-ph-d">Ne takip etmek istediğinizi yazın</span>
        <span className="hiw-ty hiw-ty-d">Süt ve çay takibi</span>
      </span>
      <b className="hiw-send">
        <span className="hiw-t1">Talep gönder</span>
        <span className="hiw-t2">✓ Talebiniz alındı</span>
      </b>
      <svg className="hiw-cursor" viewBox="0 0 24 24">
        <path
          d="M4 2l16 9-7 2-3 7z"
          fill="#0d2b29"
          stroke="#fff"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function AccountDemo() {
  return (
    <div className="hiw-stack">
      <svg viewBox="0 0 52 52" width="66" height="66">
        <circle className="hiw-ring" cx="26" cy="26" r="22" />
        <path className="hiw-tick" d="M15 27l8 8 15-17" />
      </svg>
      <div className="hiw-account">
        <div className="hiw-avatar">A</div>
        <div>
          Hesabın hazır
          <small>Sana özel hesap açıldı</small>
        </div>
      </div>
    </div>
  );
}

function NotifyDemo() {
  return (
    <div className="hiw-bubble">
      <span className="hiw-bell">🔔</span> Fiyat düştü <b>−15%</b>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="nasil" className="py-[70px] text-center">
      <h2 className="mb-3 text-[length:clamp(28px,4vw,42px)] font-extrabold tracking-[-0.025em] text-ink">
        3 adımda hazır
      </h2>
      <p className="mx-auto mb-11 max-w-[560px] text-[17px] text-muted">
        Kurulumla uğraşma. Talebini gönder, hesabını biz açalım.
      </p>

      <div className="grid gap-5 lg:grid-cols-3">
        <StepCard
          number={1}
          title="Talebini gönder"
          text="Formu doldur, ne takip etmek istediğini yaz."
        >
          <FormDemo />
        </StepCard>
        <StepCard
          number={2}
          title="Hesabın açılır"
          text="Talebini inceleyip sana özel hesap oluştururuz."
        >
          <AccountDemo />
        </StepCard>
        <StepCard
          number={3}
          title="Telegram'dan haber al"
          text="Fiyat değiştiğinde bot sana mesaj atar."
        >
          <NotifyDemo />
        </StepCard>
      </div>
    </section>
  );
}