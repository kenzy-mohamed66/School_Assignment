# from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer
import bcrypt


class SignupView(APIView):
    def post(self, request):
        data = request.data.copy()

        # Hash the password before saving
        password = data.get('password', '')
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        data['password'] = hashed.decode('utf-8')

        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User created'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            user = User.objects.get(username=username)

            # Check hashed password
            if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                return Response({
                    'message': 'Login successful!',
                    'user': user.username,
                    'role': user.role
                })
            
            else:
                raise User.DoesNotExist
            
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)