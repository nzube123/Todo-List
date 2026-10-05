# AGENTS.md — Daybook (HNG Internship 15, Stage 1)

Persistent instructions for AI coding agents working in this repository. Follow these rules for every change.

## Project overview

Daybook is a responsive To-Do/task and notes application for the HNG Internship 15 Stage 1 project. Tasks support completion, search, filtering, sorting, priority, and due dates; notes support search and pinning. The dashboard summarizes tasks and notes. These task and note workflows, plus the dashboard and task organization features, satisfy the app's additional-feature requirement. Keep public deployment and testing/validation in view when preparing release work; do not claim deployment unless it has actually been completed and checked.

Technology in this repository:

- Workspace/package manager: pnpm (`pnpm-workspace.yaml`)
- Frontend: React, TypeScript, Vite, Tailwind CSS (`apps/web`)
- Backend: Node.js, Express, TypeScript (`apps/api`)
- Persistence: SQLite through Prisma (`apps/api/prisma/schema.prisma`)
- Backend request validation: Zod

Use this stack. Do not introduce Next.js, another database/service, Docker, npm, or yarn.

## Architecture rules

- Preserve the pnpm workspace and existing `apps/web` and `apps/api` boundaries. Inspect the current files before changing or adding architecture; do not restructure just for preference.
- The web app owns presentation, interactions, and browser-side input feedback. It must never connect to SQLite or Prisma.
- The API owns HTTP handling, authoritative validation, business rules, and all database access. Keep Prisma access in backend services/libraries, not React components or browser code.
- Keep React components focused on rendering and UI interactions. Use the existing API service modules (`apps/web/src/services/todo.service.ts`, `note.service.ts`) for network access rather than scattering `fetch` calls through components.
- On the backend, preserve the existing separation: routes define endpoints, controllers translate HTTP requests/responses, services contain application/data-access logic, schemas validate input, middleware handles shared concerns, and `src/lib` contains shared infrastructure.
- Reuse existing types, hooks, services, components, and utilities where appropriate. Add files only when they provide a clear project-level benefit.

## Coding standards

- Prefer strict TypeScript and precise types at module boundaries. Do not use `any`, `@ts-ignore`, or `@ts-nocheck` to silence an error. If an exceptional `any` is technically unavoidable, document the specific reason at its use.
- Use clear, descriptive names and small, focused functions/components. Keep code readable and consistent with nearby files.
- Avoid duplicate helpers and unnecessary dependencies. Before proposing a dependency, explain why existing packages or standard platform APIs are insufficient; add only what is needed and keep manifests/lockfile in sync with pnpm.
- Handle expected failures explicitly. Do not swallow exceptions or show raw server/database internals to users.
- Keep accessibility in mind: semantic controls, labels, keyboard behavior, and visible focus/feedback.

## React and frontend rules

- Use functional components and hooks; keep page, layout, task, note, and shared UI responsibilities modular in `apps/web/src`.
- Keep API and business logic out of components where practical; use the existing services and shared hooks.
- Provide appropriate loading, empty, success, and error states for asynchronous flows. Keep user-facing errors useful and understandable.
- Validate form input in the UI for fast feedback, but always rely on backend validation as the security and data-integrity boundary.
- Keep task filters/sorts/search and note search/pinning behavior consistent with the existing UI and API.

## Express and backend rules

- Keep routes, controllers, services, schemas, middleware, and Prisma access separated according to `apps/api/src`.
- Validate every path parameter, query parameter, and request body with Zod (or the established schema mechanism) before business logic uses it. Never trust client-provided values.
- Use correct, consistent HTTP status codes and the established response envelope: success `{ "success": true, "data": ... }`; failure `{ "success": false, "error": { "message": "..." } }`.
- Handle invalid input, invalid IDs, missing resources, and unexpected failures centrally. Return actionable messages without stack traces, database details, secrets, or other sensitive information.
- Keep CORS origin configuration intentional and environment-driven where appropriate; do not use a permissive production wildcard.

## SQLite and Prisma rules

- Keep every database operation on the API server and use Prisma's safe query API; do not construct SQL from untrusted strings.
- Preserve data integrity and existing records. Schema changes require an appropriate Prisma migration and consideration of existing databases; do not use destructive resets or delete/mutate the SQLite database to make a change pass.
- Keep the SQLite provider and local database workflow. Ensure setup/generation/migration commands still work from a clean checkout.
- Do not commit `.env` or expose environment values. Treat the local SQLite database as generated/runtime data according to `.gitignore`.

## API rules

The existing REST resources are `/api/todos` and `/api/notes`:

