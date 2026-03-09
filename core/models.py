import random
import string

from django.db import models


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
