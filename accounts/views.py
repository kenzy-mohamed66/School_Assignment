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
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from .models import Task
# from .serializers import TaskSerializer

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

        pending_tasks = all_tasks.filter(status__iexact="pending").count()

        overdue_tasks = all_tasks.filter(status__iexact="overdue").count()

        in_progress_tasks = all_tasks.filter(status__iexact="in_progress").count()

        completion_rate = 0
        if total_assignments > 0:
            completion_rate = (completed_tasks / total_assignments) * 100

        return Response({
            "teachers": Task_admin.objects.values("teacher_name").distinct().count(),
            "courses": Task_admin.objects.values("course").distinct().count(),
            "assignments": total_assignments,
            "completed": completed_tasks,
            "pending": pending_tasks,
            "overdue": overdue_tasks,
            "in_progress": in_progress_tasks,
            "completion_rate": round(completion_rate, 1)
        })