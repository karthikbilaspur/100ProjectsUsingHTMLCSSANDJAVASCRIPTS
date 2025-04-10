# gym/views.py
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Membership, Workout, Nutrition
from .forms import MembershipForm, ProfileForm, WorkoutForm, NutritionForm
from django.contrib.auth.models import User
from .models import Profile
import stripe
from django.core.mail import send_mail
from django.contrib.auth.decorators import login_required
from django.core.cache import cache


stripe.api_key = 'YOUR_STRIPE_API_KEY'


def index(request):
    # Get cached data
    data = cache.get('index_data')
    if data is None:
        # Get data from database
        data = Membership.objects.all()
        # Cache data for 1 hour
        cache.set('index_data', data, 3600)
    return render(request, 'index.html', {'data': data})

def about(request):
    return render(request, 'gym/about.html')

def classes(request):
    return render(request, 'gym/classes.html')

def contact(request):
    if request.method == 'POST':
        # Validate form data
        if not request.POST['name']:
            messages.error(request, 'Please enter your name.')
        elif not request.POST['email']:
            messages.error(request, 'Please enter your email address.')
        else:
            # Send email
            send_mail('Contact Form Submission', 'Hello, world!', 'from@example.com', ['to@example.com'])
            messages.success(request, 'Your message has been sent successfully.')
    return render(request, 'contact.html')

def membership(request):
    if request.method == 'POST':
        form = MembershipForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Membership application submitted successfully!')
            return redirect('membership')
    else:
        form = MembershipForm()
    return render(request, 'gym/membership.html', {'form': form})

def membership_list(request):
    memberships = Membership.objects.all()
    return render(request, 'gym/membership_list.html', {'memberships': memberships})

def payment(request):
    if request.method == 'POST':
        # Create a Stripe payment token
        token = stripe.Token.create(
            card={
                'number': request.POST['card_number'],
                'exp_month': request.POST['exp_month'],
                'exp_year': request.POST['exp_year'],
                'cvc': request.POST['cvc'],
            },
        )
        # Charge the user
        charge = stripe.Charge.create(
            amount=1000,
            currency='usd',
            source=token.id,
            description='Test charge',
        )
        return redirect('payment_success')
    return render(request, 'payment.html')

def send_notification(request):
    # Send email notification
    send_mail('Notification', 'Hello, world!', 'from@example.com', ['to@example.com'])
    return redirect('notification_sent')

@login_required
def profile(request):
    profile = Profile.objects.get(user=request.user)
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            return redirect('profile')
    else:
        form = ProfileForm(instance=profile)
    return render(request, 'profile.html', {'form': form})

@login_required
def profile(request):
    profile = Profile.objects.get(user=request.user)
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            return redirect('profile')
    else:
        form = ProfileForm(instance=profile)
    return render(request, 'profile.html', {'form': form})

@login_required
def workout(request):
    workouts = Workout.objects.filter(user=request.user)
    if request.method == 'POST':
        form = WorkoutForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('workout')
    else:
        form = WorkoutForm()
    return render(request, 'workout.html', {'workouts': workouts, 'form': form})

@login_required
def nutrition(request):
    nutrition = Nutrition.objects.filter(user=request.user)
    if request.method == 'POST':
        form = NutritionForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('nutrition')
    else:
        form = NutritionForm()
    return render(request, 'nutrition.html', {'nutrition': nutrition, 'form': form})
