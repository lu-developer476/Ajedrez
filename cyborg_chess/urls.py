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
    login_user,
    logout_user,
    ranking,
    register_user,
    submit_result,
    submit_user_result,
    update_online_match,
    update_user_profile,
    user_profile,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index, name='index'),
    path('health/', health, name='health'),
    path('api/ai-move/', ai_move, name='ai_move'),
    path('api/ranking/', ranking, name='ranking'),
    path('api/submit-result/', submit_result, name='submit_result'),
    path('api/plays/', chess_plays, name='plays'),
    path('api/auth/register/', register_user, name='register_user'),
    path('api/auth/login/', login_user, name='login_user'),
    path('api/auth/logout/', logout_user, name='logout_user'),
    path('api/auth/profile/', user_profile, name='user_profile'),
    path('api/auth/profile/update/', update_user_profile, name='update_user_profile'),
    path('api/auth/submit-result/', submit_user_result, name='submit_user_result'),
    path('api/match/create/', create_online_match, name='create_online_match'),
    path('api/match/<str:room_code>/join/', join_online_match, name='join_online_match'),
    path('api/match/<str:room_code>/', get_online_match, name='get_online_match'),
    path('api/match/<str:room_code>/update/', update_online_match, name='update_online_match'),
]
