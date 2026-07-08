from django.test import SimpleTestCase
from django.urls import reverse

from . import views


class ApiTests(SimpleTestCase):
    def setUp(self):
        views.IN_MEMORY_RANKINGS.clear()
        views.IN_MEMORY_MATCHES.clear()
        views.IN_MEMORY_USERS.clear()
        views.NEXT_MATCH_ID = 1

    def test_ranking_empty(self):
        response = self.client.get(reverse('ranking'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['results'], [])

    def test_submit_result_updates_rating(self):
        response = self.client.post(
            reverse('submit_result'),
            data='{"name":"Player1","outcome":"win"}',
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(views.IN_MEMORY_RANKINGS['Player1']['rating'], 1216)

    def test_submit_result_updates_both_players_with_elo(self):
        views.IN_MEMORY_RANKINGS['Jugador A'] = {'name': 'Jugador A', 'rating': 1450, 'wins': 0, 'losses': 0, 'draws': 0}
        views.IN_MEMORY_RANKINGS['Jugador B'] = {'name': 'Jugador B', 'rating': 1320, 'wins': 0, 'losses': 0, 'draws': 0}
        response = self.client.post(
            reverse('submit_result'),
            data='{"name":"Jugador A","opponent_name":"Jugador B","opponent_rating":1320,"outcome":"win"}',
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn('opponent', payload)
        self.assertEqual(payload['delta'], 10)
        self.assertEqual(payload['opponent']['delta'], -10)

    def test_create_and_get_online_match(self):
        create = self.client.post(
            reverse('create_online_match'),
            data='{"white_player":"Ana"}',
            content_type='application/json',
        )
        self.assertEqual(create.status_code, 201)
        room = create.json()['room_code']

        get_match = self.client.get(reverse('get_online_match', kwargs={'room_code': room}))
        self.assertEqual(get_match.status_code, 200)
        self.assertEqual(get_match.json()['white_player'], 'Ana')
        self.assertEqual(len(views.IN_MEMORY_MATCHES), 1)
