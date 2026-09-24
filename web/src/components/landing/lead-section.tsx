import { LeadForm } from "@/components/lead-form";

export function LeadSection() {
  return (
    <section id="talep" className="py-[70px] text-center">
      <h2 className="mb-3 text-[length:clamp(28px,4vw,42px)] font-extrabold tracking-[-0.025em] text-ink">
        Hadi başlayalım 🚀
      </h2>
      <p className="mx-auto mb-11 max-w-[560px] text-[17px] text-muted">
        Formu doldur, en kısa sürede dönüş yapalım.
      </p>
      <LeadForm />
    </section>
  );
}