# Invoice Mate

Full-stack monorepo for the Invoice Mate test assignment. It contains:

- `apps/api` – Fastify + Supabase backed API
- `apps/web-client` – React/Vite front-end
- `common` / `core` – shared logic, env loader, Supabase helpers
- `scripts` – automation (Supabase DB + Functions)

## Stack

- Node.js 20 / npm workspaces
- Fastify, Supabase client, Vitest
- React 18 + Vite + shadcn-ui

## Requirements

- Node.js 20+ and npm 10+
- Git
- Supabase CLI (only for DB migrations / Supabase functions)
  - macOS: `brew install supabase/tap/supabase`
  - cross-platform: `curl -fsSL https://supabase.com/cli/install.sh | sh`
- Docker 24+ (optional, for container builds)

## Getting started

```bash
git clone <repo_url>
cd invoice-mate
npm install
cp .env.example .env
# fill .env with real values (see below)
```

### Environment variables

The runtime expects a `.env` file in the repo root. The sample file documents everything:

| Variable                                       | Description                                              |
| ---------------------------------------------- | -------------------------------------------------------- |
| `SUPABASE_TOKEN`                               | Personal access token for Supabase CLI (used by scripts) |
| `SUPABASE_PROJECT_ID` / `SUPABASE_PROJECT_URL` | Supabase project identifiers                             |
| `SUPABASE_API_KEY_SECRET`                      | Service-role key used by the API                         |
| `DATABASE_URL`, `DIRECT_URL`                   | Optional DB URLs for Prisma/Supabase migrations          |
| `SITE_URL`, `VITE_API_URL`, `CORS_ORIGIN`      | Front-end/API integration                                |
| `API_PORT`, `ENVIRONMENT`, `LOG_LEVEL`         | API runtime                                              |

`core/src/env.ts` loads the `.env` file automatically; you can also rely on real environment variables in production.

### Supabase database & functions (optional)

1. Install Supabase CLI (see above) and authenticate:

   ```bash
   node scripts/run-with-env.js supabase login --token __SUPABASE_TOKEN__
   ```

2. Initialize DB + functions on a fresh environment:

   ```bash
   npm run script:supabase:sync  # login + link + db push + deploy functions
   ```

   These scripts pull tokens/project IDs from `.env` via `scripts/run-with-env.js`.

Run these commands only when you need to provision/update Supabase (locally or in CI). The Docker image **does not** run Supabase CLI; make sure migrations/functions are applied before deploying the container.

## Running locally

In separate terminals:

```bash
# API (Fastify)
npm run api:dev

# Front-end (Vite dev server)
npm run web-client:dev
```

Both commands read configuration from `.env`. The API listens on `API_PORT` (default `3000`); the Vite dev server defaults to `5173`.

## Useful scripts

| Command                                  | Description                                           |
| ---------------------------------------- | ----------------------------------------------------- |
| `npm run script:db:init`                 | Auth, link, and push Supabase schema                  |
| `npm run script:functions:deploy`        | Deploy the `health` edge function                     |
| `npm run script:supabase:sync`           | Run DB init + functions deploy in one shot            |
| `node scripts/run-with-env.js <command>` | Run arbitrary commands with `.env` variables injected |
| `npm run api:dev`                        | Start Fastify API                                     |
| `npm run web-client:dev`                 | Start Vite front-end                                  |
| `npm test`                               | Execute Vitest test suite                             |

## Testing

```bash
npm test            # single run
```

Vitest covers:

- `scripts/run-with-env` unit tests
- use-case level integration tests in `common/src/usecases`

## Docker

The Dockerfile builds the front-end bundle and runs both the API and the static UI inside a single container (no Supabase CLI inside).

```bash
docker build -t invoice-mate .
docker run --env-file .env \
  -p 4173:4173 \   # Vite preview (static front-end)
  -p 3000:3000 \   # Fastify API
  invoice-mate
```

What happens inside:

1. The API boots on `API_PORT` (default 3000).
2. The built front-end is served via `npm run preview --workspace apps/web-client` on `FRONTEND_PORT` (default 4173).
3. Both services communicate over `localhost` inside the container; only the UI needs to be reachable from outside (but the API port must be exposed if the UI talks to `http://localhost:3000`).

Pass your `.env` to `docker run` (or inject via ECS/Kubernetes secrets). Run Supabase migrations/functions separately before deploying this image.

### Deploying to AWS

1. Build and push the Docker image to Amazon ECR.
2. Provision a Supabase project (or any Postgres-compatible backend) and set the required environment variables in your ECS task/EC2 instance.
3. Run `npm run script:supabase:sync` (or individual scripts) from your CI/CD pipeline before rolling out the container.
4. Expose ports 4173/3000 (or configure ALB/ingress rules) to route traffic to the front-end/API as needed.
