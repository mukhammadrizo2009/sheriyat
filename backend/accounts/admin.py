from django.contrib import admin
from .models import PoetProfile

@admin.register(PoetProfile)
class PoetProfileAdmin(admin.ModelAdmin):
    list_display = ('pen_name', 'user', 'telegram_channel', 'instagram')
    search_fields = ('pen_name', 'user__username', 'bio')
