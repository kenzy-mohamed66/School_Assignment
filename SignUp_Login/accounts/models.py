from django.db import models

# Defines a new database table named User
class User(models.Model):

    # Creating columns for the User table
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)


    # Method return string representation of the User object, useful for debugging and admin interface
    def __str__(self):
        return self.username