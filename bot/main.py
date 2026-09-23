import os
from dotenv import load_dotenv
from supabase import create_client
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes
from postgrest.exceptions import APIError

load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY"),
)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text(
            "Merhaba! Bağlanmak için size gönderilen özel linki kullanın."
        )
        return

    token = context.args[0]
    chat_id = update.effective_chat.id

    result = (
        supabase.table("customers")
        .select("id, name")
        .eq("link_token", token)
        .execute()
    )
    if not result.data:
        await update.message.reply_text("Geçersiz bağlantı kodu.")
        return

    customer = result.data[0]
    try:
        (
            supabase.table("customers")
            .update({"telegram_chat_id": chat_id})
            .eq("id", customer["id"])
            .execute()
        )
    except APIError as e:
        if e.code == "23505":
            await update.message.reply_text(
                "Bu Telegram hesabı zaten başka bir müşteriye bağlı. "
                "Yardım için yöneticinizle iletişime geçin."
            )
        else:
            await update.message.reply_text(
                "Bir hata oluştu, lütfen daha sonra tekrar deneyin."
            )
        return

    await update.message.reply_text(f"Merhaba {customer['name']}, hesabınız bağlandı ✅")


def main():
    app = Application.builder().token(os.getenv("TELEGRAM_BOT_TOKEN")).build()
    app.add_handler(CommandHandler("start", start))
    app.run_polling()


if __name__ == "__main__":
    main()