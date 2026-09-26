from playwright.sync_api import sync_playwright

from adapters.json_ld import PriceResult, parse_price

# Botlara engel koyan siteler (Cloudflare gibi) için gerçek tarayıcıyla okur.
# "HeadlessChrome" yerine normal bir Chrome kimliği kullanılır.
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)


def fetch_price(url: str) -> PriceResult:
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--disable-blink-features=AutomationControlled"],
        )
        try:
            context = browser.new_context(locale="tr-TR", user_agent=USER_AGENT)
            page = context.new_page()
            response = page.goto(url, wait_until="domcontentloaded", timeout=45000)
            page.wait_for_timeout(3000)

            status = response.status if response else 0
            if status >= 400:
                raise RuntimeError(f"Sayfa açılamadı (HTTP {status})")

            html = page.content()
        finally:
            browser.close()

    return parse_price(html)