import { describe, it } from 'vitest';

describe('the discounts table refusing what Discount refuses', () => {
  it.todo('should refuse a discount without an item: 23502, NOT NULL mirrors "a discount has an item"');
  it.todo('should refuse a discount without a rate: 23502, NOT NULL mirrors "a discount has a rate"');
  it.todo('should refuse a discount without a store name: 23502, NOT NULL mirrors "a discount names its store"');
  it.todo('should refuse a discount without a store address: 23502, NOT NULL mirrors "a discount names its store\'s address"');
  it.todo('should trace every constraint to a rule of Discount: no length cap on text, no CHECK on the rate');
});
