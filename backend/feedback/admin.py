from django.contrib import admin
from .models import FeedbackMessage

@admin.register(FeedbackMessage)
class FeedbackMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact', 'subject', 'sent_to_telegram', 'is_read', 'created_at')
    list_filter = ('sent_to_telegram', 'is_read', 'created_at')
    search_fields = ('name', 'contact', 'subject', 'message')
    readonly_fields = ('created_at', 'sent_to_telegram', 'telegram_response')
