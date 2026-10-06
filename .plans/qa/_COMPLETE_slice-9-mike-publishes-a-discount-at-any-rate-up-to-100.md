# Slice 9: Mike publishes a discount at any rate up to 100% — red-test outline

The acceptance criterion is the scenario outline "Mike publishes a discount at any rate up to 100%" of story 1
in `.plans/mike-new-neighbourhood-epic.md`, read together with the story's rules: 100 % is a valid rate, and a
rate may have one decimal place (12.5 % is valid, 12.25 % is not). Its text, and the cases it leaves implicit,
are appended to `packages/sut/acceptance/features/mike-publishes-a-discount-on-what-he-is-famous-for.feature`,
the feature of story 1: the scenario outline carries `@wip` while it is being built; each case it leaves
implicit is a `@todo` scenario with its steps written and no step definitions.

Files read: `AGENTS.md`, `.plans/mike-new-neighbourhood-epic.md`, `.plans/_IN_PROGRESS_discounts-plan.md`,
`.plans/qa/_COMPLETE_slice-1-mike-publishes-a-new-discount.md`, `.plans/qa/_COMPLETE_slice-5-mike-lowers-a-discount.md`,
the feature of story 1, `packages/sut/acceptance/features/steps/mike-publishes-a-discount.steps.ts`, the method
names of `acceptance/support/discounts-page.ts` and the body of its `verifyShows`, the exports of
`packages/sut/support/example-discounts.ts`, the `describe` and `it` names and the length of the specs this
outline adds to and of `contract/discounts/{post-discounts,post-discounts-hook,rate-as-written-migration}.spec.ts`,
`unit/frontend/discounts/components/publish-discount-form/publish.spec.ts` and
`unit/frontend/stores/discounts-store/publish.spec.ts`, and the exported declarations listed for
"Stephanie redeems a coupon". One template line of `PublishedDiscounts.vue`, the rendering of the rate, was
read; no line rests on it.

## Outlined

No line is built in this slice. The rate is text end to end and no rule on it exists yet, so every example of
the outline (20 %, 12.5 %, 100 %) is published and shown as written by the lines already built for "Mike
publishes a new discount". The scenario is expected to pass as soon as its step definitions exist; a
working-tree break that shows the rate other than as published makes the `Then` fail, and is restored. The
outline is complete once the scenario passes.

| Clause | Covered by (under `packages/sut/`) |
|---|---|
| When Mike publishes a discount of `<rate>` on an item | `unit/frontend/discounts/components/publish-discount-form/publish.spec.ts` ("should publish the item, rate, store name and store address as Mike gave them", "should publish a rate exactly as Mike wrote it, such as 12,5"); `unit/frontend/stores/discounts-store/publish.spec.ts` ("should hand the item, rate, store name and store address over to be published"); `unit/backend/discounts/application/discount-service/publish.spec.ts` ("should keep the discount Mike publishes among the published discounts"); `contract/discounts/post-discounts.spec.ts` ("should publish the item, rate, store name and store address the request gives"); `contract/discounts/rate-as-written-migration.spec.ts` (a rate such as 12,5 kept and loaded back as written) |
| Then people can see it immediately | `unit/frontend/discounts/components/published-discounts/render.spec.ts` ("should show its rate as a percentage"); the existing step, which checks the discount on a page opened by someone else |

The step definition strips the `%` from each example before Mike types it (settled); whether the form accepts
a typed `%` belongs to the open question on ways of writing a rate. The step publishes Mike's example
discount at the example's rate, so each example shows the rate it was published at.

## Recorded for later

10 lines stay `it.todo`.

| Lines | Spec file (under `packages/sut/`) | Owned by |
|---|---|---|
| 4 — a rate with a decimal comma, with or without a percent sign, with spaces around it, with a trailing zero, accepted as the rate it names | `unit/backend/discounts/application/domain/discount/publish.spec.ts` (added) | `@todo` "Mike writes a rate in another way"; open, the proposal beside it: each accepted |
| 1 — a rate shown without a needless .0 | `unit/frontend/discounts/components/published-discounts/render.spec.ts` (added) | the same `@todo` scenario and proposal |
| 1 — a rate written as 1e2, 0x14 or Infinity refused as not valid | `unit/backend/discounts/application/domain/discount/publish.spec.ts` (added) | `@todo` "Mike gives a rate in a computer's notation"; the proposal beside it: not valid; built with "Mike gives an invalid rate" |
| 1 — a rate of 33.3 kept and loaded back exactly | `contract/discounts/discount-kept-in-postgres.spec.ts` (added) | `@todo` "Mike publishes a discount at a rate a computer cannot hold exactly"; it holds while the rate is text and guards the choice of its type |
| 1 — rates published before the rate rules read back as written | the same file | a technical guard with no persona behind it; built with "Mike gives an invalid rate". If that slice adds a migration, the line becomes its Preservation line and moves to that migration's spec; if the column stays text, a line at `GET /discounts` joins it: a rate kept before the rules is still answered (settled) |
| 1 — a rate sent as a JSON number answered 400 naming the rate or published, never a 500 | `contract/discounts/post-discounts-rate.spec.ts` (new) | a technical guard with no persona behind it (settled); in a spec of its own because `post-discounts.spec.ts` is near 200 lines |
| 1 — a rate of 10 000 characters answered 400 naming the rate | the same file | `@todo` "Mike gives a rate far longer than any rate"; not valid by the rate rule itself, the transport limit staying a separate guard (settled) |

The `@todo` scenario "Someone takes coupons by the hundred for a discount of 100%" has no line: it records a
risk with no behaviour proposed (settled).

## Out of scope

- Invalid rates (150 %, 100.5 %, 12.25 %, 0 %, −10 %) and the tightest off-point above 100 %: owned by "Mike
  gives an invalid rate".
- A rate that is not a number: not valid, an example of "Mike gives an invalid rate" (settled).
- The rate's type, its value object and the domain's rate rules: arrive with "Mike gives an invalid rate", the
  first scenario where a rule decides (settled).
- The rows `.5%`, `05%` and `+20%` of the open question: no proposal yet, so no line until it is answered.
- Unlimited coupons at 100 %: an open risk, no line (settled).
- A2 injection: the rate reaches the database through the repository's parameters, as the publish lines show
  for text (n/a).
- A3, A4, A5: the surface is the publish route already covered by "Mike publishes a new discount" (n/a).
- Time: no rule of this slice depends on a date or a clock (n/a).
- Migration slots: no schema change.

## Invariants assumed

1. Every rule emits an event: no new rule; publishing raises `DiscountPublished` as before.
2. One exception family → one status: no new family is built; a rate not valid → 400 naming the rate
   (recorded).
3. Combinations: the rate's value × the rest of the discount gives no distinct outcome while no rule reads it.
4. Round-trip: a discount kept and loaded back, built; 33.3 exactly, recorded.
5. Schemas no stricter than `Discount`: the rate is text in the request, the response and the column, as
   `Discount` holds it.
6. One line per element the view shows or asks for: no new element.
7. No new names.
8. No identity: nothing records who published a discount.

## Dependencies

None new.
