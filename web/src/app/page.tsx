import { LeadForm } from "@/components/lead-form";

const features = [
  {
    title: "Kategorili takip",
    text: "Market, e-ticaret, uçak bileti gibi kategorilere göre ürünlerinizi takip edin.",
  },
  {
    title: "Anında bildirim",
    text: "Fiyat değiştiğinde ya da hedef fiyata düştüğünde Telegram'dan haber alın.",
  },
  {
    title: "Fiyat geçmişi",
    text: "Her ürünün fiyat geçmişini görün, ne zaman ne kadar değiştiğini takip edin.",
  },
];

const plans = [
  {
    name: "Ücretsiz",
    price: "0 ₺",
    items: ["1 kategori", "3 ürün", "Telegram bildirimi"],
  },
  {
    name: "Premium",
    price: "Talep üzerine",
    items: ["Sınırsız kategori", "Sınırsız ürün", "Öncelikli destek"],
  },
];

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <section className="text-center">
        <h1 className="text-3xl font-semibold text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Fiyat Takip Botu
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-600 dark:text-zinc-400">
          Takip etmek istediğiniz ürünleri bize bildirin, fiyat değişimlerinde
          Telegram üzerinden anında haberdar olun.
        </p>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="font-medium text-zinc-900 dark:text-zinc-50">
              {f.title}
            </p>
            <p className="mt-1 text-sm text-zinc-500">{f.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        {plans.map((p) => (
          <div
            key={p.name}
            className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {p.name}
            </p>
            <p className="mt-1 text-2xl font-semibold text-emerald-600">
              {p.price}
            </p>
            <ul className="mt-4 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              {p.items.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Talep gönder
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Formu doldurun, size uygun planla en kısa sürede dönüş yapalım.
        </p>
        <div className="mt-4">
          <LeadForm />
        </div>
      </section>
    </main>
  );
}