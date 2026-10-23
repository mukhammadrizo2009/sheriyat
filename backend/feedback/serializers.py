from rest_framework import serializers
from .models import FeedbackMessage

class FeedbackMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackMessage
        fields = ['id', 'name', 'contact', 'subject', 'message', 'created_at', 'is_read', 'sent_to_telegram', 'telegram_response']
        read_only_fields = ['id', 'created_at', 'sent_to_telegram', 'telegram_response']
