# Daybook — Todo + Notes

A local-first productivity app built with React, TypeScript, Vite, Express, Prisma, SQLite, Zod, and Tailwind CSS. Your data is stored in a SQLite file; no database server is required.

## Requirements

- Node.js 20.19+ or 22.12+
- pnpm 9+

## Quick start

```sh
git clone <repository>
cd todo-app
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Open http://localhost:5173. The API runs on http://localhost:5000. The SQLite database is created at `apps/api/prisma/dev.db` when migrations run.

If your shell does not provide `cp`, create a root `.env` containing the values from `.env.example`. The sample defaults work for local development.

## Commands

| Command            | Description                                      |
| ------------------ | ------------------------------------------------ |
| `pnpm install`     | Install workspace dependencies                   |
| `pnpm db:generate` | Generate the Prisma client                       |
| `pnpm db:migrate`  | Create or apply the local SQLite schema          |
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

Copy `.env.example` to `.env` to override `DATABASE_URL`, `PORT`, or `FRONTEND_ORIGIN`. The defaults are configured for local development.
