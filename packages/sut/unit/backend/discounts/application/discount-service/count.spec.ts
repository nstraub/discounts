import { describe, it } from 'vitest';

describe('class DiscountService', () => {
  describe('counting a store\'s discounted sales', () => {
    it.todo('should keep the store\'s discount with its sales counted');
    it.todo('should announce DiscountedSalesCounted once the count is kept');
    it.todo('should answer with the discount\'s id, item and rate and the number of sales counted');

    describe('not found', () => {
      it.todo('should report that no such store exists when no published discount names it, counting nothing');
    });

    describe('dependency failure', () => {
      it.todo('should report that the sales could not be counted when the store\'s discounts cannot be loaded, restarting nothing');
      it.todo('should keep counted the discounts kept before one that cannot be kept, and leave that one\'s sales for the next count');
    });
  });
});
