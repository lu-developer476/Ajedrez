#!/usr/bin/env bash
set -o errexit

python manage.py check --deploy --fail-level ERROR

if python - <<'PY'
import os
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cyborg_chess.settings")

import django
from django.db import OperationalError, connection

django.setup()

try:
    connection.ensure_connection()
except OperationalError as exc:
    print(f"Database unavailable; skipping automatic migrations so the web UI can boot. Details: {exc}", file=sys.stderr)
    sys.exit(1)
else:
    connection.close()
PY
then
    python manage.py migrate --no-input
else
    echo "WARNING: Django started without running migrations. Fix DATABASE_URL/Supabase credentials to enable database-backed features." >&2
fi

exec gunicorn cyborg_chess.wsgi:application
