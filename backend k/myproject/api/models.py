from django.db import models

# Create your models here.
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