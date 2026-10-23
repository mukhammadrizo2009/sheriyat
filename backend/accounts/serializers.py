from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import PoetProfile

class PoetProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PoetProfile
        fields = ['pen_name', 'bio', 'avatar', 'telegram_channel', 'instagram', 'quote']

class PoetUserSerializer(serializers.ModelSerializer):
    profile = PoetProfileSerializer(source='poet_profile', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'profile']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError({"error": "Login yoki parol noto'g'ri kiritildi!"})
        if not user.is_active:
            raise serializers.ValidationError({"error": "Ushbu foydalanuvchi faol emas!"})
        
        attrs['user'] = user
        return attrs
