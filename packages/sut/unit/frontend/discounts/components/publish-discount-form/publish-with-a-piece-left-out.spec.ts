import { describe, it } from 'vitest';

describe('Component PublishDiscountForm', () => {
  describe('publishing a discount with a piece left out', () => {
    it.todo('should tell Mike the item is missing beside the item\'s field when the publish is refused for it');
    it.todo('should tell Mike the rate is missing beside the rate\'s field when the publish is refused for it');
    it.todo('should tell Mike the store name is missing beside the store name\'s field when the publish is refused for it');
    it.todo('should tell Mike the store address is missing beside the store address\'s field when the publish is refused for it');

    describe('state', () => {
      it.todo('should not tell Mike anything is missing before a publish is refused');
      it.todo('should no longer tell Mike a piece is missing once he gives it and the discount is published');
    });

    describe('combination', () => {
      it.todo('should tell Mike every piece missing at once, each beside its own field');
      it.todo('should tell Mike the rate is missing, never that it is not valid, when the refusal lists it as missing');
    });
  });
});
