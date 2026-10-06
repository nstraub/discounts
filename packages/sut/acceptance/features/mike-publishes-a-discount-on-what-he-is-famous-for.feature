Feature: Mike publishes a discount on what he is famous for

  Scenario: Mike publishes a new discount
    When Mike publishes a discount on an item
    Then people can see it immediately

  @todo
  Scenario Outline: Mike leaves out required information by giving only blank space
    Given Mike tries to publish a discount
    When he gives only blank space for <information>
    Then he is told <information> is missing
    And the discount is not published

    Examples:
      | information              |
      | the item it applies to   |
      | the rate                 |
      | the name of his store    |
      | the address of his store |

  # Whether free text has a maximum length is not settled. The proposal beside the question:
  # no limit, with long text accepted and shown without breaking the page.
  @todo
  Scenario Outline: Mike gives information longer than allowed
    Given Mike tries to publish a discount
    When he gives <information> longer than allowed
    Then he is told <information> is too long
    And the discount is not published

    Examples:
      | information              |
      | the item it applies to   |
      | the name of his store    |
      | the address of his store |

  @todo
  Scenario: Mike publishes a discount written with accents and apostrophes
    When Mike publishes a discount whose item and store are written with accents and apostrophes
    Then people can see it exactly as he wrote it

  @todo
  Scenario: Mike publishes the same discount twice
    Given Mike has published a discount on an item
    When he publishes the same discount again
    Then people can see it twice

  # How a publish that arrives twice is recognised is not settled.
  @todo
  Scenario: Mike's publishing arrives twice
    When Mike publishes a discount on an item and his publishing arrives twice
    Then people can see it once

  @todo
  Scenario: Mike sees the discount he has just published
    When Mike publishes a discount on an item
    Then he can see it without looking again

  # Anyone can publish without an account, so nothing stands in the way of a flood but a limit on speed.
  @todo
  Scenario: Someone floods the page with discounts
    When someone publishes discounts far faster than any store owner would
    Then they are slowed down
    And people can still see every discount published before

  Scenario Outline: Mike publishes a discount at any rate up to 100%
    When Mike publishes a discount of <rate> on an item
    Then people can see it immediately

    Examples:
      | rate  |
      | 20%   |
      | 12.5% |
      | 100%  |

  # Which ways of writing a rate are accepted is not settled. The proposal beside the question: a
  # decimal comma is accepted, the % sign is optional, surrounding spaces are trimmed, a trailing zero
  # names the same rate, and the rate is shown without a needless .0. The last three rows have no
  # proposal yet.
  @todo
  Scenario Outline: Mike writes a rate in another way
    When Mike publishes a discount of <rate> on an item
    Then people can see it at the rate it names

    Examples:
      | rate   |
      | 12,5%  |
      | 20 %   |
      | 20     |
      | 12.50% |
      | .5%    |
      | 05%    |
      | +20%   |

  # A rate such as 33.3 has no exact binary form, so a rate kept as a binary number would drift.
  @todo
  Scenario: Mike publishes a discount at a rate a computer cannot hold exactly
    When Mike publishes a discount of 33.3% on an item
    Then people can see it at exactly that rate

  # Not settled. The proposal beside the question: a rate in a computer's notation is not valid.
  @todo
  Scenario Outline: Mike gives a rate in a computer's notation
    Given Mike tries to publish a discount
    When he gives a rate of <rate>
    Then he is told the rate is not valid
    And the discount is not published

    Examples:
      | rate     |
      | 1e2      |
      | 0x14     |
      | Infinity |

  @todo
  Scenario: Mike gives a rate far longer than any rate
    Given Mike tries to publish a discount
    When he gives a rate far longer than any rate could be
    Then he is told the rate is not valid
    And the discount is not published

  # A discount of 100 % gives the item away, and anyone can get as many coupons for it as they like:
  # a risk for the store owner, with no behaviour proposed.
  @todo
  Scenario: Someone takes coupons by the hundred for a discount of 100%
    Given Mike has published a discount of 100% on an item
    When someone gets coupons for it far faster than anyone deciding to try it would
    Then every coupon they get gives the item away

  @wip
  Scenario: Mike's earlier discounts stay published
    Given Mike has published a discount on an item
    When Mike publishes a discount on another item
    Then people can see both

  @todo
  Scenario: Mike's earlier discount keeps its coupons when he publishes another
    Given Sue has a coupon for Mike's discount
    When Mike publishes a discount on another item
    Then Sue's coupon still applies at Mike's store
