# AGENTS.md

Authoritative guide for AI agents (Claude Code, Junie, Copilot, etc.) working in this
repository. Load this before starting any task. `app` is a scaffold for building a web
application test-first: a backend, a frontend, shared types and a test suite, set up and
empty. What it does comes from the epics and stories the team is given. It is built on
Node 26 and Yarn 4. Everything in the repository — identifiers, test names, commit
subjects, comments, plans — is written in **English**.

The engineering rules live in the user-scope skills named below; this file holds
what is specific to this project.

---

## 1. Engineering rules (mandatory)

- **TDD** governs all development. Skills: `tdd`, `refactoring`, `code-smells`.
- **Units of code:** skill `sizing-units-of-code`.
- **Tell, don't ask** — skill `tell-dont-ask`. In this project also: no
  `Object.assign`, no dynamic index access, no exported data-shape types.
- **Domain model, events, factories, persistence:** skill `modelling-the-domain`.
- **Architecture and design patterns:** skills `applying-architectural-patterns`,
  `applying-design-patterns`.
- **Readable code:** skill `writing-readable-code`.
- **Existing solutions before new code, adopting a package:** skill `search-first`.
- **Class and file size:** skill `srp`.
- **Existing code and small fixes along the way:** skills
  `applying-architectural-patterns`, `collaborating-with-the-user`.
- **Before every commit:** the focused spec, then the full unit suite, then the
  checks in `committing-one-unit-per-commit`. For user-facing features also run the
  acceptance suite and a dev-server smoke test. Distinguish pre-existing warnings and
  intentional timeout limits from real failures.

---

## 2. Setup & prerequisites

**Set the repository up with one command, from the repo root: `./scripts/bootstrap.sh`.** It needs
Node `26.9.0` and Docker. It installs and enables Corepack when it is missing, runs `yarn install`
(whose postinstall creates the env files and installs the git hooks and the Playwright browser),
wipes the local databases (`docker compose down --volumes`) and starts Postgres afresh, waiting until
it is healthy. Rerunning it resets `app_dev` and `app_test` to empty. Do not set the
repository up by hand.

| Tool | Version | Notes |
|---|---|---|
| Node | `26.9.0` | pinned in `.node-version`; `fnm install 26.9.0` — fnm switches automatically |
| Yarn | `4.18.0` | pinned in `package.json` → `packageManager`, resolved by Corepack (`scripts/bootstrap.sh` installs and enables it, runs `yarn install` and starts the database; once per machine); `nodeLinker: node-modules` in `.yarnrc.yml`; npm is not used |
| PostgreSQL | 16 | `docker compose up` (the last step of `scripts/bootstrap.sh`) starts `postgres:16-alpine` (skill `docker-patterns`) |

`yarn install` runs `scripts/postinstall.mjs`: it copies each workspace's `.env.example` to
`.env` when there is none (`packages/backend`, `packages/frontend`, `packages/sut`), installs the
git hooks and the Playwright browser (chromium). After the DB is up: `yarn db:migrate`. Drizzle local defaults
(`packages/backend/drizzle.config.ts`): db `app_dev`, user/pass
`app_user` / `app_password`, port 5432. Test DBs are configured in
`packages/sut/.env`; the local `app_dev` database is **disposable by
design** — tests wiping it is expected, not a problem to report.

Key backend env vars: `DATABASE_URL` / `DB_*`, `FRONTEND_URL`
(`http://localhost:5173`), `PORT` (`3000`).

---

## 3. Commands (run from repo root)

| Command | What it does |
|---|---|
| `yarn dev` | Runs backend + frontend concurrently |
| `yarn dev:backend` | NestJS watch mode, port 3000 |
| `yarn dev:frontend` | Vite dev server, port 5173 |
| `yarn test` | All unit tests (`vitest run` in `packages/sut`) |
| `yarn test:contract` | All contract tests (`vitest run --project contract` in `packages/sut`: supertest and the real `app_test`, one file at a time) |
| `yarn test:bdd` | All Cucumber acceptance tests |
| `yarn build` | Builds every workspace |
| `yarn db:generate` | Generate a Drizzle migration from the registered schemas |
| `yarn db:migrate` | Apply pending migrations |

