from django.shortcuts import render

# Create your views here.
# backend/views.py
from django.http import JsonResponse

def get_data(request):
    data = {
        "project_name": "Full Stack Django",
        "status": "Connected!"
    }
    return JsonResponse(data)