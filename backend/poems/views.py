from django.db.models import F, Sum
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Category, Poem, Comment, Like
from .serializers import (
    CategorySerializer, CommentSerializer,
    PoemListSerializer, PoemDetailSerializer, PoemAdminSerializer
)
from feedback.models import FeedbackMessage

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

class PoemListView(generics.ListAPIView):
    """
    Kitobxonlar uchun ochiq she'rlar va g'oyalar ro'yxati.
    """
    serializer_class = PoemListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Poem.objects.filter(is_published=True)
        post_type = self.request.query_params.get('type')
        category_slug = self.request.query_params.get('category')
        search_query = self.request.query_params.get('search')
        is_featured = self.request.query_params.get('featured')

        if post_type:
            qs = qs.filter(post_type=post_type)
        if category_slug:
            qs = qs.filter(category__slug=category_slug)
        if search_query:
            qs = qs.filter(title__icontains=search_query) | qs.filter(content__icontains=search_query)
        if is_featured and is_featured.lower() == 'true':
            qs = qs.filter(is_featured=True)

        return qs.order_by('-created_at')

class PoemDetailView(generics.RetrieveAPIView):
    """
    She'r tafsiloti (slug orqali). Ko'rishlar sonini 1 taga oshiradi.
    """
    queryset = Poem.objects.filter(is_published=True)
    serializer_class = PoemDetailSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # O'qishlar sonini oshiramiz
        Poem.objects.filter(pk=instance.pk).update(views_count=F('views_count') + 1)
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class PoemLikeToggleView(APIView):
    """
    She'rga like bosish yoki olib tashlash.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, slug):
        try:
            poem = Poem.objects.get(slug=slug, is_published=True)
        except Poem.DoesNotExist:
            return Response({'error': "She'r topilmadi"}, status=status.HTTP_404_NOT_FOUND)

        identifier = request.data.get('identifier') or request.META.get('REMOTE_ADDR') or 'anonymous'
        existing_like = Like.objects.filter(poem=poem, identifier=identifier).first()

        if existing_like:
            existing_like.delete()
            poem.likes_count = max(0, poem.likes_count - 1)
            poem.save(update_fields=['likes_count'])
            liked = False
        else:
            Like.objects.create(poem=poem, identifier=identifier)
            poem.likes_count += 1
            poem.save(update_fields=['likes_count'])
            liked = True

        return Response({
            'liked': liked,
            'likes_count': poem.likes_count,
            'message': "Mehr bildirildi ❤️" if liked else "Like olib tashlandi"
        })

class CommentCreateView(generics.CreateAPIView):
    """
    She'rga izoh qoldirish (kitobxonlar uchun).
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        slug = self.kwargs.get('slug')
        poem = Poem.objects.get(slug=slug)
        serializer.save(poem=poem, is_approved=True)

# ----------------- SHOIR ADMIN VIEWLARI -----------------

class AdminPoemListCreateView(generics.ListCreateAPIView):
    """
    Shoir admin paneli uchun barcha she'rlar (qoralama va nashr etilganlar).
    """
    queryset = Poem.objects.all().order_by('-created_at')
    serializer_class = PoemAdminSerializer
    permission_classes = [permissions.IsAuthenticated]

class AdminPoemDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Shoir she'rni tahrirlashi yoki o'chirishi.
    """
    queryset = Poem.objects.all()
    serializer_class = PoemAdminSerializer
    permission_classes = [permissions.IsAuthenticated]

class AdminCommentListView(generics.ListAPIView):
    """
    Admin paneldagi barcha izohlar.
    """
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

class AdminCommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Admin izohni tasdiqlashi yoki o'chirishi.
    """
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

class DashboardStatsView(APIView):
    """
    Shoir admin paneli bosh sahifasidagi professional statistika.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_poems = Poem.objects.filter(post_type='poem').count()
        total_thoughts = Poem.objects.filter(post_type='thought').count()
        total_views = Poem.objects.aggregate(sum=Sum('views_count'))['sum'] or 0
        total_likes = Poem.objects.aggregate(sum=Sum('likes_count'))['sum'] or 0
        total_comments = Comment.objects.count()
        
        total_messages = FeedbackMessage.objects.count()
        unread_messages = FeedbackMessage.objects.filter(is_read=False).count()

        recent_poems = PoemAdminSerializer(Poem.objects.all()[:5], many=True).data
        recent_comments = CommentSerializer(Comment.objects.all()[:5], many=True).data
        recent_messages = FeedbackMessage.objects.all()[:5].values(
            'id', 'name', 'contact', 'subject', 'created_at', 'is_read', 'sent_to_telegram'
        )

        return Response({
            'stats': {
                'total_poems': total_poems,
                'total_thoughts': total_thoughts,
                'total_views': total_views,
                'total_likes': total_likes,
                'total_comments': total_comments,
                'total_messages': total_messages,
                'unread_messages': unread_messages,
            },
            'recent_poems': recent_poems,
            'recent_comments': recent_comments,
            'recent_messages': list(recent_messages),
        })
