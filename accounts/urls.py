from django.urls import path
from .views import SignupView, LoginView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/',  LoginView.as_view(), name='login'),
]
#kenzy
from django.urls import path
from . import views

urlpatterns = [
    path('data/',            views.get_data,     name='get_data'),
    path('data/<str:subject>/', views.update_task, name='update_task'),
]

#jana
from .views import TaskView

urlpatterns = [
    path('tasks/', TaskView.as_view()),
]