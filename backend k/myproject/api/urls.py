from django.urls import path
from . import views

urlpatterns = [
    path('data/',            views.get_data,     name='get_data'),
    path('data/<str:subject>/', views.update_task, name='update_task'),
]