# AGENTS.md

Authoritative guide for AI agents (Claude Code, Junie, Copilot, etc.) working in this
repository. Load this before starting any task. `app` is a scaffold for building a web
application test-first: a backend, a frontend, shared types and a test suite.
What it does comes from the epics and stories the team is given. It is built on
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
`app_user` / `app_password`, host port `POSTGRES_HOST_PORT` (default 5432; a local root `.env` may
set another, which `docker-compose.yml`, `drizzle.config.ts` and `scripts/ci.sh` all read). The deployed
app (`docker-compose.production.yml`) is published on `127.0.0.1:${APP_HOST_PORT:-8080}`. Test DBs are configured in
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
| `yarn test:bdd` | All Cucumber acceptance tests, except the scenarios tagged `@wip` or `@todo` |
| `yarn test:wip` | The Cucumber scenarios tagged `@wip` |
| `yarn test:skeleton` | The walking-skeleton test against the deployed app (needs `DEPLOYED_APP_URL`; `scripts/ci.sh` sets it) |
| `scripts/ci.sh` | The deployment pipeline: commit stage, deploy, acceptance stage (below) |
| `yarn build` | Builds every workspace |
| `yarn db:generate` | Generate a Drizzle migration from the registered schemas |
| `yarn db:migrate` | Apply pending migrations |

A script is added to the root `package.json` together with the first workspace
that needs it; the table is the contract each one honours.

**`scripts/ci.sh`** is the pipeline, run by `.github/workflows/ci.yml` on every push and pull request
and locally from the repo root. It reads the root `.env` and runs three stages:
`--- commit stage` (`yarn install --immutable`, `yarn build`, `yarn eslint .`, `yarn test`, the
development database up, `yarn test:contract`), `--- deploy` (`docker-compose.production.yml`: the one
image from the `Dockerfile` and its own Postgres on the kept volume `production-data`; the container
runs `migrate.js`, then `main.js`) and `--- acceptance stage` (`yarn test:skeleton` and `yarn test:bdd`
against the deployed app on `APP_HOST_PORT`, default 8080).

`yarn test:contract` needs `unshare` (util-linux), `pgrep` and unprivileged user namespaces:
`contract/backend-process/termination.spec.ts` starts the built backend as PID 1 in a new PID
namespace to send it SIGTERM. The workflow lifts Ubuntu 24.04's restriction with
`sysctl kernel.apparmor_restrict_unprivileged_userns=0`. The specs that count `pg_stat_activity`
connections fail if anything else holds a connection to `app_test`.

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
`import type { RestApi } from '@app/types/rest-api'`. Today it holds `rest-api` (the `RestApi`
abstraction, with `get`, `put`, `post` and `patch`, and `FetchRestApi`), `rest-api-refusals` (the
refusals `FetchRestApi` throws: `UnprocessableContentException` for a 422, `NotFoundException` for a 404 and `BadRequestException` for a 400,
which carries the `missing` and `fields` of the body; each refusal of its own names its status in a static
`status`, and `theRefusalFor(status)` finds it), `request-rejection` (the `requestRejection` error
schema), `discounts` (the request and response schemas) and `greeting` (the wire type). It is not a path alias: the
backend runs its compiled output, and Node resolves the package through `node_modules`
and strips the `.ts` types on the symlink's real path.

---

## 5. Backend

The backend's source is `packages/backend/src/`. It has one bounded context, `src/discounts/`, with
`application/`, `application/domain/` and `infra/` (no `app/` level between `src/` and the context).

- **`src/main.ts`:** the bootstrap. CORS from `FRONTEND_URL`, port from `PORT`, `enableShutdownHooks()`
  (a SIGTERM closes the connections and exits), and it serves the built web app
  (`packages/frontend/dist`) beside the API, so one process answers both.
- **`src/app.module.ts`:** the root NestJS module; it imports the context's module.
- **`src/migrate.ts`:** the deploy-time migrator. It applies the migrations in
  `src/discounts/infra/migrations/` to `DATABASE_URL`; the image runs it before `main.js`.
