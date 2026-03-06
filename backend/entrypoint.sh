#!/bin/sh
set -e
python manage.py migrate --noinput
python manage.py load_hospital_data
exec gunicorn --bind 0.0.0.0:8000 --workers 2 config.wsgi:application
