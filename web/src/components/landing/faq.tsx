import { FaqChat } from "@/components/landing/faq-chat";

const questions = [
  {
    q: "Ücretsiz plan gerçekten ücretsiz mi?",
    a: "Evet. 1 kategori ve 3 ürüne kadar hiçbir ücret ödemezsin.",
  },
  {
    q: "Hangi sitelerdeki ürünleri takip edebilirim?",
    a: "Talebinde belirttiğin ürünleri inceleriz, uygun olanları takibe alırız.",
  },
  {
    q: "Bildirimleri nereden alacağım?",
    a: "Telegram'dan. Hesabın açılınca sana özel bir bağlantı göndeririz, tek tıkla bağlanırsın.",
  },
];

export function Faq() {
  return (
    <section id="sss" className="py-[70px] text-center">
      <h2 className="mb-3 text-[length:clamp(28px,4vw,42px)] font-extrabold tracking-[-0.025em] text-ink">
        Merak edilenler
      </h2>
      <p className="mx-auto mb-11 max-w-[560px] text-[17px] text-muted">
        Aklına takılan bir şey mi var?
      </p>

      <FaqChat questions={questions} />
    </section>
  );
}