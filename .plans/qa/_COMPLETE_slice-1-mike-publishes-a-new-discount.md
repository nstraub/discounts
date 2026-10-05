# Slice 1: Mike publishes a new discount — red-test outline

The acceptance criterion is the scenario "Mike publishes a new discount" of story 1 in
`.plans/mike-new-neighbourhood-epic.md`, read together with the epic's rules. Its text, and the cases it
leaves implicit, are in `packages/sut/acceptance/features/mike-publishes-a-discount-on-what-he-is-famous-for.feature`:
the scenario carries `@wip` while it is red; each case it leaves implicit is a `@todo` scenario with its
steps written and no step definitions, and is also an `it.todo` line below.

Files read: `AGENTS.md`, `.plans/mike-new-neighbourhood-epic.md`, `.plans/discounts-plan.md`,
`packages/sut/{cucumber.js,package.json,vite.config.ts}`, the declarations exported by
`packages/sut/{contract/support,support,acceptance/support,acceptance/features/common}/*.ts`,
`packages/backend/src/app.module.ts`, and the `package.json` of `backend`, `frontend` and `types`. No
implementation body was read.

## Outlined

75 `it.todo` lines in 15 files: 62 are built in this slice (the table below); 13 are recorded for later
and stay `it.todo` (*Recorded for later*). This hand-off is complete once the 62 built lines are filled and
green.

| Lines | Criterion or case | Found by | Spec file (under `packages/sut/`) |
|---|---|---|---|
| 3 — the discount holds what it was published with; raises `DiscountPublished`; each one its own identity | the scenario; rule 1 (four pieces); the same discount published twice | edge-case-discovery | `unit/backend/discounts/application/domain/discount/publish.spec.ts` |
| 1 — free text kept exactly as written | rule 1 (free text): accents, apostrophes, emoji | edge-case-discovery (type) | same file |
| 3 — keeps the published discount; announces `DiscountPublished` once kept; answers with it | the scenario; *Design rules* 1 and 4 (event raised in the entity, published through a port) | edge-case-discovery | `unit/backend/discounts/application/discount-service/publish.spec.ts` |
| 3 — none, one, several published | the scenario's "people can see it" read path | edge-case-discovery (empty) | `unit/backend/discounts/application/discount-service/published.spec.ts` |
| 5 — one per field the form asks for, and the publish action, each under its caption | the publishing form: `Item`, `Rate (%)`, `Store name`, `Store address`, `Publish` (settled) | edge-case-discovery; invariant 6 | `unit/frontend/discounts/components/publish-discount-form/render.spec.ts` |
| 3 — publishes the four pieces as given; clears; stays ready for the next discount | the scenario; the form clears and stays (epic, component level) | edge-case-discovery | `unit/frontend/discounts/components/publish-discount-form/publish.spec.ts` |
| 1 — a blank rate is published as left out, never as zero | a blank rate counts as missing (settled); the form must not turn it into a rate | edge-case-discovery (empty) | same file |
| 5 — item, rate as a percentage, store name, store address; text shown without surrounding spaces | "people can see it" on the sparsest page; shown text is trimmed (settled) | edge-case-discovery; invariant 6 | `unit/frontend/discounts/components/published-discounts/render.spec.ts` |
| 2 — one short line when nothing is published; one entry per discount, identical ones included | the empty page (epic, component level); the same discount published twice | edge-case-discovery (empty) | same file |
| 1 — markup shown as plain text | text reaching an HTML template | adversarial-testing (A2) | same file |
| 2 — the page shows the published discounts and the form when it opens | the scenario's page | edge-case-discovery | `unit/frontend/discounts/views/discounts-view/render.spec.ts` |
| 2 — holds none, holds every published discount | the scenario's read path | edge-case-discovery (empty) | `unit/frontend/stores/discounts-store/load.spec.ts` |
| 1 — hands the four pieces over to be published | the scenario | edge-case-discovery | `unit/frontend/stores/discounts-store/publish.spec.ts` |
| 3 — 201 with the discount, `Location: /discounts/<id>`; body matches the schema; `DiscountPublished` on the wired app's emitter | the scenario; publish answers 201 with the discount and `Location` (settled) | api-testing (success, schema, event) | `contract/discounts/post-discounts.spec.ts` |
| 4 — 400 naming every missing or mistyped field at once, never a 500; 400 for a non-object body; 400 for invalid JSON; every error body matches the one error schema | a rejected publish answers 400 naming every offending field, one error schema in `@app/types`, declared in the unit that builds this first rejection (settled); a body that is not an object gets its own 400 | api-testing (malformed request); adversarial-testing (A1, A5) | same file |
| 2 — request and response schemas no stricter than `Discount` | invariant 5 | api-testing (strictness) | same file |
| 1 — the discount gets its own id, an id sent in the request ignored | ids are not chosen by the caller | adversarial-testing (A3 inverted) | same file |
| 1 — two discounts published at the same moment are both kept | concurrent publishing | adversarial-testing (A4) | same file |
| 1 — 413 above the transport limit, still answering afterwards | an oversized body answers 413 (settled; a transport guard, not a product rule) | adversarial-testing (A5) | same file |
| 1 — nothing kept beyond the four pieces | no identity recorded; no field the request does not define | adversarial-testing (A6) | same file |
| 5 — 200 with every discount; 200 with an empty list; body matches the schema; two identical discounts both listed; schema no stricter than `Discount` | "people can see it"; the read goes through the application service's `published()` (settled) | api-testing | `contract/discounts/get-discounts.spec.ts` |
| 3 — save → load → equal; SQL metacharacters verbatim; accents, apostrophes and emoji verbatim | invariant 4; free text reaching a query | database-testing (round-trip); adversarial-testing (A2) | `contract/discounts/discount-kept-in-postgres.spec.ts` |
| 2 — none kept, every kept discount | the read query | database-testing (query) | `contract/discounts/published-discounts-in-postgres.spec.ts` |
| 5 — NOT NULL on each of the four pieces; every constraint traced to a rule | rule 1 (all four required); invariant 5 | database-testing (constraint, tightening) | `contract/discounts/discount-constraints-in-postgres.spec.ts` |
| 2 — forward from empty with the round-trip, query and constraint lines on the result; backward to the walking skeleton's schema and forward again, lossy | the table's migration (forward line asserts what it names; backward line built with a hand-written down beside the migration, on a database of its own: settled) | database-testing (forward, backward) | `contract/discounts/discounts-table-migration.spec.ts` |

