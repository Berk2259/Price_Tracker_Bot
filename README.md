# Price Tracker Bot

Admin panelden yönetilen, çok müşterili ve kategorili fiyat takip sistemi.
Fiyat değişimlerinde müşterilere Telegram bildirimi gider.

## Klasör yapısı

```
Price_Tracker_Bot/
├── bot/
│   ├── main.py        Telegram botu (müşteri bağlama)
│   ├── checker.py     Fiyat kontrolcüsü (fiyatı okur ve kaydeder)
│   ├── notifier.py    Fiyat değişiminde Telegram bildirimi
│   ├── adapters/      Fiyat okuyucular (her kaynak türü için bir modül)
│   ├── requirements.txt
│   └── .env           Gizli anahtarlar (GitHub'a gitmez)
├── web/
│   ├── src/app/           Sayfalar (giriş, ana sayfa, müşteriler, kategoriler, kaynaklar, ürünler, takipler)
│   ├── src/lib/supabase/  Supabase bağlantıları (tarayıcı ve sunucu)
│   ├── src/proxy.ts       Giriş koruması
│   ├── src/components/    Ortak bileşenler (yan menü, butonlar)
│   └── .env.local         Panel ayarları (GitHub'a gitmez)
└── supabase/          Veritabanı şema dosyaları (SQL)
```

## Teknolojiler

| Parça | Seçim |
|---|---|
| Veritabanı ve giriş | Supabase |
| Admin panel | Next.js |
| Bot | Python 3.14 |
| Bildirim | Telegram Bot API |


## Sistem nasıl çalışır

```
Admin panel ──► Supabase ◄── Bot ──► Telegram
 (yönetim)     (veritabanı)  (fiyat    (müşteriye
                              çeker)   bildirim)
```

1. Admin, panelden müşteri, kategori ve takip edilecek ürünleri tanımlar.
2. Bot, Supabase'den aktif ürünleri okur ve her ürünün fiyatını kaynağından çeker.
3. Fiyat geçmişe kaydedilir. Fiyat değiştiyse ürünü takip eden müşterilere
   Telegram'dan bildirim gider.

Bir ürünün fiyatı müşteri başına değil, ürün başına **bir kez** çekilir.
Aynı ürünü birden çok müşteri takip etse de kaynağa tek istek gider.

Her ürünün kendi kontrol aralığı vardır (`check_interval_minutes`). Kontrolcü
ne kadar sık çalıştırılırsa çalıştırılsın, yalnızca aralığı dolan ürünlere
bakar.

Kontrol aralığı en az 5 dakikadır. Bir ürünün linki değiştirilirse eski fiyat
sıfırlanır, böylece bot yeni sayfadaki fiyatı eski ürünle kıyaslayıp yanlış
bildirim göndermez.

### Bildirim kuralları

Bir ürünün fiyatı bir önceki kontrole göre değiştiğinde, ürünü takip eden
her müşteri için şu kurallara bakılır:

- **Her değişimde bildir** seçiliyse: her fiyat değişiminde bildirim gider.
- **Hedef fiyat** girilmişse: fiyat hedefin üstündeyken hedefe ya da altına
  inerse bildirim gider. Fiyat hedefin altında kaldığı sürece tekrar
  bildirim gitmez.

Ürünün ilk kez okunduğunda (önceki fiyat yokken) bildirim gitmez. Gönderilen
her bildirim `notification_log` tablosuna kaydedilir.

### Müşteri bağlama

Her müşterinin panelde otomatik üretilen bir bağlama kodu vardır. Panelden
müşteri için bağlama linki kopyalanıp müşteriye gönderilir. Müşteri linke
tıklayıp Start'a bastığında (bot `/start KOD` komutunu alır) bot Telegram
chat ID'sini o müşteriye kaydeder.

### Panel erişimi

Panele yalnızca tek bir admin hesabı girebilir. Giriş Supabase Auth ile
yapılır. Veritabanında her tabloda satır bazlı güvenlik (RLS) açıktır ve
kurallar `is_admin()` fonksiyonuna bağlıdır; bu fonksiyon yalnızca admin
hesabının kimliğini (UID) kabul eder. Başka bir hesap açılsa bile hiçbir veri
görülemez. Bot ise `service_role` ile çalışır ve bu kuralları atlar.