- **`src/discounts/application/`:** `discount-service.ts` (`publish()`, `published()`) and, in
  `domain/`, the `Discount` aggregate, `DiscountDetails`, `DiscountFactory`, the `DiscountPublished`
  and `DiscountRateChanged` events and two ports, `DiscountRepository` (`save` inserts or updates,
  `all`, `withId`) and `DomainEventPublisher`. `Discount.publish()` and `Discount.changeRate()` raise
  their events through the port.
- **`src/discounts/infra/`:** `discounts.controller.ts` (`POST /discounts` answers 201 with a
  `Location`; `PATCH /discounts/:id`, which answers 204, or 404 for an id nobody published;
  `GET /discounts`), `parsed-by.ts` (`ParsedBy`, the zod pipe that parses a request; a
  failure is a 400 `requestRejection`, listing in `missing` the fields the request leaves out, and there
  is no exception filter), `refused-publish.ts` (answers a refused publish: 400 with `missing`, or 400
  `fields: ['rate']`) and `missing-discount.ts` (answers `NoSuchDiscountException` with a 404), `refused-redemption.ts` (answers a refused
  redemption: 422, 404 "No coupon has this code", 409), `answered-refusals.ts` (below),
  `discount-drizzle-repository.ts`, `event-emitter-domain-event-publisher.ts` (the adapter over
  EventEmitter2), `discounts.module.ts` (the wiring). The request and response schemas
  (`publishDiscountRequest`, `discountResponse`, `publishedDiscountsResponse`) are in
  `@app/types/discounts`; `requestRejection {statusCode, message, fields?, missing?}` is in
  `@app/types/request-rejection`.
- **The hook** is a discount's optional free text: absent from `DiscountDetails` when there is none,
  optional on the wire, a nullable `hook` column in the database (migration `0004`, lossy down); the
  repository maps a null column to an absent hook.
- **Coupons** are part of the `Discount` aggregate: `issueCoupon(token)` adds a `CouponToken`
  (value object, `drawnFrom(random)`; ten Crockford base32 characters) through `Coupons`, which raises
  `CouponIssued`; there
  is no coupon repository and no coupon port. `DiscountService` takes the random source, which
  `discounts.module.ts` wires as `crypto.getRandomValues`. `POST /discounts/:id/coupons` answers the
  coupon through `couponResponse`, or 404 for an id nobody published. They are kept in the `coupons` table (migration `0005`, lossy down),
  written and read with their discount (`infra/coupon-rows.ts`).
- **Redeeming:** `Coupon` is an entity inside the aggregate that owns single use (`redeem()` raises
  `CouponRedeemed`); `Discount.redeemCoupon(token, store)` refuses a coupon of another store (`Store.equals`:
  name and address exactly) and answers with the item. The discount's coupons live in `Coupons`, a
  collection inside the aggregate. Each entity raises the events of what it owns through the event-publisher
  port: `Coupons` raises `CouponIssued` and `DiscountedSalesCounted`, `Coupon` its own, `Discount` the rest;
  there is no class that raises events for the others (ADR 0009). `CouponToken.read(code)`
  normalises a typed code and refuses one not written as a token with `NoCouponHasTheCodeException`. `DiscountService.redeemCoupon(code)` loads the discount through
  `DiscountRepository.withCouponToken`. `infra/redemptions.controller.ts` serves `POST /redemptions`
  (201 `{ item }`; 422 for another store's coupon; 404 "No coupon has this code" for a code nobody issued, a
  refusal family of its own beside "no such discount" (ADR 0010); 409 already used, and only that; 400 for a
  missing or blank code or store). Migration `0006` adds `coupons.redeemed` (lossy down).
