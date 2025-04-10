# gym/forms.py
from django import forms
from .models import Membership, Profile, Workout, Nutrition

class MembershipForm(forms.ModelForm):
    class Meta:
        model = Membership
        fields = ('name', 'email', 'phone', 'membership_type')
        
class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('bio', 'location', 'birth_date', 'fitness_goals', 'workout_routine')

class WorkoutForm(forms.ModelForm):
    class Meta:
        model = Workout
        fields = ('workout_type', 'workout_date', 'workout_time', 'workout_duration')

class NutritionForm(forms.ModelForm):
    class Meta:
        model = Nutrition
        fields = ('food_type', 'serving_size', 'calories', 'protein', 'fat', 'carbohydrates')