## Kurulum

### Ön koşullar

- Python 3.10 veya üstü
- Git
- Bir Supabase projesi
- BotFather'dan alınmış bir Telegram bot tokenı

### Bot

1. `bot/.env` dosyasını oluştur (GitHub'a gitmez):

```
TELEGRAM_BOT_TOKEN=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Service role anahtarı çok güçlüdür: sadece botta kullanılır, panele ve
GitHub'a asla konmaz.

2. Sanal ortamı kur ve kütüphaneleri yükle:

```powershell
cd bot
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

3. Botu çalıştır:

```powershell
python main.py
```

Fiyatları kontrol etmek için (Telegram botundan bağımsız çalışır):

```powershell
python checker.py
```

Yeni bir terminal açıldığında önce sanal ortam tekrar etkinleştirilir
(`.venv\Scripts\Activate.ps1`).

### Panel

1. `web/.env.local` dosyasını oluştur (GitHub'a gitmez):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
TELEGRAM_BOT_USERNAME=
```
`TELEGRAM_BOT_USERNAME`, müşteri bağlama linkini oluşturmak için botun
kullanıcı adıdır (başında `@` olmadan).

Panelde yalnızca `sb_publishable_` ile başlayan anahtar kullanılır.
Service role anahtarı panele asla konmaz.

2. Paketleri kur ve çalıştır:

```powershell
cd web
npm install
npm run dev
```

Panel `http://localhost:3000` adresinde açılır.

3. Supabase'de Authentication → Users bölümünden admin hesabını oluştur.

## Veritabanı tabloları

| Tablo | Amaç |
|---|---|
| `categories` | Market, E-ticaret, Uçak bileti vb. |
| `customers` | Müşteriler, Telegram chat ID, bağlama kodu |
| `customer_categories` | Müşteri - kategori eşleşmesi |
| `sources` | Fiyat kaynağı ve çekme yöntemi (api, json_ld, http, browser) |
| `products` | Takip edilen ürünler (ürün başına tek kayıt) |
| `subscriptions` | Müşteri - ürün takibi, hedef fiyat |
| `price_history` | Fiyat geçmişi |
| `notification_log` | Gönderilen bildirim kayıtları |

## Fiyat çekme yaklaşımı

Her kaynak için ayrı "adapter" yazılır. Yöntem önceliği:
1. Resmi API
2. Sayfadaki JSON-LD verisi
3. Sitenin iç JSON endpoint'i
4. Playwright (gerçek tarayıcı)
5. Ücretli scraping servisi (son çare)

## Yapılanlar

- [x] Supabase projesi ve veritabanı şeması (8 tablo)
- [x] Telegram botu oluşturuldu
- [x] Müşteri bağlama akışı (`/start KOD` ile chat ID kaydı)
- [x] Bot -> müşteri Telegram bildirimi doğrulandı
- [x] Fiyat okuyucu (JSON-LD): sayfadan fiyat ve stok bilgisi çekiyor
- [x] Kontrolcü: aktif ürünlerin fiyatını okuyup geçmişe kaydediyor
- [x] Fiyat değişiminde Telegram bildirimi (her değişimde ve hedef fiyata düşünce)
- [x] Ürün bazlı kontrol aralığı (sırası gelmeyen ürün atlanıyor)
- [x] Panel iskeleti: admin girişi/çıkışı ve giriş koruması
- [x] Panel: yan menülü düzen ve özet kartlarıyla ana sayfa
- [x] Panel: müşteri yönetimi (ekleme, satır içi düzenleme, silme, Telegram bağlama linki)
- [x] Panel: kategori yönetimi (ekleme, satır içi düzenleme, silme)
- [x] Panel: kaynak yönetimi (ekleme, satır içi düzenleme, silme)
- [x] Panel: ürün yönetimi (ekleme, satır içi düzenleme, silme, kategori ve kaynak seçimi)
- [x] Panel: takip yönetimi (müşteri-ürün eşleştirme, hedef fiyat ve bildirim kuralı)