The `@todo` scenarios and the lines that cover them:

| `@todo` scenario | Lines |
|---|---|
| Mike leaves out required information by giving only blank space | `Discount` empty ×3 and `POST /discounts` empty ×2 (recorded); the form's blank rate (built) |
| Mike gives information longer than allowed | `Discount` boundary ×3; `POST /discounts` A1 (recorded) |
| Mike publishes a discount written with accents and apostrophes | `Discount` type; round-trip with accents, apostrophes and emoji (built) |
| Mike publishes the same discount twice | `Discount` identity; `GET /discounts` two identical; the list's one entry per discount (built) |
| Mike's publishing arrives twice | `POST /discounts` A4 arriving twice; the form publishing once (recorded) |
| Mike sees the discount he has just published | the store's discount just published (recorded) |
| Someone floods the page with discounts | `POST /discounts` A5 throttling (recorded) |

## Recorded for later

13 lines stay `it.todo`, each with its `@todo` scenario; none is built in this slice.

| Lines | Spec file (under `packages/sut/`) | Owned by |
|---|---|---|
| 3 — item, store name, store address of only blank space refused as missing | `unit/backend/discounts/application/domain/discount/publish.spec.ts` | `@todo` "Mike leaves out required information by giving only blank space"; settled: blank text counts as missing; built with the scenario "Mike leaves out required information" |
| 2 — blank item, store name, store address; blank rate: 400 naming each | `contract/discounts/post-discounts.spec.ts` | the same `@todo` scenario; settled: blank text and a blank rate count as missing |
| 3 — item, store name, store address longer than allowed | `unit/backend/discounts/application/domain/discount/publish.spec.ts` | `@todo` "Mike gives information longer than allowed"; open product question: a maximum length per free-text field (proposal: no limit) |
| 1 — text longer than allowed: 400 naming each field | `contract/discounts/post-discounts.spec.ts` | the same `@todo` scenario and open question |
| 1 — the same publish request arriving twice creates one discount | `contract/discounts/post-discounts.spec.ts` | `@todo` "Mike's publishing arrives twice"; settled: one publish that arrives twice creates one discount; how is not decided |
| 1 — asked to publish twice before the first answer, publishes once | `unit/frontend/discounts/components/publish-discount-form/publish.spec.ts` | the same `@todo` scenario; recorded only, not built |
| 1 — holds the discount just published without loading the page again | `unit/frontend/stores/discounts-store/publish.spec.ts` | `@todo` "Mike sees the discount he has just published"; settled: not in this slice |
| 1 — publishing from one source throttled | `contract/discounts/post-discounts.spec.ts` | `@todo` "Someone floods the page with discounts"; an open risk, not taken on |

## Out of scope

- The rate's rules (above 0 %, at most 100 %, one decimal place) and their rejections: owned by "Mike publishes
  a discount at any rate up to 100%" and "Mike gives an invalid rate". No rate `CHECK` and no rate precision
  in the schema before `Discount` has the rule (invariant 5).
