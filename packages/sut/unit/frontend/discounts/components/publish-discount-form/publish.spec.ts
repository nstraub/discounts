import { describe, it } from 'vitest';

describe('Component PublishDiscountForm', () => {
  describe('publishing a discount', () => {
    it.todo('should publish the item, rate, store name and store address as Mike gave them');
    it.todo('should clear every field once the discount is published');
    it.todo('should stay on the page, ready for the next discount, once the discount is published');

    describe('empty', () => {
      it.todo('should publish a blank rate as left out, never as a rate of zero');
    });

    describe('state', () => {
      it.todo('should publish once when Mike asks to publish twice before the first answer');
    });
  });
});
