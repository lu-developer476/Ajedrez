#!/usr/bin/env bash
set -o errexit

python manage.py migrate --no-input
exec gunicorn cyborg_chess.wsgi:application