- **Counting:** `Discount.count()` has `Coupons` count the coupons redeemed since the last count and mark
  them counted (`Coupon` holds `redeemed` and `counted`); `Coupons` raises `DiscountedSalesCounted`.
  `DiscountService.count(store)` goes through `DiscountChanges` (`application/discount-changes.ts`),
  the unit of work every use case shares: load through the repository port, tell, save, one discount
  per save. `DiscountRepository.ofStore` finds a store's discounts by name and address.
  `infra/store-counts.controller.ts` serves `POST /stores/counts` (201). Migration `0007` adds
  `coupons.counted` (lossy down).
- **Refusals answered:** `infra/answered-refusals.ts` has `answeredWith(refusal class, its rejection)` and
  `answerFrom(list)`, which answers with the first that matches and rethrows any other failure (a 500, never
  a guessed refusal); `refused-publish.ts`, `missing-discount.ts` and `refused-redemption.ts` are lists for it.
  `DiscountChanges` finds a discount through one builder taking the find and the refusal: `theOneWithId`
  (exported, `NoSuchDiscountException`) and `theOneThatIssued` (`NoCouponHasTheCodeException`).
- **Single use and concurrency:** `Coupon.redeem` refuses a coupon already redeemed
  (`CouponRedemptionRejected`; `POST /redemptions` answers 409; 'not for this store' answers 422). `DiscountChanges` runs issuing,
  redeeming and counting through `DiscountRepository.changing(work)`: one transaction, the discount's
  row locked (`SELECT … FOR UPDATE`), so concurrent changes to one discount are serialised. `changeRate`
  stays outside `changing`, last write winning.
- **The rate** is text end to end (column, schema, domain, page), kept exactly as written
  (migration `0003_rate_as_written`). It is
  checked only on publishing: `DiscountDetails.whenPublishable` through `Discount.publish(keep)` checks that
  the item, rate, store name and store address are present (blank text is not), then `DiscountRate` (above
  0, at most 100, at most one decimal). A discount refused keeps nothing and raises
  `DiscountPublicationRejected`. A piece left out, or blank, answers 400 with `fields` and `missing` naming
  it (`PiecesMissingException`); a field absent from the body is refused by `ParsedBy` as missing, with no
  event, while a field of the wrong type is in `fields` only; a rate not valid answers 400 with
  `fields: ['rate']` and nothing missing. A kept rate is never
  re-checked. `contract/support/discounts-table.ts` has `insertADiscountRow`, which inserts a row
  without the rule, for rates kept before it.
- **`src/discounts/infra/database.module.ts`:** the one connection pool, exported as the Drizzle
  `database` provider and closed in `onApplicationShutdown`.
- **Database:** `packages/backend/drizzle.config.ts` reads the Drizzle schema from
  `src/discounts/infra/schema.ts`, with `schemaFilter: ['app']` (the Postgres schema `app`, not a
  folder), and writes migrations to `src/discounts/infra/migrations/`: generate
  with `yarn db:generate` (`--name <name>`; `--custom` for a data migration), apply with
  `yarn db:migrate`. A new table is declared in `schema.ts` and exported from it, or drizzle-kit does
  not see it. A migration a deploy has applied is never edited (Drizzle skips older ones and the
  production volume is kept): add a new one. A migration that cannot be generated back is written by
  hand in `migrations/drizzle-down/<tag>.sql`; a down that loses data says so on its first line.
  Skill: `database-migrations`.

## 6. Frontend architecture

One web app covers the whole product, so it is built to production quality from the
first slice.

- **Feature-first folders:** `src/<feature>/{views,components,services,...}`.
- **Routing:** split into `router/routes-*.ts` modules merged in `router/index.ts`, with hash history (`#/`), so a reload
  of the statically served app keeps its route: the discounts page is `#/`, the walking skeleton's
  greeting `#/walking-skeleton`.
