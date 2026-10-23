from django.urls import path
from .views import (
    CreateFeedbackView, PoetFeedbackListView, PoetFeedbackDetailView, 
    ResendTelegramView, CronJobView
)

urlpatterns = [
    # Cron & Keep-Alive endpoints
    path('cron/', CronJobView.as_view(), name='cron-job'),
    path('health/', CronJobView.as_view(), name='health-check'),

    # Public contact form
    path('send/', CreateFeedbackView.as_view(), name='send-feedback'),

    # Poet Admin panel endpoints
    path('admin/messages/', PoetFeedbackListView.as_view(), name='poet-feedback-list'),
    path('admin/messages/<int:pk>/', PoetFeedbackDetailView.as_view(), name='poet-feedback-detail'),
    path('admin/messages/<int:pk>/resend/', ResendTelegramView.as_view(), name='resend-telegram'),
]
