# Price Tracker Bot

Admin panelden yönetilen, çok müşterili ve kategorili fiyat takip sistemi.
Fiyat değişimlerinde müşterilere Telegram bildirimi gider.

## Klasör yapısı

```
Price_Tracker_Bot/
├── bot/        Python botu (fiyat çekme + Telegram bildirimi)
├── web/        Next.js admin paneli
└── supabase/   Veritabanı şema dosyaları (SQL)
```

## Teknolojiler

| Parça | Seçim |
|---|---|
| Veritabanı ve giriş | Supabase |
| Admin panel | Next.js |
| Bot | Python 3.14 |
| Bildirim | Telegram Bot API |


## Kurulum

### Bot

```powershell
cd bot
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

`bot/main.py` botun ana dosyasıdır. Şimdilik `/start KOD` komutuyla müşteriyi
Telegram hesabına bağlar. Yeni özellikler buraya eklenecektir.

`bot/.env` dosyası gerekir (GitHub'a gitmez):

```
TELEGRAM_BOT_TOKEN=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

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

