# gym/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('classes/', views.classes, name='classes'),
    path('contact/', views.contact, name='contact'),
    path('membership/', views.membership, name='membership'),
    path('membership/list/', views.membership_list, name='membership_list'),
]