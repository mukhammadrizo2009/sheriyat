from django.db import models
from django.utils.text import slugify
import uuid

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Kategoriya / Janr nomi")
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True, verbose_name="Tavsif")

    class Meta:
        verbose_name = "Kategoriya"
        verbose_name_plural = "Kategoriyalar"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name) or "janr"
            unique_slug = base_slug
            num = 1
            while Category.objects.filter(slug=unique_slug).exclude(pk=self.pk).exists():
                unique_slug = f"{base_slug}-{num}"
                num += 1
            self.slug = unique_slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Poem(models.Model):
    TYPE_CHOICES = (
        ('poem', "She'r"),
        ('thought', "G'oya / Mushohada"),
    )

    title = models.CharField(max_length=255, verbose_name="Sarlavha")
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    post_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='poem', verbose_name="Turi")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='poems', verbose_name="Janr / Turkum")
    content = models.TextField(verbose_name="She'r yoki G'oya matni")
    excerpt = models.CharField(max_length=300, blank=True, verbose_name="Qisqacha ta'rif / Birinchi band")
    written_date = models.CharField(max_length=100, blank=True, verbose_name="Yozilgan vaqti / Yili (masalan: 2024-yil bahor)")
    
    # Audio va rasm fayllari
    audio = models.FileField(upload_to='audio/', blank=True, null=True, verbose_name="Shoir o'qigan audio (ixtiyoriy)")
    cover_image = models.ImageField(upload_to='covers/', blank=True, null=True, verbose_name="Muqova surati (ixtiyoriy)")
    
    # Statistika va holat
    views_count = models.PositiveIntegerField(default=0, verbose_name="O'qishlar soni")
    likes_count = models.PositiveIntegerField(default=0, verbose_name="Likelar soni")
    is_published = models.BooleanField(default=True, verbose_name="Chop etilganmi")
    is_featured = models.BooleanField(default=False, verbose_name="Bosh sahifada ajratib ko'rsatish")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Qo'shilgan vaqti")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Yangilangan vaqti")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "She'r / G'oya"
        verbose_name_plural = "She'rlar va G'oyalar"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or f"sher-{uuid.uuid4().hex[:6]}"
            unique_slug = base_slug
            num = 1
            while Poem.objects.filter(slug=unique_slug).exclude(pk=self.pk).exists():
                unique_slug = f"{base_slug}-{num}"
                num += 1
            self.slug = unique_slug
        
        # Agar excerpt kiritilmagan bo'lsa, birinchi 2-3 qatordan avtomatik olamiz
        if not self.excerpt and self.content:
            lines = [l.strip() for l in self.content.split('\n') if l.strip()]
            self.excerpt = " / ".join(lines[:2])[:250] if lines else self.content[:150]

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.get_post_type_display()})"

class Comment(models.Model):
    poem = models.ForeignKey(Poem, on_delete=models.CASCADE, related_name='comments', verbose_name="She'r")
    author_name = models.CharField(max_length=120, verbose_name="Kitobxon ismi")
    text = models.TextField(verbose_name="Izoh matni")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Vaqti")
    is_approved = models.BooleanField(default=True, verbose_name="Tasdiqlanganmi")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Izoh"
        verbose_name_plural = "Izohlar"

    def __str__(self):
        return f"{self.author_name} -> {self.poem.title}"

class Like(models.Model):
    poem = models.ForeignKey(Poem, on_delete=models.CASCADE, related_name='likes_history', verbose_name="She'r")
    identifier = models.CharField(max_length=150, verbose_name="Foydalanuvchi belgisi (IP/UUID)")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('poem', 'identifier')
        verbose_name = "Like"
        verbose_name_plural = "Likelar"
