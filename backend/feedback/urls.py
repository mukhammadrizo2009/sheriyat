from django.urls import path
from .views import CreateFeedbackView, PoetFeedbackListView, PoetFeedbackDetailView, ResendTelegramView

urlpatterns = [
    path('send/', CreateFeedbackView.as_view(), name='send-feedback'),
    path('admin/messages/', PoetFeedbackListView.as_view(), name='poet-feedback-list'),
    path('admin/messages/<int:pk>/', PoetFeedbackDetailView.as_view(), name='poet-feedback-detail'),
    path('admin/messages/<int:pk>/resend/', ResendTelegramView.as_view(), name='resend-telegram'),
]
