# Task API

A REST API built with **Node.js** and **Express.js** that implements full CRUD (Create, Read, Update and Delete) operations for tasks, backed by **PostgreSQL** running in **Docker**.

This started as an in-memory CRUD API (`task-1-CRUD`) and was upgraded here to use a real Postgres database via a repository pattern — the routes and endpoints are unchanged; only the storage layer underneath was swapped.

---

## Features

- Create tasks
- Read all tasks
- Read a single task
- Update tasks
- Delete tasks
- Swagger UI documentation
- Persistent storage in PostgreSQL (Docker volume — survives container restarts)

---

## Technologies

- Node.js
- Express.js
- PostgreSQL 16
- `pg` (node-postgres)
- Docker & Docker Compose
- Swagger UI Express
- OpenAPI 3.0

---

## Architecture

Routes call into a **repository** (`tasksRepository.js`), which is the only layer that talks to the database via a connection pool (`db.js`). The route handlers themselves never changed when the storage moved from an in-memory array to Postgres — they just call `tasksRepository.getAll()`, `.create()`, etc. instead of touching an array directly.

---

## Running with Docker (recommended)

This starts both the app and the Postgres database together.

1. Copy `.env.example` to `.env` and fill in real values (not committed — see `.gitignore`).

2. Build and start everything:

```bash
docker compose up
```

This builds the app image from the `Dockerfile`, starts a Postgres container (`db`) with a persistent volume, and starts the Express app (`app`), connected to `db` over Docker's internal network.

3. The API will be available at:

http://localhost:3000

4. First time only — create and seed the `tasks` table:

```bash
docker exec -it task-2-db-1 psql -U a2user -d a2db
```

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
);

INSERT INTO tasks (title, done) VALUES
  ('Learn Express', false),
  ('Finish Backend Task', false),
  ('Push to GitHub', true);
```

5. To stop everything:

```bash
docker compose down
```

(This stops the containers but keeps the volume — your data is preserved. Use `docker compose down -v` only if you intentionally want to wipe the database.)

---

## Running locally without Docker (optional)

Requires a Postgres instance reachable via the `DATABASE_URL` in your `.env`.

```bash
npm install
node server.js
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string, e.g. `postgresql://user:password@host:5432/dbname` |

See `.env.example` for the expected format. `.env` itself is gitignored and never committed.

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get one task |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

---

## Example curl Request

```bash
curl.exe http://localhost:3000/tasks
```

Output:

```json
[{"id":1,"title":"Learn Express","done":false},{"id":2,"title":"Finish Backend Task","done":false},{"id":3,"title":"Push to GitHub","done":true}]
```

---

## Proving Persistence

To confirm data survives a full restart:

```powershell
Invoke-RestMethod -Uri http://localhost:3000/tasks -Method Post -ContentType "application/json" -Body '{"title":"Persistence test"}'
```

Then stop and restart the stack:

```bash
docker compose down
docker compose up
```

Checking `/tasks` again still shows the new task — confirming the Postgres data volume persisted across a full container teardown and recreation, independent of the app or database container lifecycle.

---

## Swagger UI

Interactive API documentation is available at:

http://localhost:3000/docs

### Screenshot

![Swagger UI](./screenshots/swagger-ui.png)

---

## Author

**Mamoor Ali Zarrar**