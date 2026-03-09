from django.contrib import admin
from django.urls import path

from core.views import (
    ai_move,
    chess_plays,
    create_online_match,
    get_online_match,
    health,
    index,
    join_online_match,
    ranking,
    submit_result,
    update_online_match,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name='index'),
    path('health/', health, name='health'),
    path('api/ai-move/', ai_move, name='ai_move'),
    path('api/ranking/', ranking, name='ranking'),
    path('api/submit-result/', submit_result, name='submit_result'),
    path('api/plays/', chess_plays, name='plays'),
    path('api/match/create/', create_online_match, name='create_online_match'),
    path('api/match/<str:room_code>/join/', join_online_match, name='join_online_match'),
    path('api/match/<str:room_code>/', get_online_match, name='get_online_match'),
    path('api/match/<str:room_code>/update/', update_online_match, name='update_online_match'),
]
