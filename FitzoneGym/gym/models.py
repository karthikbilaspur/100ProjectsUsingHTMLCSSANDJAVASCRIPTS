# gym/models.py

from django.db import models
from django.contrib.auth.models import User


class Membership(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    membership_type = models.CharField(max_length=50)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=30, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    fitness_goals = models.TextField(blank=True)
    workout_routine = models.TextField(blank=True)

    def __str__(self):
        return self.user.username

class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    workout_type = models.CharField(max_length=30)
    workout_date = models.DateField()
    workout_time = models.TimeField()
    workout_duration = models.IntegerField()

    def __str__(self):
        return self.workout_type

class Nutrition(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    food_type = models.CharField(max_length=30)
    serving_size = models.IntegerField()
    calories = models.IntegerField()
    protein = models.IntegerField()
    fat = models.IntegerField()
    carbohydrates = models.IntegerField()

    def __str__(self):
        return self.food_type
