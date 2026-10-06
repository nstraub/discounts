# Design

A quick design for the discounts app: a calm, clear tool for small shops. Mike publishes discounts,
Sue browses them and gets a coupon, Stephanie takes coupons at the till, Rodrigo counts discounted
sales. It is a working tool, not a showpiece: quiet surfaces, plain type, one accent.

## Subject

A neighbourhood shop counter: price tags, a till, a coupon torn off a sheet. The one memorable
thing is the price tag: the rate of every discount, and the coupon Sue is given, wear the marigold
of a shelf price tag. Everything else stays quiet.

## Colour

| Name | Hex | Role |
|---|---|---|
| Counter | `#F3F5F4` | page background, a cool grey-green (not cream) |
| Paper | `#FFFFFF` | the surfaces: the list, the forms, the inputs |
| Ink | `#1D2624` | text and borders of inputs (16:1 on paper) |
| Slate | `#56635F` | secondary text: the store and its address (5.9:1 on paper) |
| Shopfront | `#1E5B4F` | buttons, links, focus ring (7.9:1 on paper; white on it 7.9:1) |
| Tag | `#F4C542` | the price tag: the rate and the issued coupon, always with ink text (11:1) |
| Alert | `#A12A2A` | a field's caption saying what is wrong (7:1 on paper) |

Alert is a signal colour, not part of the palette's personality.

## Type

One family, the system's humanist sans (`Seravek, 'Gill Sans Nova', Ubuntu, Calibri, 'DejaVu
Sans', source-sans-pro, sans-serif`): nothing to download, friendly at the till. Roles: body 16 px;
captions 14 px, medium weight; the item 18 px semibold; the coupon code 30 px semibold, wide letter
spacing, tabular figures, so Stephanie can read it off a phone. Rates and counts use tabular figures.
Sentence case everywhere, no all-caps labels.

## Layout

One left-aligned column, at most 42 rem wide, the same on every screen; on a phone it fills the width
with 16 px margins.

Discounts (`#/`):

```
+------------------------------------------+
| Spices  [10%]                            |  the item, its price tag
| Spice Corner · 12 Market St              |  the store, in slate
| Why it is worth a look, in italic        |
| [New rate (%) ____] [Change rate]  [Get a coupon]
|------------------------------------------|  one list, rows divided by a rule
| ...                                      |
+------------------------------------------+
+ - - - - - - - - - - - - - - - - - - - - -+
| Your coupon, to use at Spice Corner      |  the coupon: tag colour, dashed edge
|   7K3QX  9WZ2M                           |
+ - - - - - - - - - - - - - - - - - - - - -+
+------------------------------------------+
| Item ______      Rate (%) ______         |  the publish form: two columns from
| Store name __    Store address __        |  640 px up, one on a phone
| Why it is worth a look (optional) ______ |
| [Publish]   caption of what is wrong     |
+------------------------------------------+
```

Till (`#/till`) and Count (`#/count`): one paper panel holding the form, fields stacked, the button
below, the answer under it in a bordered notice; the count lists each discount as a row: item, rate
tag, "Discounted sales", the number.

## Principles

1. Calm first: one accent (the tag), one action colour (shopfront), no shadows, no gradients, no
   decorative motion.
2. Structure only where it carries meaning: rules divide list rows; the dashed edge says "coupon".
3. Every control is reachable and visible: a 3 px shopfront focus ring on every focusable element,
   44 px tall touch targets, contrast at least 4.5:1, motion off under `prefers-reduced-motion`.
4. The words are the product's (`texts` modules); the design never adds or changes copy.
