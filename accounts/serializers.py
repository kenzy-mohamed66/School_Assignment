from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role']

    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters.")
        return value

    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters.")
        return value
    #kenzyyy
    from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Task
        fields = ['subject', 'priority', 'student', 'desc', 'status']



#jana
from .models import Task_admin
class TaskSerializer_admin(serializers.ModelSerializer):
    class Meta:
        model = Task_admin
        fields = '__all__'