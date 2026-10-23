from django.urls import path
from .views import PoetLoginView, PoetMeView, PoetProfileView

urlpatterns = [
    path('login/', PoetLoginView.as_view(), name='poet-login'),
    path('me/', PoetMeView.as_view(), name='poet-me'),
    path('profile/', PoetProfileView.as_view(), name='poet-profile'),
]
