# gym/admin.py

from django.contrib import admin
from .models import Membership

admin.site.register(Membership)