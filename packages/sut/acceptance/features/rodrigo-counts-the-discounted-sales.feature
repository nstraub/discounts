Feature: Rodrigo counts the discounted sales

  @wip
  Scenario: Rodrigo counts the discounted sales since his last count
    Given Rodrigo has counted Stephanie's discounted sales before
    And Sue has used 3 coupons for Stephanie's discount since then
    When Rodrigo counts the discounted sales
    Then he sees 3 discounted sales for that discount

  @todo
  Scenario: A coupon got but not used is not a discounted sale
    Given Rodrigo has counted Stephanie's discounted sales before
    And Sue has used 3 coupons for Stephanie's discount since then
    And her neighbour has got a coupon for Stephanie's discount without using it
    When Rodrigo counts the discounted sales
    Then he sees 3 discounted sales for that discount

  @todo
  Scenario: A coupon got before the last count and used after it is counted
    Given Sue has a coupon for Stephanie's discount
    And Rodrigo has counted Stephanie's discounted sales since
    And Sue has used her coupon since then
    When Rodrigo counts the discounted sales
    Then he sees 1 discounted sale for that discount

  @todo
  Scenario: Another store's discounted sales wait for that store's count
    Given Sue has used a coupon for Stephanie's discount and one for Mike's
    When Rodrigo counts Stephanie's discounted sales
    Then he sees 1 discounted sale for Stephanie's discount
    And Mike's discounted sale is still to be counted

  @todo
  Scenario: Rodrigo's count shows no coupon codes
    Given Rodrigo has counted Stephanie's discounted sales before
    And Sue has used 3 coupons for Stephanie's discount since then
    When Rodrigo counts the discounted sales
    Then he sees none of Sue's coupon codes

  # Whether a count made by anyone else restarts Rodrigo's count is a question for Rodrigo that is
  # still open. The proposal beside it: a count is the store's, whoever makes it.
  @todo
  Scenario: Someone else counts Stephanie's discounted sales before Rodrigo does
    Given Rodrigo has counted Stephanie's discounted sales before
    And Sue has used 3 coupons for Stephanie's discount since then
    And Stephanie has counted the discounted sales since
    When Rodrigo counts the discounted sales
    Then he sees only the discounted sales since Stephanie's count

  # What tells Rodrigo which discount a number is for is a question for Rodrigo that is still open.
  # The proposal beside it: the discount's item and its rate.
  @todo
  Scenario: Rodrigo tells which discount each number is for
    Given Rodrigo has counted Stephanie's discounted sales before
    And Sue has used 3 coupons for Stephanie's discount since then
    When Rodrigo counts the discounted sales
    Then he sees the item and the rate of the discount the number is for

  # Whether a discount with no sales since the last count is shown is a question for Rodrigo that is
  # still open. The proposal beside it: it is shown, with no sales counted.
  @todo
  Scenario: A discount nobody used a coupon for since the last count
    Given Stephanie has discounts on fruit and on vegetables
    And Sue has used a coupon for the fruit since Rodrigo's last count
    When Rodrigo counts the discounted sales
    Then he sees no discounted sales for the vegetables

  # Whether counting twice by mistake loses the first count's numbers is a question for Rodrigo that
  # is still open. The proposal beside it: the page counts once and shows that count.
  @todo
  Scenario: Rodrigo counts twice before the first count answers
    Given Rodrigo has counted Stephanie's discounted sales before
    And Sue has used 3 coupons for Stephanie's discount since then
    When Rodrigo counts the discounted sales twice before the first count answers
    Then he sees 3 discounted sales for that discount

  # Which store's count includes a coupon taken at another store's till is a question for Rodrigo
  # that is still open. The proposal beside it: the store of the coupon's discount, since the
  # redemption belongs to that discount.
  @todo
  Scenario: A coupon taken at another store's till
    Given Rodrigo has counted Stephanie's discounted sales before
    And Sue has used a coupon for Stephanie's discount at Mike's store since then
    When Rodrigo counts the discounted sales
    Then he sees 1 discounted sale for Stephanie's discount

  # The page offers only stores someone has published a discount at, so this is reached only from
  # outside the page.
  @todo
  Scenario: Rodrigo counts a store nobody published a discount at
    When Rodrigo counts the discounted sales of a store nobody published a discount at
    Then he is told there is no such store

  @todo
  Scenario: The discounted sales cannot be counted right now
    Given Rodrigo has counted Stephanie's discounted sales before
    And Sue has used 3 coupons for Stephanie's discount since then
    And the discounted sales cannot be counted right now
    When Rodrigo counts the discounted sales
    Then he is told they could not be counted and to try again
    And he sees 3 discounted sales for that discount when he counts again

  # Each discount's count is kept on its own, so one can fail after another is kept. What Rodrigo is
  # told then is a question that is still open. The proposal beside it: he sees the discounts counted,
  # is told which could not be, and their sales wait for his next count.
  @todo
  Scenario: One of the store's discounts cannot be counted right now
    Given Stephanie has discounts on fruit and on vegetables
    And Sue has used a coupon for each since Rodrigo's last count
    And the vegetables cannot be counted right now
    When Rodrigo counts the discounted sales
    Then he sees 1 discounted sale for the fruit
    And he is told the vegetables could not be counted
    And he sees 1 discounted sale for the vegetables when he counts again

  @todo
  Scenario: Rodrigo and Stephanie count at the same moment
    Given Rodrigo has counted Stephanie's discounted sales before
    And Sue has used 3 coupons for Stephanie's discount since then
    When Rodrigo and Stephanie count the discounted sales at the same moment
    Then the 3 discounted sales are counted once between them

  @todo
  Scenario: A coupon is used while Rodrigo counts
    Given Rodrigo has counted Stephanie's discounted sales before
    When Sue uses a coupon for Stephanie's discount while Rodrigo counts the discounted sales
    Then that discounted sale is counted once, in this count or the next
