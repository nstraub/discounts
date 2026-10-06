# Slice 5: Mike lowers a discount — red-test outline

The acceptance criterion is the scenario "Mike lowers a discount" of story 2 in
`.plans/mike-new-neighbourhood-epic.md`, read together with the story's rules: only the rate changes, under
story 1's rules (above 0 %, at most 100 %, one decimal place); lowering is the same action as raising, and
forbidding it would be a business rule nobody stated. Its text, and the case it leaves implicit, are appended
to `packages/sut/acceptance/features/mike-raises-a-discount-that-is-not-working.feature`, the feature of story
2: the scenario carries `@wip` while it is being built; the case it leaves implicit is a `@todo` scenario with
its steps written and no step definitions, and is also an `it.todo` line below.

Files read: `AGENTS.md`, `.plans/mike-new-neighbourhood-epic.md`, `.plans/_IN_PROGRESS_discounts-plan.md`,
`.plans/qa/_COMPLETE_slice-3-mike-raises-a-discount.md`,
`.plans/qa/_COMPLETE_slice-2-sue-finds-a-discount-on-produce.md`, the feature of story 2,
`packages/sut/acceptance/features/steps/mike-raises-a-discount.steps.ts`, and the `describe` and `it` names of
the change-of-rate specs listed below. No implementation body was read.

## Outlined

No line is built in this slice. Changing a rate does not depend on its direction, and every clause of the
scenario is already covered by a line built for "Mike raises a discount", so the scenario is expected to pass
as soon as its step definitions exist; a working-tree break of the change (the rate left as it was) shows the
`Then` failing, and is restored.

| Clause | Covered by (under `packages/sut/`) |
|---|---|
| Given Mike has published a discount on an item | the existing step of "Mike raises a discount" |
| When he lowers its rate | `unit/frontend/discounts/components/change-rate-form/change.spec.ts` ("should change the rate of its own discount to the rate Mike gives"); `unit/frontend/stores/discounts-store/change-rate.spec.ts` ("should hand the discount and its new rate over to be changed"); `unit/backend/discounts/application/discount-service/change-rate.spec.ts` ("should keep the discount named at its new rate"); `unit/backend/discounts/application/domain/discount/change-rate.spec.ts` ("should hold the new rate once its rate is changed"); `contract/discounts/patch-discounts-id.spec.ts` ("should answer 204 with no body when the rate is changed"); `contract/discounts/discount-kept-in-postgres.spec.ts` ("should save a discount at a changed rate and load it back equal") |
| Then people can see the new rate immediately | `contract/discounts/patch-discounts-id.spec.ts` ("should list the discount once, at its new rate, after the change"); `unit/frontend/stores/discounts-store/change-rate.spec.ts` ("should hold the discount at its new rate once the change succeeds"); the existing step, with the lowered rate |

The lowered rate the step definition gives is one whose text sorts after the published one (20 % lowered to
5 %), so a rule that compared rates as text instead of as numbers would fail the scenario.

## Recorded for later

1 line stays `it.todo`, with its `@todo` scenario; none is built in this slice.

| Lines | Spec file (under `packages/sut/`) | Owned by |
|---|---|---|
| 1 — a new rate of 0.1 %, the lowest a rate may be, accepted | `unit/backend/discounts/application/domain/discount/change-rate.spec.ts` (added, a group of its own inside the top-level `describe`) | `@todo` "Mike lowers a discount to the lowest rate allowed"; the other side of the 0 % that "Mike gives an invalid new rate" refuses, and built with it |

## Out of scope

- A new rate of 0 % or below: owned by "Mike gives an invalid new rate"; a new rate left out: "Mike leaves out
  the new rate".
- Lowering to a rate with one decimal place, such as 12.5 %: settled valid, and a rate is kept exactly as
  written by the lines built for raising.
- Lowering and raising again, or lowering to the rate it already has: the same change twice and the
  same-rate case, owned by the lines built and recorded for raising.
- Other discounts keeping their rates: owned by "Mike's other discounts keep their rates".
- A discount with a hook keeping it when its rate is lowered: the hook's line for a change of rate covers
  either direction.
- Coupons already handed out for a discount whose rate is lowered: coupons do not exist at this point of the
  epic; what a coupon applies at the till is the coupon scenarios' to settle.
- Anyone lowering any discount: settled, anyone can act for any store; there is no key and nothing records
  who changed what. Throttling of changes is recorded with raising.
- A2 injection, A4 concurrency, A5 resource exhaustion: the same surface as raising, whose lines and records
  hold for either direction (n/a here).
- Time: no rule of this slice depends on a date or a clock (n/a).
- Migration slots: no schema change.

## Invariants assumed

1. Every rule emits an event: lowering raises `DiscountRateChanged`, as raising does; no new rule.
2. One exception family → one status: no new family.
3. Combinations: the direction of a change × everything else gives no distinct outcome; the boundary at the
   lowest rate is recorded.
4. Round-trip: a discount at a changed rate, built for raising, holds for any new rate.
5. Schemas no stricter than `Discount`: unchanged.
6. One line per element the view shows or asks for: no new element; lowering uses the control built for
   raising.
7. No new names.
8. No identity: nothing records who lowered a rate.

## Dependencies

None new.
