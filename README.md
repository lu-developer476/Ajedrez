# Ajedrez Zero West Edition

![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.x-092E20?style=for-the-badge&logo=django&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Ne%C3%B3n-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Local-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![WhiteNoise](https://img.shields.io/badge/Static-WhiteNoise-ffffff?style=for-the-badge&logo=django&logoColor=092E20)
![Gunicorn](https://img.shields.io/badge/WSGI-Gunicorn-499848?style=for-the-badge&logo=gunicorn&logoColor=white)
![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

**Ajedrez Zero West Edition** es una aplicación web de ajedrez con estética arcade/cyberpunk, construida con **Django** en el backend y **JavaScript vanilla** en el frontend. El proyecto actualmente está orientado a correr sin servicios externos obligatorios: partidas, salas, usuarios livianos y rankings se mantienen en memoria del proceso, mientras que Django usa sesiones firmadas en cookies y una base **SQLite local** para comandos administrativos y migraciones históricas.

---

## 📌 Estado actual del proyecto

El proyecto se encuentra en una versión funcional de aplicación web monolítica:

- ✅ Interfaz principal renderizada con Django templates.
- ✅ Tablero interactivo con piezas, coordenadas, historial, capturas, timers y paneles de ayuda.
- ✅ Modos de juego local, entrenamiento, jugador vs IA y online por sala.
- ✅ API HTTP para IA, ranking, autenticación liviana, perfil, resultados y partidas online.
- ✅ Deploy preparado para Render con `build.sh`, `start.sh`, WhiteNoise y Gunicorn.
- ✅ Funcionamiento sin PostgreSQL/Supabase obligatorio en runtime.
- ⚠️ Los datos de usuarios, rankings y partidas online son **volátiles**: se guardan en memoria y se pierden al reiniciar el proceso.
- ⚠️ Las migraciones históricas permanecen en el repositorio, pero el runtime no usa modelos de base de datos para la lógica principal.
- ⚠️ `STOCKFISH_BINARY` está contemplado como variable futura/opcional, aunque la implementación actual usa el motor fallback propio.

---

## 🚀 Características principales

### ♟ Jugabilidad

- Modo **Jugador vs Jugador** local.
- Modo **Jugador vs IA** con niveles de dificultad.
- Modo **Entrenamiento** con repertorio de jugadas, tácticas y patrones.
- Modo **Online** por salas con código de invitación.
- Promoción manual de peón desde el cliente.
- Historial de movimientos, capturas, selección, último movimiento y estado de la partida.
- Temporizadores configurables: Bullet, Blitz, Rapid y Classical.
- Personalización visual de tablero, piezas, colores, tipografías, coordenadas y animaciones.

### 🤖 Inteligencia artificial

- Endpoint `/api/ai-move/` para solicitar movimientos de IA.
- Motor fallback propio con generación de jugadas legales, evaluación material/posicional y búsqueda minimax con poda alfa-beta.
- Dificultad configurable del nivel 1 al 5.

### 🌐 Multijugador online

- Creación de sala con código aleatorio.
- Unión a sala existente.
- Consulta y actualización del estado de partida mediante API HTTP.
- Sincronización pensada para polling desde el cliente.
- Estado online guardado en memoria del proceso.

### 👤 Usuarios y ranking

- Registro, login, logout y perfil liviano mediante endpoints JSON.
- Sesión guardada con cookies firmadas de Django.
- Estadísticas por usuario: partidas, victorias, derrotas, tablas, rating y mejor victoria.
- Ranking global en memoria con rating tipo Elo y actualización de resultados.

### 🎨 Frontend

- HTML server-rendered con template Django.
- JavaScript vanilla para la lógica de juego e interacción.
- CSS personalizado con estética neón/arcade.
- Fuentes externas de Google Fonts: Cinzel, Orbitron y Rajdhani.

---

## 🔌 Endpoints API

| Endpoint | Método | Descripción |
|---|---:|---|
| `/health/` | `GET` | Healthcheck básico de la aplicación |
| `/api/ai-move/` | `POST` | Solicita un movimiento de la IA |
| `/api/ranking/` | `GET` | Obtiene el ranking global en memoria |
| `/api/submit-result/` | `POST` | Envía resultado a ranking global |
| `/api/plays/` | `GET` | Recupera aperturas, tácticas, patrones y ayudas |
| `/api/auth/register/` | `POST` | Registra usuario liviano en memoria |
| `/api/auth/login/` | `POST` | Inicia sesión |
| `/api/auth/logout/` | `POST` | Cierra sesión |
| `/api/auth/profile/` | `GET` | Consulta perfil de usuario autenticado |
| `/api/auth/profile/update/` | `POST` | Actualiza avatar o mejor victoria |
| `/api/auth/submit-result/` | `POST` | Actualiza estadísticas del usuario autenticado |
| `/api/match/create/` | `POST` | Crea sala multijugador |
| `/api/match/<room_code>/join/` | `POST` | Se une a una sala |
| `/api/match/<room_code>/` | `GET` | Consulta estado actual de una sala |
| `/api/match/<room_code>/update/` | `POST` | Actualiza estado de una sala |

---

## 🧱 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Backend | Django 5.x |
| Lenguaje backend | Python 3.11+ |
| Frontend | HTML, CSS3 y JavaScript vanilla |
| Templates | Django Templates |
| Estado runtime | Memoria del proceso |
| Sesiones | Cookies firmadas de Django |
| Base local administrativa | SQLite |
| Archivos estáticos | WhiteNoise |
| Servidor WSGI | Gunicorn |
| Deploy | Render |

---

## ⚙️ Variables de entorno

```env
DJANGO_SECRET_KEY=tu_clave_secreta
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=127.0.0.1,localhost,.onrender.com
CSRF_TRUSTED_ORIGINS=http://127.0.0.1:8000,http://localhost:8000,https://*.onrender.com
STOCKFISH_BINARY=/usr/games/stockfish
```

> Nota: `STOCKFISH_BINARY` queda documentada como variable opcional/futura. En el estado actual, si no hay integración efectiva con Stockfish, la IA responde con el motor fallback interno.

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

### 4. Aplicar migraciones locales

```bash
python manage.py migrate
```

### 5. Levantar servidor de desarrollo

```bash
python manage.py runserver
```

La aplicación queda disponible en `http://127.0.0.1:8000/`.

---

## 🚢 Deploy en Render

El repositorio incluye configuración para Render:

- `render.yaml` define el servicio web Python, el build command y el start command.
- `build.sh` instala dependencias y ejecuta `collectstatic`.
- `start.sh` ejecuta `python manage.py check --deploy --fail-level ERROR` y luego levanta Gunicorn.
- WhiteNoise sirve los archivos estáticos generados en `staticfiles`.

Para producción, configurar como mínimo:

```env
DJANGO_SECRET_KEY=<generada por Render o propia>
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=<tu-dominio-render.onrender.com>
CSRF_TRUSTED_ORIGINS=https://<tu-dominio-render.onrender.com>
```

---

## 🧪 Checks útiles

```bash
python manage.py check
python manage.py check --deploy --fail-level ERROR
python manage.py test
python manage.py collectstatic --no-input
```

---

## 📌 Mejoras futuras

- Persistencia real para usuarios, partidas, salas y rankings.
- Integración efectiva con Stockfish/UCI cuando `STOCKFISH_BINARY` esté configurado.
- WebSockets con Django Channels para reemplazar polling.
- Matchmaking por Elo.
- Sistema de espectadores.
- Replay de partidas.
- Puzzles persistentes y entrenamiento progresivo.
- Torneos online.
