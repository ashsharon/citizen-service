# Citizen Service Request Portal

A full-stack web app that lets citizens submit and track service requests to a local
administration — e.g. reporting road damage, a broken streetlight, a missed waste
collection, or requesting an appointment — and lets staff triage and update their status.

Built as a portfolio project modeled on real municipal digital-services work: the kind of
citizen-facing tooling that public-sector IT providers build and maintain.

## Stack

- **Frontend:** React 18 + TypeScript, React Router, Axios, Vite
- **Backend:** FastAPI (Python), SQLAlchemy ORM, JWT authentication (python-jose + passlib/bcrypt)
- **Database:** SQLite by default (swap `DATABASE_URL` for Postgres in production)
- **Testing:** Pytest (backend, 11 tests covering auth + CRUD + access control) and
  Vitest + React Testing Library (frontend, component tests covering validation and
  submission flow)
- **CI/CD:** GitHub Actions — runs backend tests, frontend type-check and tests on every push/PR
- **Containerization:** Dockerfiles for both services + `docker-compose.yml` to run the full
  stack locally with one command

## Features

- Citizen registration and login (JWT-based auth)
- Submit a new service request with category, description, and optional location
- View your own submitted requests and their status (submitted → in review → in
  progress → resolved/rejected)
- Staff/admin accounts can view all requests and update their status
- Access control enforced server-side: citizens can only see and delete their own
  requests; status changes are admin-only

## Accessibility & security notes

- Forms use proper `<label>`/`for` associations, `aria-required`, `aria-describedby` for
  hints, and `role="alert"` for validation errors so screen readers announce them
- Status badges carry both color and text (`role="status"` with an explicit
  `aria-label`) rather than relying on color alone
- Table markup uses semantic `<th scope="col">` and a `<caption>` for screen-reader
  navigation
- Passwords are hashed with bcrypt, never stored or returned in plaintext
- JWTs expire after 60 minutes; the secret key is read from an environment variable,
  not hardcoded
- Ownership checks happen server-side on every read/update/delete — the API rejects
  cross-user access even if a request ID is guessed

## Running locally

### With Docker (recommended)

```bash
docker-compose up --build
```

Frontend: http://localhost:5173 · Backend docs (Swagger UI): http://localhost:8000/docs

### Without Docker

**Backend**

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

## Running tests

```bash
# Backend
cd backend && pytest -v

# Frontend
cd frontend && npx vitest run
```

## Possible next steps

- Switch to PostgreSQL for production and add Alembic migrations
- Add file/photo upload for request evidence (e.g. a photo of the pothole)
- Add email notifications on status change
- Add a staff-only admin view listing all requests across citizens
