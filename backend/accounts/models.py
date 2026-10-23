from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class PoetProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='poet_profile')
    pen_name = models.CharField(max_length=150, default="Shoir", verbose_name="Taxallus / Ism")
    bio = models.TextField(blank=True, verbose_name="Shoir haqida qisqacha / Bio")
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, verbose_name="Surat")
    telegram_channel = models.CharField(max_length=200, blank=True, verbose_name="Telegram kanal / profil")
    instagram = models.CharField(max_length=200, blank=True, verbose_name="Instagram profil")
    quote = models.CharField(max_length=300, blank=True, default="Ko'ngil mulkining so'z bilan chizilgan manzarasi...", verbose_name="Bosh shior / Ijodiy iqtibos")

    def __str__(self):
        return f"{self.pen_name} ({self.user.username})"

@receiver(post_save, sender=User)
def create_or_save_poet_profile(sender, instance, created, **kwargs):
    if created:
        PoetProfile.objects.create(user=instance, pen_name=instance.get_full_name() or instance.username)
    else:
        if hasattr(instance, 'poet_profile'):
            instance.poet_profile.save()
