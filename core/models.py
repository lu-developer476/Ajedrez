import random
import string

from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


def default_room_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))


class MatchRecord(models.Model):
    room_code = models.CharField(max_length=16, db_index=True, default=default_room_code)
    white_player = models.CharField(max_length=30, default='White')
    black_player = models.CharField(max_length=30, default='Black')
    mode = models.CharField(max_length=20, default='local')
    result = models.CharField(max_length=20, default='in_progress')
    moves_count = models.PositiveIntegerField(default=0)
    game_state = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.room_code} · {self.white_player} vs {self.black_player} ({self.result})"


class PlayerRating(models.Model):
    name = models.CharField(max_length=30, unique=True)
    rating = models.IntegerField(default=1200)
    wins = models.PositiveIntegerField(default=0)
    losses = models.PositiveIntegerField(default=0)
    draws = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating', '-wins']

    def __str__(self):
        return f"{self.name} ({self.rating})"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar_url = models.URLField(blank=True, default='')

    def __str__(self):
        return f"Perfil de {self.user.username}"


class UserStats(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='stats')
    games_played = models.PositiveIntegerField(default=0)
    wins = models.PositiveIntegerField(default=0)
    losses = models.PositiveIntegerField(default=0)
    draws = models.PositiveIntegerField(default=0)
    rating = models.IntegerField(default=1200)
    best_victory = models.CharField(max_length=120, blank=True, default='Sin registrar')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Stats de {self.user.username} ({self.rating})"


@receiver(post_save, sender=User)
def create_user_profile_and_stats(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
        UserStats.objects.create(user=instance)
