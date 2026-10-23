from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.authtoken.models import Token
from .serializers import LoginSerializer, PoetUserSerializer, PoetProfileSerializer
from .models import PoetProfile

class PoetLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, _ = Token.objects.get_or_create(user=user)
            user_data = PoetUserSerializer(user).data
            return Response({
                'token': token.key,
                'user': user_data,
                'message': f"Xush kelibsiz, {user_data.get('profile', {}).get('pen_name') or user.username}!"
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PoetMeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = PoetUserSerializer(request.user)
        return Response(serializer.data)

class PoetProfileView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get(self, request):
        # Return first poet profile or current user profile
        profile = PoetProfile.objects.first()
        if not profile:
            return Response({'message': 'Shoir profili mavjud emas'}, status=status.HTTP_404_NOT_FOUND)
        serializer = PoetProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile, _ = PoetProfile.objects.get_or_create(user=request.user)
        serializer = PoetProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
