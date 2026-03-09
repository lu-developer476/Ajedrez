from django.contrib import admin
from django.urls import path
from core.views import index, health

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name='index'),
    path('health/', health, name='health'),
]
