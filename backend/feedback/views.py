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
