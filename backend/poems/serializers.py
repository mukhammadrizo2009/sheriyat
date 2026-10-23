from rest_framework import serializers
from .models import Category, Poem, Comment, Like

class CategorySerializer(serializers.ModelSerializer):
    poems_count = serializers.IntegerField(source='poems.count', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'poems_count']

class CommentSerializer(serializers.ModelSerializer):
    created_at_formatted = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'poem', 'author_name', 'text', 'created_at', 'created_at_formatted', 'is_approved']
        read_only_fields = ['id', 'poem', 'created_at', 'created_at_formatted']

    def get_created_at_formatted(self, obj):
        return obj.created_at.strftime("%d-%b, %Y %H:%M")

class PoemListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)

    class Meta:
        model = Poem
        fields = [
            'id', 'title', 'slug', 'post_type', 'category', 'category_name',
            'excerpt', 'written_date', 'audio', 'cover_image',
            'views_count', 'likes_count', 'comments_count',
            'is_published', 'is_featured', 'created_at'
        ]

class PoemDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False, allow_null=True
    )
    comments = serializers.SerializerMethodField()
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)

    class Meta:
        model = Poem
        fields = [
            'id', 'title', 'slug', 'post_type', 'category', 'category_id',
            'content', 'excerpt', 'written_date', 'audio', 'cover_image',
            'views_count', 'likes_count', 'comments_count', 'comments',
            'is_published', 'is_featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'views_count', 'likes_count', 'created_at', 'updated_at']

    def get_comments(self, obj):
        # Visitor faqat tasdiqlangan izohlarni ko'radi
        approved_comments = obj.comments.filter(is_approved=True)
        return CommentSerializer(approved_comments, many=True).data

class PoemAdminSerializer(serializers.ModelSerializer):
    """Shoir admin paneli uchun to'liq tahrirlash serializatori"""
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Poem
        fields = '__all__'
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
