from django.db import models


class MatchRecord(models.Model):
    white_player = models.CharField(max_length=30, default='White')
    black_player = models.CharField(max_length=30, default='Black')
    result = models.CharField(max_length=20, default='in_progress')
    moves_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.white_player} vs {self.black_player} ({self.result})"