- Telling Mike what is missing on the page, and the domain's "required" rejections other than blank text:
  owned by "Mike leaves out required information" and "Mike leaves out all the required information". The
  wire's 400 for a missing or mistyped field is here, because the request schema needs it.
- Dependency down (the discounts cannot be stored), including "no `DiscountPublished` for a discount that
  was not kept" and the form keeping what Mike typed: owned by "Mike's discount cannot be published right
  now".
- Two discounts staying published: owned by "Mike's earlier discounts stay published"; the none, one and
  several lines here are the read path's own triangulation.
- The hook (rule 6): owned by Stephanie's slices.
- What "immediately" means for someone with the page already open: settled as the next time they look, which
  the scenario's `Then` checks with a fresh load in a separate browser context; no line and no `@todo`
  scenario.
- Order of the discounts on the page: the page has no sort; no line asserts an order.
- A body sent as other than JSON (`text/plain`, a form encoding): read as a body that is not an object, so the
  non-object 400 line covers it; no separate status chosen.
- Deeply nested JSON: covered by the 413 transport guard and the mistyped-field 400.
- Markup and SQL metacharacters, the non-object body, the invalid JSON body, the oversized body, concurrent
  publishing and caller-chosen ids: technical guards with no persona behind them, so `it.todo` lines without
  a `@todo` scenario.
- Whether the list Mike sees updates after he publishes, without a new load: not in this slice (its line and
  `@todo` scenario are recorded for later). "Immediately" is checked by the scenario's `Then` with a fresh
  page load in a separate browser context.
- A3 inverted: no accounts, so no login, token or privilege lines. `Location: /discounts/<id>` names the
  published discount, but that URI is not served yet: no `GET /discounts/<id>` route is built, because no
  scenario reads one discount. Guessing and enumeration lines arrive with the first slice that acts on a
  discount by its id (changing a rate, at the latest). Throttling is the flooding line, recorded for later.
- A2 command, path and NoSQL sinks: the text reaches no shell, path or document store (n/a).
- Time: no rule of this slice depends on a date or a clock (n/a).
- Preservation and compatibility migration slots: the migration adds a table and moves no data; the walking
  skeleton's greeting lines run on the result through the backward line.
- Index slot: no behaviour of this slice needs an index.
- The Nest controller, the request-rejection pipe and filters and the module wiring: covered by the contract
  lines only, no unit spec and no mock of a concrete service (settled).
- The `EventEmitter2` adapter on its own: covered through the wired app's `DiscountPublished` line, which
  fails on a publisher that does nothing.
- Who observes `DiscountPublished`: nothing reads it yet; the wired-app line listens for it.
- The route the page sits on: the scenario reaches it; the walking skeleton's greeting keeps its own page and
  `should walk` stays green.
- Styling (spacing between an entry's parts, visible borders on the inputs): its own commit with no test,
  checked on the running page.
- Response time and capacity: not stated by the criterion.

## Invariants assumed

1. Every rule emits an event, accepted or rejected: publishing raises `DiscountPublished` inside `Discount`
   (*Design rules* 1, 4). The rejections are the blank-text and length lines, recorded for later.
2. One exception family → one status: a malformed publish (missing or mistyped fields; blank fields once
   recorded lines are built) → 400 naming every offending field at once, never a 500; a body above the
   transport limit → 413. No other family in this slice.
3. Combinations: the conditions are the four pieces (given, blank, too long) and the request's shape. Blank
   and too long make the other pieces irrelevant to the outcome (every offending field is named at once), so
   they are one line per field, not a grid.
4. Round-trip: `discount-kept-in-postgres.spec.ts`.
5. Schemas no stricter than `Discount`: the strictness lines of both endpoints and the tightening line of the
   table.
6. One line per element the view shows or asks for: four fields and the publish action; four parts of an
   entry.
7. New names, none declared yet: `Discount`, `DiscountPublished`, the application service (outlined as
   `DiscountService` with `publish()` and `published()`), `PublishDiscountForm`, `PublishedDiscounts`,
   `DiscountsView`, the discounts store, `POST /discounts`, `GET /discounts`, the `@app/types` schemas, the
   `discounts` table and its migration. A different name moves its spec folder; the lines stay.
8. The backend layout is `packages/backend/src/discounts/{application, application/domain, infra}`; unit
   specs mirror it under `unit/backend/discounts/`. Contract specs sit under `contract/discounts/`.
9. Wire types appear only in the controller layer; the repository speaks domain types only.
10. No identity: nothing records who published a discount (the A6 line).

## Dependencies

None new. `supertest`, `@nestjs/testing`, `@nestjs/event-emitter`, `drizzle-orm`, `pg`, `@vue/test-utils`,
`@pinia/testing` and `vitest-mock-extended` are already in `packages/sut`; `zod` is in `packages/types`.
