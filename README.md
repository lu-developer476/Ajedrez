# Ajedrez Zero West Edition

![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.2-092E20?style=for-the-badge&logo=django&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=for-the-badge&logo=postgresql&logoColor=white)
![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)
![Stockfish](https://img.shields.io/badge/IA-Stockfish-111111?style=for-the-badge)

Proyecto de ajedrez desarrollado con **Django + JavaScript vanilla**, pensado para ofrecer partidas locales, enfrentamientos contra IA, multijugador online por salas y persistencia de partidas en base de datos.

Combina una interfaz ligera con una base backend sólida para soportar lógica de juego, ranking y despliegue en producción con **Render + Supabase**.

---

## 🚀 Características principales

### ♟ Jugabilidad

- Modo **Jugador vs Jugador**
- Modo **Jugador vs IA**
- **Multijugador online** por salas
- **Promoción manual** de peón en el cliente
- Soporte para jugadas especiales y tácticas
- Persistencia del estado de la partida

### 🤖 Inteligencia artificial

- Integración con **Stockfish**
- Motor de respaldo si Stockfish no está configurado
- Endpoint backend para calcular movimientos de IA

### 🌐 Multiplayer online

- Creación y unión a salas
- Sincronización de partidas por **polling**
- Actualización del estado de la partida en tiempo real

### 🏆 Ranking

- Ranking online con rating
- Actualización de resultados
- Persistencia de estadísticas

### 💾 Persistencia

- Guardado de partidas en base de datos
- Estado serializado en:

```python
MatchRecord.game_state
```

---

## 🔧 Corrección aplicada para Render

Se ajustó la configuración para evitar el clásico **Error 400 Bad Request** en producción:

- `DJANGO_ALLOWED_HOSTS` incluye `.onrender.com`
- `CSRF_TRUSTED_ORIGINS` incluye `https://*.onrender.com`

Además, la conexión a **Supabase Session Pooler** requiere:

```env
?sslmode=require
```

Sin ese parámetro, la conexión puede fallar aunque la URL parezca correcta. Sí, bastante traicionero.

---

## 🧠 Funciones agregadas

- ♟ modo jugador vs IA
- ♟ integración de motor **Stockfish** con fallback si no está configurado
- ♟ ranking online con rating
- ♟ multiplayer en tiempo real por sala mediante polling
- ♟ endpoint de jugadas de ajedrez (mates rápidos, aperturas, movimientos especiales y tácticos)
- ♟ promoción manual en el cliente
- ♟ persistencia de partidas en DB (`MatchRecord.game_state`)

---

## 🔌 Endpoints API

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/ai-move/` | `POST` | Solicita un movimiento de la IA |
| `/api/ranking/` | `GET` | Obtiene el ranking global |
| `/api/submit-result/` | `POST` | Envía el resultado de una partida |
| `/api/plays/` | `GET` | Recupera jugadas, tácticas y aperturas |
| `/api/match/create/` | `POST` | Crea una sala multijugador |
| `/api/match/<room_code>/join/` | `POST` | Se une a una sala |
| `/api/match/<room_code>/` | `GET` | Consulta el estado actual de la partida |
| `/api/match/<room_code>/update/` | `POST` | Actualiza el estado de la partida |

---

## ⚙ Configuración opcional de Stockfish

Si Stockfish está disponible en el sistema:

```env
STOCKFISH_BINARY=/usr/games/stockfish
```

Si no está definido, la IA utiliza un motor fallback con una jugada legal aleatoria.

---

## 🛠 Cómo correr el proyecto en local

### 1. Crear entorno virtual

```bash
python -m venv .venv
```

### 2. Activar entorno virtual

**Linux / macOS**

```bash
source .venv/bin/activate
```

**Windows**

```bash
.venv\Scripts\activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Aplicar migraciones

```bash
python manage.py migrate
```

### 5. Levantar servidor de desarrollo

```bash
python manage.py runserver
```

---

## 🧱 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Django |
| Lenguaje principal | Python |
| Frontend | JavaScript Vanilla |
| Base de datos | PostgreSQL (Supabase) |
| Deploy | Render |
| Motor de ajedrez | Stockfish |

---

## 📦 Variables de entorno principales

```env
DJANGO_SECRET_KEY=tu_clave_secreta
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=.onrender.com
CSRF_TRUSTED_ORIGINS=https://*.onrender.com
DATABASE_URL=postgresql://usuario:password@host:5432/postgres?sslmode=require
STOCKFISH_BINARY=/usr/games/stockfish
```

---

## 📌 Mejoras futuras

- WebSockets con Django Channels
- Sistema de espectador
- Replay de partidas
- Matchmaking por ELO
- Puzzles y entrenamiento
- Torneos online

---
