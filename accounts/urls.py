from django.urls import path
from .views import SignupView, LoginView, TaskView
from . import views

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/',  LoginView.as_view(), name='login'),
    path('data/',            views.get_data,     name='get_data'),
    path('data/<str:subject>/', views.update_task, name='update_task'),
    path('tasks/', TaskView.as_view()),
]