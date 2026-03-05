# Hospital System

Django + DRF backend, React (Vite) frontend, PostgreSQL on Supabase. Backend runs in Docker (e.g. Render); frontend on Netlify.

## Layout

- `backend/` — Django app (config, hospital app with Department, Doctor, Patient, Appointment). Copy `.env.example` to `.env` and set `DATABASE_URL`, `DJANGO_SECRET_KEY`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`.
- `frontend/` — React + Vite. Set `VITE_API_URL` to your backend URL when building for production.

## Backend

```bash
cd backend
docker build -t hospital-backend .
docker run --env-file .env -p 8000:8000 hospital-backend
```

First time with a new DB:

```bash
docker run --env-file .env hospital-backend python manage.py migrate
```

## Frontend

```bash
cd frontend
npm install
npm run build
```

On Netlify: base directory `frontend`, build command `npm run build`, publish `dist`. Add env var `VITE_API_URL` = your backend URL (no trailing slash).

## Seed data (optional)

Django admin at `/admin/`, or in shell:

```python
from hospital.models import Department
Department.objects.get_or_create(code='ER', defaults={'name': 'Emergency', 'description': 'Emergency room'})
```
