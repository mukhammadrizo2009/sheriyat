from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import FeedbackMessage
from .serializers import FeedbackMessageSerializer
from .telegram_service import send_telegram_notification

class CreateFeedbackView(generics.CreateAPIView):
    """
    Mehmonlar shoirga xabar yuborishi uchun ochiq endpoint.
    Xabar saqlangach, Telegram bot orqali shoirga jo'natiladi.
    """
    queryset = FeedbackMessage.objects.all()
    serializer_class = FeedbackMessageSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        feedback = serializer.save()
        # Telegram botga yuboramiz
        send_telegram_notification(feedback)

class PoetFeedbackListView(generics.ListAPIView):
    """
    Shoir admin paneli uchun barcha xabarlar ro'yxati.
    """
    queryset = FeedbackMessage.objects.all()
    serializer_class = FeedbackMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

class PoetFeedbackDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Shoir xabarni o'qilgan deb belgilashi yoki o'chirishi uchun.
    """
    queryset = FeedbackMessage.objects.all()
    serializer_class = FeedbackMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

class ResendTelegramView(APIView):
    """
    Agar xabar avval bormagan bo'lsa (masalan shoir botni kechroq /start qilgan bo'lsa),
    qaytadan Telegramga yuborish imkoni.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            feedback = FeedbackMessage.objects.get(pk=pk)
            ok, msg = send_telegram_notification(feedback)
            return Response({'success': ok, 'message': msg})
        except FeedbackMessage.DoesNotExist:
            return Response({'error': 'Xabar topilmadi'}, status=status.HTTP_404_NOT_FOUND)

from django.db import connection
from django.utils import timezone

class CronJobView(APIView):
    """
    Render.com bepul rejimida server uxlab qolmasligi (Keep-Alive)
    hamda Telegramga bormay qolgan xabarlarni qayta tekshirib yuborish uchun Cron API.
    cron-job.org yoki UptimeRobot har 10-14 daqiqada GET yuborishi mumkin.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return self.execute_cron()

    def post(self, request):
        return self.execute_cron()

    def execute_cron(self):
        # 1. Ma'lumotlar bazasi ulanishini tekshirish
        db_status = "connected"
        try:
            connection.ensure_connection()
        except Exception as e:
            db_status = f"error: {str(e)}"

        # 2. Telegramga yetib bormagan xabarlarni avtomatik qayta yuborish
        pending_messages = FeedbackMessage.objects.filter(sent_to_telegram=False)[:5]
        retried_count = 0
        success_count = 0

        for msg_obj in pending_messages:
            retried_count += 1
            ok, _ = send_telegram_notification(msg_obj)
            if ok:
                success_count += 1

        return Response({
            "status": "healthy",
            "server": "alive",
            "timestamp": timezone.now().isoformat(),
            "database": db_status,
            "cron_tasks": {
                "pending_messages_found": retried_count,
                "successfully_resent": success_count,
            },
            "message": "She'riyat serveri faol va uyg'oq holatda saqlandi."
        }, status=status.HTTP_200_OK)
