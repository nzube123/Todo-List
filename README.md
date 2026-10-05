# Daybook — Todo + Notes

A local-first productivity app built with React, TypeScript, Vite, Express, Prisma, PostgreSQL, Zod, and Tailwind CSS. Your data is stored in a Postgres-compatible database such as Neon.

## Requirements

- Node.js 20.19+ or 22.12+
- pnpm 9+

## Quick start

```sh
git clone <repository>
cd todo-app
pnpm install
cp .env.example .env
# Replace the placeholder Neon/Postgres URL in .env before running migrations
pnpm db:generate
pnpm db:migrate
pnpm dev
```

For a live Neon/Postgres deployment, run `pnpm db:deploy` after the connection string is set in the host environment.

Open http://localhost:5173. The API runs on http://localhost:5000. The PostgreSQL database is configured through `DATABASE_URL`.

If your shell does not provide `cp`, create a root `.env` containing the values from `.env.example` and set a valid Neon/Postgres connection string.

## Commands

| Command            | Description                                      |
| ------------------ | ------------------------------------------------ |
| `pnpm install`     | Install workspace dependencies                   |
| `pnpm db:generate` | Generate the Prisma client                       |
| `pnpm db:migrate`  | Create or apply the Postgres schema in dev mode  |
| `pnpm db:deploy`   | Apply the committed Postgres migration set       |
| `pnpm dev`         | Run the API and web development servers together |
| `pnpm typecheck`   | Check strict TypeScript in both apps             |
| `pnpm lint`        | Lint application source files                    |
| `pnpm build`       | Build the API and production web bundle          |

## Features

- Tasks: create, edit, complete, remove, search, filter, and sort; includes priority and due dates.
- Notes: create, edit, remove, search titles and content, pin and unpin; pinned notes appear first.
- Dashboard: task totals, recent tasks, recent notes, and pinned notes.
- Accessible, responsive layout with loading, empty, error, and success feedback.

## API

All endpoints return `{ "success": true, "data": ... }` on success and a consistent `{ "success": false, "error": { "message": ... } }` body on errors. Routes are under `/api/todos` and `/api/notes`; `/api/health` reports server health.

## Configuration

Copy `.env.example` to `.env` and replace the sample Postgres/Neon URL with your actual `DATABASE_URL`. Set `PORT` and `FRONTEND_ORIGIN` for your environment.
