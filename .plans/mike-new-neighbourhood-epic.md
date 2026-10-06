# Brief: Mike opens a store in a new neighbourhood (epic and its stories)

cwd: ~/src/discounts

The first epic of discounts, as the user told it (nico, 2026-09-27), and the stories inferred from it.
The epic is the user's story, verbatim; its details are the context for what we build and why, even
where they inform no feature. Stories are system-agnostic: each tells what the persona already does,
and why. Whether our software solves a story is marked on it.

## The epic (verbatim)

> Mike has been a grocery store owner for 20 years. He is opening his third store in a neighbourhood
> where he already has competition. why did he pick this neighbourhood? the competition usually only
> sells Chilean spices and herbs, and the produce is rarely fresh. He is Peruvian, and his grocery
> stores are well know for the spices he sells, which are delicious. Still, he is unknown in the
> neighbourhood, and he needs to ramp up sales fast, so his new store can be in the blue by the end of
> its first year. to do this, he defines a discount for relevant products: 20% for spices and 10% for
> produce. when it comes to the produce discount, he can't really go lower, because at 10% discount,
> he is selling at cost. when it comes to spices, he could increase the discount to 30%, but could
> also use the margin, so he starts off at 20% and monitors its performance. if he sells less spices
> than expected, then he will increase the discount to 25% and later to 30% if he determines 25% is
> not enough

## What Mike told us (verbatim, 2026-09-27)

1. How he announces a discount today: "I have never done this before, my other stores got known by
   word of mouth. Whenever I have offered a discount, I've put a sign up front that tells
   passers-by, and that's about it"
2. Where it hurts: "I don't know where it hurts"
3. How he measures: "I look at the basket every Sunday. if I need to ask more from the supplier (my
   wife), I've had a good week of sales"
4. His limits: "idk, if it needs to be more it'll be more" (out of scope for this epic; it tells us
   only that a discount can be changed)
5. Who buys spices: "usually, people between 30 and 50 buy the spices. I have some customers over 50,
   but most of them are people who have been buying the stuff for years"

## The stories

### 1. Mike makes his new store known with a discount on what he is famous for — solve

Nobody in the new neighbourhood knows Mike yet, and his other stores took years of word of mouth to
get known; this time he cannot wait that long. So he picks what he is famous for — his Peruvian spices
and his fresh produce — takes 20 % off the spices and 10 % off the produce, and puts a sign out front
so the people walking past see it. The spices are why anyone should come to him rather than to the
store that sells only Chilean ones; the produce shows them his is fresh where theirs rarely is.

#### Acceptance criteria

The per-field outline ("Mike leaves out required information") is kept for now; whether a field per
example row leaks detail is unsettled (nico, 2026-09-27). Rules for this epic: 100 % is a valid rate,
decimal rates are allowed with one decimal place (12.5 % is valid, 12.25 % is not), the item a discount applies to is free text, and a discount names its store
and the store's address (the address added by Sue's epic, 2026-09-27).
"People can see it" is checked in the step definitions, on the sparsest possible page of published
discounts (item, rate, store and its address, nothing else); how people look for discounts is shaped by
Sue's epic, `.plans/sue-fresh-produce-epic.md` (nico, 2026-09-27).
Page behaviour settled for component tests, not scenarios (nico, 2026-09-27): with nothing published
the page says so in one short line; after publishing, the form clears and stays, ready for the next
discount.

```gherkin
Feature: Mike publishes a discount on what he is famous for

  Scenario: Mike publishes a new discount
    When Mike publishes a discount on an item
    Then people can see it immediately

  Scenario: Mike's earlier discounts stay published
    Given Mike has published a discount on an item
    When Mike publishes a discount on another item
    Then people can see both

  Scenario Outline: Mike publishes a discount at any rate up to 100%
    When Mike publishes a discount of <rate> on an item
    Then people can see it immediately

    Examples:
      | rate  |
      | 20%   |
      | 12.5% |
      | 100%  |

  Scenario Outline: Mike gives an invalid rate
    Given Mike tries to publish a discount
    When he gives a rate of <rate>
    Then he is told the rate is not valid
    And the discount is not published

    Examples:
      | rate   |
      | 150%   |
      | 100.5% |
      | 12.25% |
      | 0%     |
      | -10%   |

  Scenario Outline: Mike leaves out required information
    Given Mike tries to publish a discount
    When he leaves out <information>
    Then he is told <information> is missing
    And the discount is not published

    Examples:
      | information            |
      | the item it applies to |
      | the rate               |
      | the name of his store  |
      | the address of his store |

  Scenario: Mike leaves out all the required information
    Given Mike tries to publish a discount
    When he leaves out all the required information
    Then he is told everything that is missing
    And the discount is not published

  Scenario: Mike's discount cannot be published right now
    Given discounts cannot be published right now
    When Mike publishes a discount on an item
    Then he is told it could not be published and to try again
    And the discount is not published
```

