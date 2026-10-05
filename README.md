# app

A scaffold for building a web application test-first: a NestJS backend, a Vue frontend, shared
types, and a test suite with unit, contract and acceptance tests. The walking skeleton is in place: a
page shows the latest greeting stored in Postgres and saves a new one through the backend, and one
pipeline builds, deploys and tests it.

## Setting up

You need Node `26.9.0` (pinned in `.node-version`) and Docker. From the repository root, run:

```sh
./scripts/bootstrap.sh
```

This is the only setup step. The script:

1. installs and enables Corepack when it is missing, which provides the Yarn pinned in `package.json`;
2. runs `yarn install`, which also copies each workspace's `.env.example` to `.env` when there is
   none, installs the git hooks and installs the Playwright browser;
3. wipes the local databases and starts Postgres 16 afresh with `docker compose`, waiting until it
   is healthy.

Postgres is published on the host port `POSTGRES_HOST_PORT` (default 5432); to use another, set it in
a root `.env`, which `docker compose`, `drizzle-kit` and `scripts/ci.sh` read.

Rerunning it resets the local databases to empty; everything else is left as it is.

## Running

| Command | What it does |
|---|---|
| `yarn dev` | Runs the backend (port 3000) and the frontend (port 5173) |
| `yarn test` | The unit tests |
| `yarn test:contract` | The contract tests, against the test database |
| `yarn test:bdd` | The acceptance tests, except the scenarios tagged `@wip` or `@todo` |
| `yarn test:wip` | The acceptance scenarios tagged `@wip` |
| `yarn test:skeleton` | The walking-skeleton test, against a deployed app (`DEPLOYED_APP_URL`) |
| `scripts/ci.sh` | The whole pipeline: commit stage, deploy, acceptance stage |
| `yarn build` | Builds every workspace |
| `yarn db:migrate` | Applies pending migrations |

`yarn test:contract` also needs `unshare` (util-linux), `pgrep` and unprivileged user namespaces.

## Deploying

`scripts/ci.sh` is the deployment pipeline; `.github/workflows/ci.yml` runs it on every push and pull
request, and you can run it from the repository root. It builds and tests the code, then deploys the
one production image (the `Dockerfile`: the backend, serving the built web app beside its API) with
`docker-compose.production.yml`, and runs the acceptance tests against it. The deployed app listens on
`127.0.0.1:${APP_HOST_PORT:-8080}`; its database lives in the volume `production-data`, and each
deploy migrates it before the app starts. The architecture is drawn in `docs/architecture.md`.

`AGENTS.md` holds the architecture and the working rules.
