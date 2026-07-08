#!/usr/bin/env bash
set -o errexit

python manage.py check --deploy --fail-level ERROR
exec gunicorn cyborg_chess.wsgi:application
