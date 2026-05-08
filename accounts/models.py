from django.db import models

# Mariam
# Defines a new database table named User
class User(models.Model):

    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('teacher', 'Teacher'),
    ]

    # Creating columns for the User table
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='teacher')

    # Method return string representation of the User object, useful for debugging and admin interface
    def __str__(self):
        return self.username
    

# kenzy
class Task(models.Model):
    PRIORITY_CHOICES = [('High', 'High'), ('Medium', 'Medium'), ('Low', 'Low')]
    STATUS_CHOICES = [('In Progress', 'In Progress'), ('Completed', 'Completed')]

    subject  = models.CharField(max_length=100, unique=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    student  = models.CharField(max_length=100)
    desc     = models.TextField()
    status   = models.CharField(max_length=20, choices=STATUS_CHOICES, default='In Progress')

    def __str__(self):
        return self.subject
    

#jana
class Task_admin(models.Model):
    task_id = models.CharField(max_length=100)
    task_title = models.CharField(max_length=200)
    teacher_name = models.CharField(max_length=100)
    priority = models.CharField(max_length=20)
    due_date = models.DateField()
    description = models.TextField()
    admin_name = models.CharField(max_length=100)
    status = models.CharField(max_length=30)

# Hazem
class ContactMessage(models.Model):
    name    = models.CharField(max_length=100)
    email   = models.EmailField()
    phone   = models.CharField(max_length=11)
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"