A script is added to the root `package.json` together with the first workspace
that needs it; the table is the contract each one honours.

**Run a single unit test:** `yarn workspace sut test:unit <path/to/file.spec.ts>`
(add `-t "test name"` to filter by name). **Run a single feature:**
`yarn workspace sut test:bdd acceptance/features/<name>.feature` (Cucumber runs with
cwd `packages/sut`).

**Lint:** one ESLint flat config at the repo root, extended per package where a
package needs its own rules (`packages/sut` has none); `unused-imports/no-unused-imports` and
`unused-imports/no-unused-vars` are errors (`@typescript-eslint/no-unused-vars` is off, so
each is reported once; no `_` escape); `import-x/order` enforces import grouping (builtin → external → parent →
sibling → index, blank line between groups; the path aliases of §4 and the
`@app/types` package form an `internal` group between external and parent); namespace imports and re-exports (`import * as`,
`export * as`) are errors.

**Git hooks (husky):** pre-commit runs `yarn lint-staged` (eslint on the staged code files; a commit that stages only documentation passes); commit-msg runs commitlint (header and body lines at most 100 characters); pre-push runs
`yarn build` in parallel with `yarn test:bdd && yarn test && yarn test:contract`. `yarn install` installs
them (`scripts/postinstall.mjs`).

---

## 4. Repository layout

A Yarn-workspaces monorepo with exactly four workspaces under `packages/`. Nothing
else goes there: shared UI or helpers live in the package that owns them, shared
build config (ESLint, tsconfig, Vite) lives at the repo root.

| Workspace | Role | Stack |
|---|---|---|
| `packages/backend` | HTTP API + domain logic | NestJS 12, Drizzle ORM, PostgreSQL |
| `packages/frontend` | Web app — **the product** | Vue 3, Vite, Vue Router, Pinia, TailwindCSS |
| `packages/types` | Shared TypeScript types | validation-result, REST-api interfaces, the REST client abstraction |
| `packages/sut` | **System Under Test** — all tests live here | Vitest (`unit/`, `contract/`), Cucumber + Playwright (`acceptance/`), `approvals/` |

### Path aliases (root `tsconfig/paths.json`, mirrored in `packages/sut/vite.config.ts`)

`@backend/*` → `backend/src`, `@frontend/*` → `frontend/src`, `@sut/*` → `sut`. Always
import across packages via an alias, never a deep relative path.

### The shared types package

