from rest_framework import serializers
from .models import User, Task, Task_admin, ContactMessage

# Mariam
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
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Task
        fields = ['subject', 'priority', 'student', 'desc', 'status']



#jana
class TaskSerializer_admin(serializers.ModelSerializer):
    class Meta:
        model = Task_admin
        fields = '__all__'

# Hazem
class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'message', 'sent_at']
        read_only_fields = ['sent_at']