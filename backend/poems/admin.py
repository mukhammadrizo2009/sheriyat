from django.contrib import admin
from .models import Category, Poem, Comment, Like

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Poem)
class PoemAdmin(admin.ModelAdmin):
    list_display = ('title', 'post_type', 'category', 'views_count', 'likes_count', 'is_published', 'is_featured', 'created_at')
    list_filter = ('post_type', 'category', 'is_published', 'is_featured', 'created_at')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'poem', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'created_at')
    search_fields = ('author_name', 'text', 'poem__title')

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('poem', 'identifier', 'created_at')
