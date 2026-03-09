# Cyborg Chess Edition

Reinterpretación del proyecto **2048** a un juego de **Ajedrez local 1v1** hecho con **Python + Django**, conservando:

- panel izquierdo
- footer
- estructura general del proyecto original
- favicon y organización de estáticos

## Cambios principales

- tablero 8x8 con piezas de ajedrez renderizadas en frontend
- paleta neón rosa/naranja
- estética inspirada en una mezcla tribal futurista
- historial de movimientos
- detección de jaque y jaque mate
- promoción automática de peón a reina

## Alcance de esta edición

Implementado:

- movimientos base de todas las piezas
- validación para no dejar al rey propio en jaque
- jaque, jaque mate y tablas por falta de movimientos
- rotación visual del tablero

No implementado en esta versión:

- enroque
- captura al paso
- selector manual de promoción
- multijugador online

## Cómo correrlo localmente

```bash
python -m venv .venv
source .venv/bin/activate  # en Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Configuración para Supabase

Este proyecto queda listo para usar **Supabase Postgres** como base de datos mediante la variable `DATABASE_URL`.

1. Crea un proyecto en Supabase.
2. Copia la cadena de conexión Postgres.
3. Cárgala en `DATABASE_URL` dentro de Render o en tu entorno local.

Ejemplo:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/postgres
```

## Deploy recomendado

- **App Django**: Render
- **Base de datos**: Supabase Postgres

Sí, Supabase sirve perfecto como base de datos. No es el host principal ideal para la app Django completa.
