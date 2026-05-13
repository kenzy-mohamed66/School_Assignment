from django.urls import path
from .views import DashboardStats, SignupView, LoginView, TaskView
from . import views
from .views import ContactView, ProfileView

urlpatterns = [
    # Mariam
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/',  LoginView.as_view(), name='login'),

    # kenzy
    path('data/',            views.get_data,     name='get_data'),
    path('data/<str:subject>/', views.update_task, name='update_task'),
    path('tasks/', TaskView.as_view(),name='tasks'),
    path("dashboard-stats/", DashboardStats.as_view()),
    #Adham
    path('tasks/<int:pk>/', views.task_detail, name='task_detail'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('profile/<str:username>/', ProfileView.as_view(), name='profile'),
]
