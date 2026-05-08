
#kenzy
from django.contrib import admin
from .models import User, Task, Task_admin

admin.site.register(User)
admin.site.register(Task)
admin.site.register(Task_admin)