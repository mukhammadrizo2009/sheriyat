import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

def send_telegram_notification(feedback_obj):
    """
    Shoir bilan bog'lanish formasidan kelgan xabarni Telegram bot orqali shoirga yuboradi.
    """
    bot_token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_ADMIN_CHAT_ID

    if not bot_token or not chat_id:
        logger.warning("Telegram bot_token yoki chat_id sozlanmagan!")
        return False, "Bot token yoki Chat ID topilmadi"

    # HTML formatida chiroyli xabar tayyorlaymiz
    subject_text = f"📌 <b>Mavzu:</b> {feedback_obj.subject}\n" if feedback_obj.subject else ""
    created_time = feedback_obj.created_at.strftime("%d.%m.%Y %H:%M") if feedback_obj.created_at else "Hozir"
    
    text = (
        f"💌 <b>Yangi xabar! (She'riyat platformasidan)</b>\n\n"
        f"👤 <b>Kimdan:</b> {feedback_obj.name}\n"
        f"📞 <b>Aloqa:</b> {feedback_obj.contact}\n"
        f"{subject_text}\n"
        f"💬 <b>Xabar matni:</b>\n<i>{feedback_obj.message}</i>\n\n"
        f"🕒 <b>Vaqt:</b> {created_time}\n"
        f"🌐 <i>She'riyat portali orqali yuborildi</i>"
    )

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }

    try:
        response = requests.post(url, json=payload, timeout=8)
        data = response.json()
        if data.get("ok"):
            feedback_obj.sent_to_telegram = True
            feedback_obj.telegram_response = "Muvaffaqiyatli yetkazildi"
            feedback_obj.save(update_fields=['sent_to_telegram', 'telegram_response'])
            return True, "Yuborildi"
        else:
            error_desc = data.get("description", "Noma'lum xatolik")
            feedback_obj.sent_to_telegram = False
            feedback_obj.telegram_response = f"Xatolik: {error_desc}"
            feedback_obj.save(update_fields=['sent_to_telegram', 'telegram_response'])
            logger.warning(f"Telegram API xatosi: {error_desc}")
            return False, error_desc
    except Exception as e:
        err_msg = str(e)
        feedback_obj.sent_to_telegram = False
        feedback_obj.telegram_response = f"Ulanish xatosi: {err_msg}"
        feedback_obj.save(update_fields=['sent_to_telegram', 'telegram_response'])
        logger.error(f"Telegramga yuborishda ulanish xatosi: {err_msg}")
        return False, err_msg
