Feature: Stephanie takes the coupon at the till

  Scenario: Stephanie redeems a coupon
    Given Sue has a coupon for Stephanie's discount
    When Sue uses it at Stephanie's store
    Then Stephanie is told the discount applies

  @todo
  Scenario: Stephanie types the code the way she reads it
    Given Sue has a coupon for Stephanie's discount
    When Stephanie types Sue's code in lower case, with letters for the digits they look like
    Then Stephanie is told the discount applies

  @todo
  Scenario: Another coupon for the same discount still applies
    Given Sue and her neighbour each have a coupon for Stephanie's discount
    And Sue has used her coupon at Stephanie's store
    When her neighbour uses hers at Stephanie's store
    Then Stephanie is told the discount applies

  @todo
  Scenario: Stephanie finds her store once at the till
    Given Stephanie has published two discounts
    When Stephanie is taking a coupon at the till
    Then her store is offered once

  @todo
  Scenario: A store with the same name at another address is another store
    Given Stephanie has published a discount on produce
    And a store with the same name at another address has published a discount
    When Stephanie is taking a coupon at the till
    Then both stores are offered, each with its address

  @todo
  Scenario: Stephanie does not say which store she is at
    Given Sue has a coupon for Stephanie's discount
    When Sue uses it at the till before Stephanie says which store she is at
    Then Stephanie is told to say which store she is at
    And Sue's coupon is still unused

  # Which rate applies when a discount's rate changes after its coupon was got is a question for
  # Stephanie that is still open.
  @todo
  Scenario: Stephanie is told the rate the coupon applies at
    Given Sue has a coupon for Stephanie's discount
    And Stephanie has changed the discount's rate since
    When Sue uses it at Stephanie's store
    Then Stephanie is told the rate the discount applies at

  @todo
  Scenario: The coupon cannot be checked right now
    Given Sue has a coupon for Stephanie's discount
    And coupons cannot be checked right now
    When Sue uses it at Stephanie's store
    Then Stephanie is told the coupon could not be checked and to try again
    And Sue's coupon is still unused

  @todo
  Scenario: Sue's coupon is used at two tills at the same moment
    Given Sue has a coupon for Stephanie's discount
    When it is used at Stephanie's store twice at the same moment
    Then the discount applies only once

  @todo
  Scenario: Stephanie takes a code that cannot be a coupon's
    Given Stephanie is taking a coupon at the till
    When the code she types cannot be a coupon's
    Then Stephanie is told it is not valid

  # Anyone can use the till without an account, so nothing but a limit on speed stands in the way of
  # guessing codes until one applies.
  @todo
  Scenario: Someone tries code after code at the till
    When someone tries codes at the till far faster than anyone takes coupons
    Then they are slowed down

  Scenario: A coupon counts only once
    Given Sue has used her coupon at Stephanie's store
    When Sue tries to use it again
    Then Stephanie is told it has already been used

  @todo
  Scenario: A coupon used before Rodrigo's count is still used after it
    Given Sue has used her coupon at Stephanie's store
    And Rodrigo has counted Stephanie's discounted sales since
    When Sue tries to use it again
    Then Stephanie is told it has already been used

  @todo
  Scenario: A coupon is got while another is used
    Given Sue has a coupon for Stephanie's discount
    When Sue uses it at Stephanie's store while her neighbour gets a coupon for the same discount
    Then Stephanie is told the discount applies
    And her neighbour's coupon applies at Stephanie's store too

  @todo
  Scenario: Stephanie changes the rate while a coupon is used
    Given Sue has a coupon for Stephanie's discount
    When Sue uses it at Stephanie's store while Stephanie changes the discount's rate
    Then Sue's coupon counts as used
    And people can see the new rate
