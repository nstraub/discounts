# Brief: Sue looks for a store with fresh produce (epic and its stories)

cwd: ~/src/discounts

The neighbour's epic. Discounts is a self-contained showcase, so the epic was written by the dev-team
orchestrator from nico's guidelines (2026-09-27), as practice for interviewing a real user; nico played
Sue. Stories are system-agnostic: each tells what the persona already does, and why. Whether our
software solves a story is marked on it. Mike's epic: `.plans/mike-new-neighbourhood-epic.md`.

## nico's guidelines (verbatim)

> make it for Sue, a 57-year-old lady who doesn't like spicy food, due to a chronic condition (you
> specify it, I don't know which chronic conditions preclude the use of spices). She is however, quite
> dissatisfied with the quality of produce in the stores around her, but has to put up with it,
> because the farmer's market is too far away for her to go every week

> sue is always looking for a store with new produce. that's our epic.

## The epic

Sue is 57 and has lived in the neighbourhood for more than twenty years. About ten years ago she was
diagnosed with chronic acid reflux (GERD), and her doctor told her to stay away from spicy food: a meal
with chilli or a strong spice mix means a night of heartburn. So she cooks plain — vegetables, a bit of
chicken or fish, herbs from the pots on her windowsill. That puts produce at the centre of her kitchen,
and the produce around her is poor: the two grocery stores within walking distance sell tomatoes that
are pale and mealy, lettuce that wilts the day after she buys it, fruit that goes soft before it
ripens. The farmer's market has what she wants, but it is across town — two buses each way, her whole
Saturday morning — so she gets there about once a month, when her daughter can drive her. The rest of
the time she buys what the local stores have, throws away more than she would like, and plans her meals
around whatever looks least tired. She is always on the lookout for a store with better produce: she
reads the flyers that come through her letterbox, and on Tuesdays, when she walks to the pharmacy, she
looks at the shop windows along the way. She has lived on a fixed income since she stopped working, so
a better store would have to be close, and not much dearer than what she pays now.

## What Sue told us (verbatim, nico playing Sue, 2026-09-27)

1. How she finds out about a new store today: "I don't." (nico: she does not look for new stores in
   particular.)
2. What would make her try one: "I'm not too much of an adventurer, but if the produce looks better
   than the slop I get from the store today, I'll gladly try it out, as long as it's not too much more
   expensive than what I currently pay"
3. A discount on produce, or produce that is fresh: "I answered that already..."
4. Whether a store known for spices puts her off: "not really, as long as the produce is fresh, I can
   steer clear of the spices on my own, thank you very much" (the question offended her slightly)
5. What "close" means: "I can only really walk until my back starts to hurt, so it needs to be close
   by"

## The stories

### 1. Sue finds a produce discount at a store close to home — solve

Looking, as always, for better produce, Sue comes across a discount on produce at a store she has not
tried; with the discount it costs about what she pays now. If the store is close enough to walk to
before her back starts to hurt, she goes to see whether the produce is as good as it looks. We solve
her coming across the discount and knowing which store it is at and where; judging whether the
produce is fresh she does with her own eyes, in the store.

#### Acceptance criteria

Rules for this slice (nico, 2026-09-27): every published discount is shown, from every store, each
with its store's name and address; Sue works out for herself which store is near her. Showing the
stores near her first is a later slice, and how the product would know where she is is left to that
slice's own conversation. No filter separates spices from produce (Sue: "I can steer clear of the
spices on my own"). Coupons do not exist at this point; they come with the epic of the store owner who
tracks coupons. The scenario with more than one store uses Stephanie, the store owner of
`.plans/stephanie-comeback-epic.md` ("\"another store\" is not a persona"); a scenario where Sue finds nothing is outside this feature ("the feature
name is \"Sue find a produce discount close to home\", not \"Sue doesn't find [one]\"").

```gherkin
Feature: Sue finds a produce discount close to home

  Scenario: Sue finds a discount on produce
    Given Mike has published a discount on produce
    When Sue looks for a new store with fresh produce
    Then she finds Mike's store
    And she sees the discount it offers

  Scenario: Sue finds a store close to home
    Given Mike's store is within walking distance of Sue's home
    When Sue looks for a new store with fresh produce
    Then she finds Mike's store
    And she sees where it is
    And she sees the discount it offers

  Scenario: Sue finds more than one store
    Given Mike and Stephanie have published discounts on produce
    When Sue looks for a new store with fresh produce
    Then she finds Mike's store and Stephanie's store
    And she sees the discount each one offers
```

### 2. Sue cooks plain because of her reflux — told, not solved

It is why produce is the centre of her kitchen, and why the spices in a store are not her concern.

### 3. Sue puts up with the stores she can walk to — told, not solved

We cannot change those stores; her complaint about them is what makes her look.

### 4. Sue goes to the farmer's market once a month with her daughter — told, not solved

It sets the bar the produce she finds has to meet.
