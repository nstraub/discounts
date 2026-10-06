# Slice 4: Stephanie tells people what is new about her produce — red-test outline

The acceptance criterion is the scenario "Stephanie tells people what is new about her produce" of story 1 in
`.plans/stephanie-comeback-epic.md`, read together with the epic's rule that a discount may carry a hook: one
optional free-text field where the store says why it is worth a look. Its text, and the cases it leaves
implicit, are in `packages/sut/acceptance/features/stephanie-gets-her-produce-discount-into-peoples-hands.feature`,
the feature of story 1 (new): the scenario carries `@wip` while it is red; each case it leaves implicit is a
`@todo` scenario with its steps written and no step definitions, and is also an `it.todo` line below. The
story's second scenario, "Sue decides to try Stephanie's produce", is not in the file yet.

Files read: `AGENTS.md`, `.plans/stephanie-comeback-epic.md`, `.plans/_IN_PROGRESS_discounts-plan.md`,
`.plans/regime.md`, `.plans/qa/slice-3-mike-raises-a-discount.md`, the three feature files, the step patterns
under `packages/sut/acceptance/features/steps/` and `acceptance/support/discounts-page.ts`,
`packages/sut/cucumber.js`, `packages/sut/support/example-discounts.ts`, the arrange of
`contract/discounts/{discounts-table,rate-as-written}-migration.spec.ts`, the `describe` and `it` names of every
spec under `packages/sut/unit` and `packages/sut/contract`, the migration journal's tags, and the exported
declarations of `packages/backend/src/discounts/**`, `packages/types/{discounts,rest-api}.ts`,
`packages/frontend/src/stores/discounts-store.ts`, `packages/frontend/src/discounts/{texts,typed-discount}.ts`
and the props of `packages/frontend/src/discounts/components/*.vue`. No implementation body was read.

## Outlined

37 `it.todo` lines: 29 are built in this slice (the table below); 8 are recorded for later and stay `it.todo`
(*Recorded for later*). Two spec files are new; lines for twelve existing spec files are added inside each
file's top-level `describe`, in groups of their own; no existing line is changed or removed.