The last scenario was added by nico on 2026-09-27 (the QA outline's "dependency down" case): Mike
publishing while the discounts cannot be stored.

### 2. Mike raises a discount that is not working — solve, in its smallest form (the rate changes)

One Sunday the spice basket is still nearly full and he does not need to ask his wife to order more.
He has margin to spare on spices, and staying unknown costs him more than that margin, so he raises
the spice discount to 25 % and repaints the sign. If a few more Sundays go by and the basket still
does not empty, he goes to 30 %. He leaves the produce alone: at 10 % he is already selling at cost.

#### Acceptance criteria

Only the rate changes, under story 1's rules (above 0 %, at most 100 %, one decimal place). Lowering a discount is an acceptance criterion here, not a story of its own:
Mike never told a story about lowering, so a story would invent his motive, while the action is the
same one and forbidding it would be a business rule nobody stated. Coupons do not exist yet at this
point of the epic (nico, 2026-09-27).

```gherkin
Feature: Mike raises a discount that is not working

  Scenario: Mike raises a discount
    Given Mike has published a discount on an item
    When he raises its rate
    Then people can see the new rate immediately

  Scenario: Mike lowers a discount
    Given Mike has published a discount on an item
    When he lowers its rate
    Then people can see the new rate immediately

  Scenario: Mike's other discounts keep their rates
    Given Mike has published discounts on two items
    When he raises the rate of one of them
    Then people can see the new rate on that discount only

  Scenario Outline: Mike gives an invalid new rate
    Given Mike has published a discount on an item
    And he tries to change its rate
    When he gives a rate of <rate>
    Then he is told the rate is not valid
    And the discount keeps its previous rate

    Examples:
      | rate   |
      | 150%   |
      | 100.5% |
      | 12.25% |
      | 0%     |
      | -10%   |

  Scenario: Mike leaves out the new rate
    Given Mike has published a discount on an item
    And he tries to change its rate
    When he leaves out the rate
    Then he is told the rate is missing
    And the discount keeps its previous rate
```

### 3. Mike checks how the week went — told, not solved

Every Sunday Mike looks at the spice basket. If he has to ask his wife for more stock, it was a good
week; if he does not, the discount is not bringing people in. That is all the measuring he needs, and
it is what tells him whether to do story 2. Told because story 2 depends on it; not solved, because
his basket already works for him and he names nothing about it that hurts.

### 4. Mike picks the neighbourhood — told, not solved

Before opening, Mike looks for a place where the competition is weak exactly where he is strong: they
sell only Chilean spices, and their produce is rarely fresh. That is why he believes discounts on
spices and produce will work there. It sets the scene for the epic; nothing in it asks for our help.

### 5. Mike sees the discount he has just put out — solve, not yet sliced

When Mike puts a sign up front, it is there in front of him as soon as it is up, the way the people
walking past will see it. A discount he publishes is the same for him: once it is out, he sees it
among his discounts without going to look for them again.

Open question for Mike: once your sign is up, do you look at it again, and what for? (His answer
may change how this story is told; what follows does not depend on it.)

#### Acceptance criteria

Not the same as story 1's "people can see it immediately", which is checked the next time anyone
looks: this is Mike's own view, right after he publishes.

```gherkin
  Scenario: Mike sees the discount he has just published
    When Mike publishes a discount on an item
    Then he can see it without looking again
```

Recorded, not yet built: the scenario above is tagged `@todo` in
`packages/sut/acceptance/features/mike-publishes-a-discount-on-what-he-is-famous-for.feature`, and
the line `should hold the discount just published without loading the page again` is an `it.todo` in
`packages/sut/unit/frontend/stores/discounts-store/publish.spec.ts`. Both belong to this story, not to
story 1, until it is sliced.

## Not written

1. Staying within his margin — out of scope; all it tells us is in story 2 (a discount can be
   changed; produce stays where it is).
2. The neighbour's story — a person of 30 to 50 who lives nearby and does not know Mike yet. Why they
   would take a discount from a store they have never been to is theirs to tell.