| Method | Endpoint         | Expected behavior                                                  |
| ------ | ---------------- | ------------------------------------------------------------------ |
| GET    | `/api/todos`     | List todos; supports validated search/filter/sort query parameters |
| GET    | `/api/todos/:id` | Retrieve one todo or return not found                              |
| POST   | `/api/todos`     | Validate and create a todo                                         |
| PATCH  | `/api/todos/:id` | Validate and partially update a todo                               |
| DELETE | `/api/todos/:id` | Delete a todo or return not found                                  |
| GET    | `/api/notes`     | List notes; search title/content and order pinned notes first      |
| GET    | `/api/notes/:id` | Retrieve one note or return not found                              |
| POST   | `/api/notes`     | Validate and create a note                                         |
| PATCH  | `/api/notes/:id` | Validate and partially update a note, including pin state          |
| DELETE | `/api/notes/:id` | Delete a note or return not found                                  |
| GET    | `/api/health`    | Report API health                                                  |

Preserve REST conventions, response envelopes, filtering semantics, and validation. Update API documentation when externally observable behavior changes.

## Testing requirements (mandatory)

- Every API endpoint created or changed must have automated tests covering its behavior. This includes **every method/path above**—collection and item GETs, POST, PATCH, DELETE for both resources—and the health endpoint when it is changed. Test success responses and relevant failure cases (invalid input/ID and missing resource where applicable).
- Add tests for important business logic such as todo filters/sorts, note search and pinned ordering, validation, and error mapping. Add regression tests for bugs when appropriate.
- Exercise the actual endpoint behavior, not only helper functions. Use isolated test data/database setup and cleanup that cannot destroy or overwrite a developer's local database.
- There is currently no test script or test framework in the workspace. Before adding one, inspect the current manifests and explain why the chosen minimal test dependency is necessary; update the root/workspace scripts and lockfile through pnpm. Do not claim endpoint-test coverage until the tests exist and pass.
- Run relevant tests after changes. A feature is not complete while its required tests fail.

## Validation before completion

After a change, run the applicable checks and fix failures before reporting completion. For a full application or API change, verify:

1. `pnpm typecheck`
2. `pnpm lint` (currently delegates to TypeScript checking; do not imply a separate static lint engine runs)
3. The automated test suite (add/run it for API behavior as required above)
4. `pnpm build`
5. `pnpm db:generate` and `pnpm db:migrate` when Prisma schema/setup is affected, using a safe local development database
6. Affected API endpoints against the running server, including success and relevant error paths
7. The frontend/backend runtime and existing task, note, dashboard behavior affected by the change

Use the scripts and setup actually present in the repository; verify commands rather than assuming them. Report only checks that were run and passed. Do not leave known type, test, migration, build, or runtime failures.

## Dependency rules

- Prefer dependencies already declared in the relevant workspace package.
- Do not install a package when existing dependencies or standard APIs can reasonably do the work.
- Before adding a dependency, state why it is necessary, check compatibility with the current Node/pnpm/TypeScript setup, and update the correct package manifest and pnpm lockfile. Avoid unrelated package upgrades.

## Security rules

- Never hardcode credentials, tokens, passwords, API keys, or private configuration. Use environment variables for server configuration and secrets; do not commit `.env`.
- Validate and constrain all external input on the server. Avoid unsafe SQL, unsafe HTML rendering, and untrusted values in security-sensitive operations.
- Do not expose stack traces, Prisma/database internals, environment variables, or sensitive server details in API responses or frontend messages.
- Keep CORS narrow and ensure changes do not accidentally expose local development assumptions in production.

## Git and change-scope rules

- Keep changes focused on the requested task. Do not overwrite, revert, or delete unrelated user work.
- Do not remove working code or generated user data without a clear, explicitly requested reason.
- Before a broad refactor, migration, dependency change, or other architectural modification, inspect the affected implementation and explain the need. Prefer the smallest safe change.

## AI agent workflow

1. Inspect the existing project files, scripts, schemas, and relevant call sites before editing.
2. Understand the current frontend/backend/data flow and requirements for the affected behavior.
3. Make the smallest maintainable change that fits the established structure and technologies.
4. Add or update tests, especially endpoint-level and regression tests where required.
5. Run type checking, lint, tests, build, relevant Prisma commands, and affected endpoint/runtime checks as appropriate; fix errors rather than leaving them for the user.
6. Review the final diff for unrelated changes, dependency/lockfile consistency, secrets, and destructive behavior.
7. Report what changed and which validations actually passed; be explicit about any verification blocked by the environment.