| Lines | Criterion or case | Found by | Spec file (under `packages/sut/`) |
|---|---|---|---|
| 2 — `DiscountPublished` carries its hook; carries no hook when it has none | the scenario; *Design rules* 4 (the event raised inside `Discount`) | edge-case-discovery (empty: present, absent) | `unit/backend/discounts/application/domain/discount/publish.spec.ts` (added) |
| 1 — keeps its hook when its rate changes | a discount with a hook × a change of its rate: only the rate changes | edge-case-discovery (combination) | `unit/backend/discounts/application/domain/discount/change-rate.spec.ts` (added) |
| 2 — holds the hook it was created with; holds no hook when created without one | the hook is part of the Discount aggregate | edge-case-discovery (empty) | `unit/backend/discounts/application/domain/discount-factory/create.spec.ts` (added) |
| 1 — rebuilds a kept discount with its hook | loading a discount with a hook | database-testing (the load side of the round-trip) | `unit/backend/discounts/application/domain/discount-factory/reconstitute.spec.ts` (added) |
| 2 — publishes the hook given and answers with it; answers with no hook when none is given | the scenario; no hook on the wire is an absent key (settled) | api-testing (success); edge-case-discovery (empty) | `contract/discounts/post-discounts-hook.spec.ts` (new) |
| 2 — lists a discount with its hook; lists one published without a hook with no hook | the page reads the hook from the list | api-testing (success) | `contract/discounts/get-discounts.spec.ts` (added) |
| 1 — a discount with a hook saved and loaded back equal | invariant 4 | database-testing (round-trip) | `contract/discounts/discount-kept-in-postgres.spec.ts` (added) |
| 2 — a hook with quotes, semicolons and SQL keywords, and one with accents, apostrophes and emoji, kept verbatim | free text from anyone reaches the database | adversarial-testing (A2); edge-case-discovery (type) | same file |
| 1 — a discount without a hook accepted: the nullable column mirrors "a discount may carry a hook" | the hook is optional | database-testing (constraint) | `contract/discounts/discount-constraints-in-postgres.spec.ts` (added) |
| 4 — Forward; Backward, lossy (every hook is lost); Preservation (a discount kept before reads back with no hook); Compatibility (the deployed version's round-trip on the migrated table) | the hook column is a new migration; a nullable column is itself the expand step (settled) | database-testing (migration slots) | `contract/discounts/discount-hook-migration.spec.ts` (new) |
| 1 — asks for the hook under its caption | Stephanie writes the hook when she publishes, under the caption `Why it is worth a look (optional)` from the feature's texts module (settled); invariant 6 | edge-case-discovery | `unit/frontend/discounts/components/publish-discount-form/render.spec.ts` (added) |
| 3 — publishes the hook as given; publishes no hook when it is left empty; clears the hook once published | the scenario; Mike publishes with no hook through the same form | edge-case-discovery (empty) | `unit/frontend/discounts/components/publish-discount-form/publish.spec.ts` (added) |
| 1 — publishes a hook of only blank space as no hook (built after review, finding F1; recorded before) | blank counts as no hook (settled); `@todo` "Stephanie gives only blank space for what is new" | edge-case-discovery (empty) | `unit/frontend/discounts/components/publish-discount-form/publish.spec.ts` (added) |
| 1 — hands the hook over to be published with the rest | the page reaches the publish through the store | edge-case-discovery | `unit/frontend/stores/discounts-store/publish.spec.ts` (added) |
| 4 — shows its hook; shows only the four pieces with no empty place when it has none; each hook on its own entry, the entry without one showing none; shown without surrounding spaces | the scenario ("she sees what is new about its produce" on the store found); a discount without a hook shows nothing (settled, built); shown text is trimmed (settled); invariant 6 | edge-case-discovery (empty, combination) | `unit/frontend/discounts/components/published-discounts/render.spec.ts` (added) |
| 1 — a hook written as markup shown as plain text | free text from anyone shown on a public page | adversarial-testing (A2) | same file |

The step definitions read the two Givens as one publication: "Given Stephanie has published a discount on
produce" publishes, through the page, a produce discount of Stephanie's store whose hook says the produce
comes from a new supplier; "And her discount says the produce comes from a new supplier" names which hook the
later step expects. A hook cannot be changed after publishing (settled), so the second Given cannot set one on
a discount already published. "Then she finds Stephanie's store" is the existing "she finds Mike's store" step
with the owner as a parameter; "she sees what is new about its produce" looks inside the entry of the store
found, so a hook shown on another entry fails it. The example values (a produce discount of Stephanie's store
and its hook) stay out of the Gherkin.

The two earlier migration specs list the migrations after their own (`theMigrationsAfterIt`); the hook's
migration joins those lists.

## Recorded for later

8 lines stay `it.todo`, each with its `@todo` scenario.

| Lines | Spec file (under `packages/sut/`) | Owned by |
|---|---|---|
| 1 — a hook empty or made only of blank space counts as no hook | `unit/backend/discounts/application/domain/discount/publish.spec.ts` | `@todo` "Stephanie gives only blank space for what is new"; settled: blank means no hook |
| 1 — a hook longer than allowed refused | the same file | `@todo` "Stephanie says more about what is new than allowed"; open question, the proposal beside it: no limit |
| 1 — no hook published when it is null, empty or only blank space | `contract/discounts/post-discounts-hook.spec.ts` | `@todo` "Stephanie gives only blank space for what is new"; settled: each means no hook |
| 1 — 400 naming the hook when it is a number, an array or an object, never a 500 | the same file | `@todo` "What is new is sent as something other than text"; the proposal beside it: not valid, never a 500 |
| 1 — 400 naming the hook when it is longer than allowed | the same file | `@todo` "Stephanie says more about what is new than allowed" |
| 1 — the hook a change request carries left unused | `contract/discounts/patch-discounts-id.spec.ts` | `@todo` "A change to a discount's rate carries something else to say"; settled: ignored |
| 1 — line breaks in a hook kept | `unit/frontend/discounts/components/published-discounts/render.spec.ts` | `@todo` "Stephanie says what is new on several lines"; open question, the proposal beside it: keep them |
| 1 — a web address in a hook shown as plain text, never as a link | the same file | `@todo` "What is new names a web address"; settled: never a link |

Known gaps among these: a hook that is `null` is answered by whatever the request schema says until its line
is built — a 400 if the schema takes the hook as optional text, where the settled reading is "no hook"; a hook
that is `""` or only blank space sent to the API is kept as sent and shown as an empty or blank place on its entry.

The `@todo` scenarios "Sue finds a discount that says nothing new", "Sue sees what is new only about the store
that said it", "Stephanie says what is new with accents and apostrophes", "What is new is written as code" and
"A discount keeps what it says when its rate changes" are the acceptance-level record of cases whose lines are
built above.

## Out of scope

- Changing or removing a hook after publishing: settled, no case is written; a persona who tells it brings its
  own story.
- What a hook may say (a false claim, a claim about another store): anyone can act for any store (settled);
  what a discount says is the publisher's, a product question, not a line.
- Getting a coupon from the discount: owned by "Sue decides to try Stephanie's produce".
- A new strictness line: the existing GET strictness line already publishes a discount without a hook and fails
  if the schema requires one; the existing publish lines, all without a hook, fail if the request schema
  requires one (settled).
- `DiscountService` and the controller: they pass the details through whole; the contract lines cover the hook
  from request to list.
- The store loading the list: it holds the response as answered; the GET and component lines cover the hook.
- The factory keeping accented text: it transforms no text, as the four pieces' line shows; the database lines
  keep it verbatim.
- A discount without a hook loaded back: the existing round-trip line, which keeps no hook, fails if no hook
  comes back as anything but absent.
- A3 handle guessing: the slice adds no handle (n/a); A4 concurrency: publishing at once is pinned by the
  existing publish lines, and the hook adds no shared state (n/a); A5 oversized body: the transport limit is
  application-wide and pinned by `POST /discounts`.
- Time: no rule of this slice depends on a date or a clock (n/a).
- An index: no behaviour looks discounts up by their hook (n/a).
- Accessibility of the hook: under the open accessibility question recorded with the page.
- Styling of the hook on its entry: its own commit, no test.

## Invariants assumed

1. Every rule emits an event: publishing raises `DiscountPublished`, carrying the hook or no hook; the hook's
   rejections (wrong type, too long) are recorded for later.
2. One exception family → one status: a malformed hook → 400 naming the hook (recorded); no new family is
   built.
3. Combinations: a discount with a hook × one without on the same page; a hook × a change of rate. Other
   conditions make the rest irrelevant.
4. Round-trip: a discount with a hook, saved and loaded back; without one, the existing line.
5. Schemas no stricter than `Discount`: the hook optional in the publish request and the discount response.
6. One line per element the view shows or asks for: the hook asked for on the form; the hook shown on its entry.
7. No hook is an absent key on the wire and in the aggregate's state, never `null` (settled).
8. New names, none declared yet: the hook on `DiscountDetails`, `Discount` and `DiscountPublished`, in
   `publishDiscountRequest` and `discountResponse`, the `hook` column, its migration, the hook's field and
   caption on `PublishDiscountForm` with its text in `discountTexts`, the hook on an entry of
   `PublishedDiscounts`. A different name moves its line; the lines stay.
9. Wire types appear only in the controller layer; the repository speaks domain types only; one repository,
   for `Discount`.
10. No identity: nothing records who wrote a hook.

## Dependencies

None new.
