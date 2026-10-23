from django.urls import path
from .views import (
    CategoryListCreateView, CategoryDetailView,
    PoemListView, PoemDetailView, PoemLikeToggleView, CommentCreateView,
    AdminPoemListCreateView, AdminPoemDetailView,
    AdminCommentListView, AdminCommentDetailView,
    DashboardStatsView
)

urlpatterns = [
    # Kitobxonlar uchun ochiq API
    path('categories/', CategoryListCreateView.as_view(), name='category-list'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    path('poems/', PoemListView.as_view(), name='poem-list'),
    path('poems/<slug:slug>/', PoemDetailView.as_view(), name='poem-detail'),
    path('poems/<slug:slug>/like/', PoemLikeToggleView.as_view(), name='poem-like'),
    path('poems/<slug:slug>/comments/', CommentCreateView.as_view(), name='poem-comment-create'),

    # Shoir Admin Paneli API
    path('admin/dashboard/', DashboardStatsView.as_view(), name='admin-dashboard'),
    path('admin/poems/', AdminPoemListCreateView.as_view(), name='admin-poem-list-create'),
    path('admin/poems/<int:pk>/', AdminPoemDetailView.as_view(), name='admin-poem-detail'),
    path('admin/comments/', AdminCommentListView.as_view(), name='admin-comment-list'),
    path('admin/comments/<int:pk>/', AdminCommentDetailView.as_view(), name='admin-comment-detail'),
]
