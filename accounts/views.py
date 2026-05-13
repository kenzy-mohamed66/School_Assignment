from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer
import bcrypt

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from .models import Task
from .serializers import TaskSerializer

from .models import Task_admin
from .serializers import TaskSerializer_admin

from .models import ContactMessage
from .serializers import ContactMessageSerializer

# Mariam
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

#kenzy

@api_view(['GET'])
def get_data(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
@csrf_exempt
def update_task(request, subject):
    try:
        task = Task.objects.get(subject=subject)
    except Task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = TaskSerializer(task, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#jana


class TaskView(APIView):

    def get(self, request):
        tasks = Task_admin.objects.all()
        serializer = TaskSerializer_admin(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):

        print("DATA RECEIVED:", request.data)

        serializer = TaskSerializer_admin(data=request.data)

        if serializer.is_valid():

            serializer.save()

            print("SAVED SUCCESSFULLY")

            return Response(serializer.data, status=201)

        print("ERRORS:", serializer.errors)

        return Response(serializer.errors, status=400)
    
class DashboardStats(APIView):
    def get(self, request):
        all_tasks = Task_admin.objects.all()
        total_assignments = all_tasks.count()
        completed_tasks = all_tasks.filter(status__iexact="completed").count()
        
        # Merge "pending" and "in_progress" into one "in_progress" count
        in_progress_tasks = all_tasks.filter(status__in=["pending", "in_progress"]).count()
        
        # Optional: Keep overdue separate or merge as needed
        overdue_tasks = all_tasks.filter(status__iexact="overdue").count()

        completion_rate = 0
        if total_assignments > 0:
            completion_rate = (completed_tasks / total_assignments) * 100

        return Response({
            "teachers": Task_admin.objects.values("teacher_name").distinct().count(),
            "courses": Task_admin.objects.values("course").distinct().count(),
            "assignments": total_assignments,
            "completed": completed_tasks,
            "in_progress": in_progress_tasks, # This now includes the 2 pending items
            "overdue": overdue_tasks,
            "completion_rate": round(completion_rate, 1)
        })

# Adham

@api_view(['PUT', 'DELETE' , 'GET'])

def task_detail(request, pk):
    try:
        task = Task_admin.objects.get(pk=pk)
    except Task_admin.DoesNotExist:
        return Response({'error': 'Task not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        task.delete()
        return Response({'message': 'Task deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
    elif request.method == 'PUT':
        serializer = TaskSerializer_admin(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        serializer = TaskSerializer_admin(task)
        return Response(serializer.data)
    


# Hazem
class ContactView(APIView):
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Message sent successfully'}, status=201)
        return Response(serializer.errors, status=400)

class ProfileView(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            serializer = UserSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

    def patch(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        data = request.data.copy()
        if 'password' in data:
            hashed = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
            data['password'] = hashed.decode('utf-8')

        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Profile updated successfully'})
        return Response(serializer.errors, status=400)
