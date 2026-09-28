# app

A scaffold for building a web application test-first: a NestJS backend, a Vue frontend, shared
types, and a test suite with unit, contract and acceptance tests. Everything is set up and empty;
the product is built on top of it.

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

Rerunning it resets the local databases to empty; everything else is left as it is.

## Running

| Command | What it does |
|---|---|
| `yarn dev` | Runs the backend (port 3000) and the frontend (port 5173) |
| `yarn test` | The unit tests |
| `yarn test:contract` | The contract tests, against the test database |
| `yarn test:bdd` | The acceptance tests |
| `yarn build` | Builds every workspace |
| `yarn db:migrate` | Applies pending migrations |

`AGENTS.md` holds the architecture and the working rules.
