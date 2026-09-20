import asyncio
import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from supabase import create_client

from adapters.json_ld import fetch_price
from notifier import send_notifications

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY"),
)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def check_product(product: dict):
    """Fiyat değiştiyse (product, eski, yeni) döndürür, yoksa None."""
    try:
        result = fetch_price(product["url"])
    except Exception as e:
        (
            supabase.table("products")
            .update({"last_checked_at": now_iso(), "last_status": f"hata: {e}"[:200]})
            .eq("id", product["id"])
            .execute()
        )
        print(f"[HATA] {product['name']}: {e}")
        return None

    supabase.table("price_history").insert(
        {
            "product_id": product["id"],
            "price": result.price,
            "currency": result.currency,
            "in_stock": result.in_stock,
        }
    ).execute()

    (
        supabase.table("products")
        .update(
            {
                "current_price": result.price,
                "currency": result.currency,
                "last_checked_at": now_iso(),
                "last_status": "ok",
            }
        )
        .eq("id", product["id"])
        .execute()
    )

    print(f"[OK] {product['name']}: {product['current_price']} -> {result.price} {result.currency}")

    old_price = product["current_price"]
    # İlk okumada (eski fiyat yok) ya da fiyat aynıysa bildirim yok
    if old_price is None or float(old_price) == result.price:
        return None
    return (product, float(old_price), result.price)


def main() -> None:
    products = (
        supabase.table("products")
        .select("id, name, url, current_price")
        .eq("is_active", True)
        .execute()
        .data
    )
    print(f"{len(products)} aktif ürün kontrol edilecek")

    changes = []
    for product in products:
        change = check_product(product)
        if change:
            changes.append(change)

    if changes:
        print(f"{len(changes)} üründe fiyat değişti, bildirimler işleniyor")
        asyncio.run(send_notifications(changes))


if __name__ == "__main__":
    main()