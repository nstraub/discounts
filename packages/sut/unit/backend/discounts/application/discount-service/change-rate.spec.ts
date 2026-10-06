import { describe, it } from 'vitest';

describe('class DiscountService', () => {
  describe('changing the rate of a discount', () => {
    it.todo('should keep the discount named at its new rate');
    it.todo('should announce DiscountRateChanged once the change is kept');

    describe('state', () => {
      it.todo('should report that there is no such discount when no discount has that id, changing nothing');
    });

    describe('dependency failure', () => {
      it.todo('should report that the rate could not be changed when the change cannot be kept');
    });
  });
});
