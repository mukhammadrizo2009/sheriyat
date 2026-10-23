from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from feedback.views import CronJobView
from .views import serve_react_app

urlpatterns = [
    path('django-admin/', admin.site.urls),
    
    # Cron Jobs & Health Checks (Server Keep-Alive)
    path('cron/', CronJobView.as_view(), name='root-cron'),
    path('health/', CronJobView.as_view(), name='root-health'),
    path('api/cron/', CronJobView.as_view(), name='api-cron'),
    path('api/health/', CronJobView.as_view(), name='api-health'),

    # API Endpoints
    path('api/accounts/', include('accounts.urls')),
    path('api/', include('poems.urls')),
    path('api/feedback/', include('feedback.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# React Frontend SPA catch-all (Bosh sahifa va barcha sahifalarni React orqali ochadi)
urlpatterns += [
    re_path(r'^(?P<path>.*)$', serve_react_app, name='react-app'),
]