- **State:** Pinia stores in `src/stores/`; the till store holds one answer, an object of
  `discounts/till-answers.ts` that tells its own caption (`CouponNotValid` for a 404, chosen from the list
  `answersToRefusals`); the discounts store holds one publish answer the
  same way, an object of `discounts/publish-answers.ts` (nothing told, rate not valid, pieces missing)
  that tells the form's caption and each piece's, which `CaptionedInput` shows beside its field as `told` (it also takes an optional `required`).
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
- **Contract support:** `contract/support/` holds `app.ts` (`setupSut`, the wired app),
  `discount-repository.ts` (the repository over a database), `discounts-table.ts` (reading the table's
  constraints and inserting a row missing a column) and `migrations.ts`. A migration spec runs on a
  database of its own, `app_migration_test`, created empty and dropped when the test finishes, since it
  runs a schema backward and forward again. The discounts the specs publish are shared in
  `@sut/support/example-discounts` (with `publishedSpicesDiscount`); `contract/support/error-schema.ts`
  holds `bodiesNotMatchingTheErrorSchema`. Frontend store specs arrange the store with
  `aTestingDiscountsStore` (`unit/frontend/stores/discounts-store/`). A concurrency line fires
  several requests around the change it races, since one pair rarely interleaves: its supports are
  `issueACouponFor` and `askForACouponFor` (`contract/support/redemptions.ts`) and `changeTheRateOf`
  (`contract/support/rates.ts`); keep race rates at or below 100. A discount with a hook is
  `spicesDiscountWithItsHook`; `discounts-table.ts` also holds `aDiscountKeptBefore` and
  `aDiscountKeptBeforeAsReadAfterMigratingForward`, for a discount kept before a migration. A new
  migration joins `theMigrationsAfterIt` in each earlier migration spec; otherwise the migrator
  silently skips an earlier migration that a spec ran backward: today those are the lists in the
  table, rate, hook, coupons and coupon-count migration specs. `anIdNoDiscountHas` (`@sut/support/example-discounts`) is the id of the 404 specs;
  `publicationRejectionsHeardBy` (`contract/support/publication-rejections.ts`) listens for the events a
  refused publish raises; the publish form's component specs arrange it with `publish-discount-form-of-an-app.ts`
  (`unit/frontend/discounts/components/publish-discount-form/`). A random source in a spec is `aSourceDrawing(token)`
  (`@backend/app/mocks/random-sources`); `couponForTheSpicesDiscount`, `stephaniesProduceDiscount` are
  among the shared examples; `contract/support/discounts-table.ts` has `insertACoupon` and
  `migrations.ts` has `migrateBackwardPast`. The stores a spec redeems at are `atTheSpicesStore` and
  `atStephaniesStore` (`sut/support/example-stores.ts`); `theFieldsNamedBy` is in
  `contract/support/error-schema.ts`; `theDiscountsKept` and `theRowKeptFor` are in `discounts-table.ts`, which also has `theCouponsKept`,
  `keptUnused`, `theDiscountsAndCouponsKept` and `keptAsIssued`, to show a refused request changed nothing.
- **Tags:** `@wip` marks the scenario being built (run it with `yarn test:wip`); `@todo` marks a
  recorded missing case whose steps are written and whose step definitions are not. Both are
  excluded from `yarn test:bdd`.
- **Walking skeleton:** `contract/walking-skeleton/walking-skeleton.spec.ts`, in its own Vitest
  project, `skeleton`, which the `contract` project excludes. It drives the deployed app (page,
  backend, database; a read path and a write path), so `scripts/ci.sh` runs it after the deploy.
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
- `docs/adr/README.md` — the architecture decision records and how to add one.
- `docs/architecture.md` — the containers of the deployed app and the deployment pipeline (C4, Mermaid).

---

## 9. Working process

- **Commits, interactive and autonomous sessions:** skills
  `committing-one-unit-per-commit`, `working-autonomously` (on `main` by default). When a worktree is named, it is
  made by the project's setup script, `scripts/prepare-worktree.sh <branch>`: it creates
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
agents in `~/.claude/agents/`). The orchestrator is the only role that talks to the user; it
dispatches `analyst` (epics, stories, scenarios and the slice plan), `qa` (red-test outline), `developer` (TDD, ops and toolchain work included),
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
