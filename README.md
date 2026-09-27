# TaskFlow

TaskFlow is a small task tracker. Users register, log in, and manage their
own list of tasks (title, description, status: `todo` / `in_progress` /
`done`). It's a standard 3-tier web app: a React frontend, a FastAPI backend,
and a PostgreSQL database.

## Architecture

```
Browser
  |
React frontend (Vite, served by nginx in Docker)
  |
FastAPI backend (JWT auth, REST API)
  |
PostgreSQL
```

- **`backend/`** — FastAPI app. SQLAlchemy models, JWT-based login, a `/health`
  endpoint, and a `tasks` CRUD API. Each user only sees their own tasks.
- **`frontend/`** — React (no TypeScript, no router library), talking to the
  API with `fetch`. Login/register screens plus a task list.
- **`docker-compose.yml`** — runs all three pieces together for local
  development.

## Running locally with Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend docs (Swagger UI): http://localhost:8000/docs
- Postgres: localhost:5432 (user/password/db: `taskflow`)

Register an account in the UI, then log in and add some tasks.

## Running without Docker

**Backend**

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then start a local Postgres, or point DATABASE_URL at one
uvicorn app.main:app --reload
```

**Frontend**

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## API

| Method | Path             | Description                              |
|--------|------------------|-------------------------------------------|
| POST   | `/auth/register` | Create an account                         |
| POST   | `/auth/login`    | Get a JWT (form fields: username, password) |
| GET    | `/tasks`         | List your tasks                           |
| POST   | `/tasks`         | Create a task                             |
| PATCH  | `/tasks/{id}`    | Update a task                             |
| DELETE | `/tasks/{id}`    | Delete a task                             |
| GET    | `/health`        | Health check                              |

All `/tasks` routes require an `Authorization: Bearer <token>` header, using
the token returned by `/auth/login`. Full interactive docs are at `/docs`
once the backend is running.

## Note: the frontend's API URL is set at build time

The frontend is a static site. Once `npm run build` (or the Docker build)
runs, the value of `VITE_API_URL` is compiled directly into the JS bundle —
it can't be changed afterward by setting an environment variable on a
running container, the way you can with the backend. `frontend/Dockerfile`
takes it as a build argument (`ARG VITE_API_URL`), and
`docker-compose.yml` passes it in under that service's `build.args`. This is
a common source of confusion with any statically-built frontend (React,
Vue, etc.), not specific to this project.

## Suggested next steps

TaskFlow is meant to be a stand-in for "some app a company already has" —
useful as a workload for practicing how to build, deploy, and operate a
web app. Some natural next steps:

1. Push the backend and frontend images to a container registry.
2. Write Kubernetes manifests: a `Deployment` + `Service` for each of
   backend and frontend, a database (self-managed or managed Postgres), a
   `Secret` for `SECRET_KEY` / `DATABASE_URL`, and a `ConfigMap` for
   non-secret config.
3. Add an `HTTPRoute` so the frontend and backend are reachable through one
   host.
4. Add liveness/readiness probes against `/health`.
5. Set up CI to build and push images automatically on every push.
6. Add a GitOps deployment tool (e.g. Argo CD or Flux).
7. Add monitoring (e.g. Prometheus + Grafana) and look at what the metrics
   look like under load.
8. Deliberately break things — kill a pod, use a wrong DB password, delete
   the database's storage — and see what actually happens.
