from django.db import models

class FeedbackMessage(models.Model):
    name = models.CharField(max_length=150, verbose_name="Yuboruvchi ismi")
    contact = models.CharField(max_length=200, verbose_name="Aloqa (Telefon / Telegram)")
    subject = models.CharField(max_length=250, blank=True, verbose_name="Mavzu")
    message = models.TextField(verbose_name="Xabar matni")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Yuborilgan vaqt")
    is_read = models.BooleanField(default=False, verbose_name="O'qilganmi")
    sent_to_telegram = models.BooleanField(default=False, verbose_name="Telegramga bordimi")
    telegram_response = models.TextField(blank=True, verbose_name="Telegram javobi/xatosi")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Xabar"
        verbose_name_plural = "Shoirga kelgan xabarlar"

    def __str__(self):
        return f"{self.name} - {self.subject or self.message[:30]}"
