# Cyborg Chess Edition

Proyecto de ajedrez con Django + frontend vanilla JS.

## Corrección del error 400 en Render

Se ajustó la configuración para aceptar dominios de Render por defecto:

- `DJANGO_ALLOWED_HOSTS` ahora incluye `.onrender.com`
- `CSRF_TRUSTED_ORIGINS` incluye `https://*.onrender.com`

## Nuevas funciones agregadas

- ♟ modo jugador vs IA
- ♟ integración de motor Stockfish (con fallback si no está configurado)
- ♟ ranking online con rating
- ♟ multiplayer en tiempo real por sala (polling)
- ♟ endpoint de jugadas de ajedrez (mates rápidos, aperturas, movimientos especiales y tácticos)
- ♟ promoción manual en el cliente
- ♟ multijugador online
- ♟ persistencia de partidas en DB (`MatchRecord.game_state`)

## Endpoints API

- `POST /api/ai-move/`
- `GET /api/ranking/`
- `POST /api/submit-result/`
- `GET /api/plays/`
- `POST /api/match/create/`
- `POST /api/match/<room_code>/join/`
- `GET /api/match/<room_code>/`
- `POST /api/match/<room_code>/update/`

## Configuración opcional de Stockfish

```env
STOCKFISH_BINARY=/usr/games/stockfish
```

Si no está definido, la IA usa un motor fallback con jugada legal aleatoria.

## Cómo correr

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
