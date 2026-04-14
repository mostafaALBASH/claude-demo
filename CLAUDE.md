# TaskFlow — Project Context

## What this is

TaskFlow is a lightweight REST API for managing tasks and users,
built with Express and SQLite (via better-sqlite3). It's the demo
project for the "Claude Code in Action" course.

## Tech stack

- **Runtime:** Node.js 20+
- **Framework:** Express 4
- **Database:** SQLite through `better-sqlite3`
- **Tests:** Node's built-in test runner (`node --test`)

## Project layout

```
src/
  index.js          — app entry point, middleware, route mounting
  routes/tasks.js   — CRUD for tasks
  routes/users.js   — CRUD for users
  models/db.js      — database init + connection helper
  middleware/        — validation, auth (future)
  utils/helpers.js   — small shared utilities
tests/
  tasks.test.js     — integration tests (start server first)
data/
  taskflow.db       — SQLite file, auto-created on first run
```

## Conventions

- Use `const` by default. Only reach for `let` when you actually reassign.
- Prefer early returns over deep nesting.
- Route handlers follow the pattern: validate → query → respond.
- All new endpoints need a matching test in `tests/`.
- Commit messages: imperative mood, 50 chars or less for the subject.

## Running the project

```bash
npm install
cp .env.example .env   # then set your real ANTHROPIC_API_KEY
npm run dev             # starts on http://localhost:3000
npm test                # needs the server running in another tab
```

## Common tasks

| What                        | Command                   |
| --------------------------- | ------------------------- |
| Start dev server            | `npm run dev`             |
| Run tests                   | `npm test`                |
| Lint                        | `npm run lint`            |
| Format                      | `npm run format`          |
| Check db manually           | `sqlite3 data/taskflow.db`|

## Things to watch out for

- The SQLite file lives in `data/`. Don't commit it to version control.
- `.env` holds secrets — never commit that either.
- `better-sqlite3` is synchronous; that's fine for this project size,
  but don't use it as a pattern for high-traffic production APIs.