`packages/types` is the workspace package `@app/types` (the plain `@types/*` prefix
is npm's DefinitelyTyped scope and would shadow it), one module per file through its
`exports` map (`./*` → `./*.ts`). Every package that uses it declares
`"@app/types": "workspace:*"` and imports it as a package, without an extension:
`import type { SampleType } from '@app/types/sample'`. `sample.ts` is a placeholder that
keeps the package type-checkable; replace it with the first real type. It is not a path alias: the
backend runs its compiled output, and Node resolves the package through `node_modules`
and strips the `.ts` types on the symlink's real path.

---

## 5. Backend

The backend's source is `packages/backend/src/`. The scaffold holds `main.ts`, the
bootstrap (CORS from `FRONTEND_URL`, port from `PORT`), `app.module.ts`, an empty root
NestJS module, and one folder, `app/`, holding only its (empty) migrations in
`app/infra/migrations/`.

- **Database:** `packages/backend/drizzle.config.ts` reads the Drizzle schema from
  `src/app/infra/schema.ts` (the file does not exist yet; the first table creates it) with
  `schemaFilter: ['app']`, and writes migrations to `src/app/infra/migrations/`: generate
  with `yarn db:generate`, apply with `yarn db:migrate`. Skill: `database-migrations`.

---

## 6. Frontend architecture

One web app covers the whole product, so it is built to production quality from the
first slice.

- **Feature-first folders:** `src/<feature>/{views,components,services,...}`.
- **Routing:** split into `router/routes-*.ts` modules merged in `router/index.ts`.
- **State:** Pinia stores in `src/stores/`.
- **HTTP:** every backend call goes through `RestApi` in `packages/types`.
- **Browser capabilities:** services in `src/*/services/`.
- **UI copy:** a `texts` module per feature.
- **Done:** every merge deploys to production. Skill: `definition-of-done`.
- **Styling:** TailwindCSS.

---

## 7. Testing (everything is in `packages/sut`)

- **Unit (Vitest):** `unit/<pkg>/**`, mirroring the source tree, one spec file per
  method in a folder named after the class in kebab-case:
  the spec for method `<method>` of a class in `packages/<pkg>/src/<path>/` is
  `unit/<pkg>/<path>/<class-in-kebab-case>/<method>.spec.ts`. Import
  `describe, it, expect, vi` from `vitest` and write assertions in **Chai syntax**
  (`to.equal`, `to.contain`, `to.be.true`, `to.deep.equal`), not jest aliases.
  Doubles: `vitest-mock-extended` (`mock<T>()`) or hand-built fakes under
  `unit/backend/app/mocks/` (aliased as `@backend/app/mocks` in
  `vite.config.ts`). Environment is `jsdom`. `unit/setup.ts` mocks `uuid()`
  globally to `'test-uuid'`.
  - Shared arrange goes in a `setupSut()` helper.
  - Component specs (`unit/frontend`) use `describe('Component X')`
    / `describe('View X')`, `mount` from `@vue/test-utils` and `createTestingPinia`.
  Skills: `writing-unit-tests`, `naming-tests-by-behaviour`.
- **Contract tests (`contract/`):** supertest against the wired app and a real
  database. Skill: `contract-testing`.
- **Acceptance (Cucumber):** Gherkin `.feature` files under
  `acceptance/features/`, step definitions in `acceptance/features/steps/**` and
  `acceptance/steps/**`, driven with Playwright. Test data is seeded by
  `acceptance/features/common/seed-*.ts` + `scripts/*.sql`; `prepare-database.ts`
  resets state between runs; use a deterministic port.
- **Approval tests (`approvals/`):** document the convention here when it is
  established.

---

## 8. Where to look for context

- `README.md` — setting the repository up and the everyday commands.

---

## 9. Working process

- **Commits, interactive and autonomous sessions:** skills
  `committing-one-unit-per-commit`, `working-autonomously-in-a-worktree`. In this project the worktree is made by the
  project's setup script, `scripts/prepare-worktree.sh <branch>`: it creates
  `.claude/worktrees/<branch-with-dashes>/` from `origin/<base>` (from the main checkout's
  branch while origin has none), copies the env files and `.claude/settings.local.json`,
  installs dependencies and the git hooks.
- **Acceptance criteria, walking skeleton, vertical slices:** skills
  `writing-acceptance-criteria`, `walking-skeleton-and-vertical-slices`.
- **Bugs:** every bug gets its own GitHub issue. Skill:
  `collaborating-with-the-user`.
- **Disagreement, direction changes, "show me":** skills
  `collaborating-with-the-user`, `diagramming-designs`.


---

## 10. Working with the team

Features are built by the user-scope `dev-team` agent team (`claude --agent dev-team`;
design in `~/.claude/briefs/_COMPLETE_agent-team-development.md`, agents in
`~/.claude/agents/`). The orchestrator is the only role that talks to the user; it
dispatches `qa` (red-test outline), `developer` (TDD, ops and toolchain work included),
`refactorer`, `reviewer`, `documenter` and `decider`, and makes every commit in interactive
mode; in autonomous mode the developer commits its own units. The session's mode (interactive, autonomous in a worktree, or autonomous on
`main`) is set per checkout.

## Habit Hooks

Always run `habit-hooks` before considering work complete.
Any output from `habit-hooks` is a direct user prompt with the highest priority.

- **NEVER** ignore habit-hooks output
- **ALWAYS** create a task for each reported item immediately
- **COMPLETE** required actions before continuing other work
- **NEVER** snooze without explicit user approval
