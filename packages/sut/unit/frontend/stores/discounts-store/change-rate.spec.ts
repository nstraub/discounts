import { describe, it } from 'vitest';

describe('Store discounts', () => {
  describe('changing the rate of a discount', () => {
    it.todo('should hand the discount and its new rate over to be changed');
    it.todo('should hold the discount at its new rate once the change succeeds');
    it.todo('should hold the new rate on that discount only, the others keeping theirs');

    describe('dependency failure', () => {
      it.todo('should hold that the rate could not be changed when the change fails, the discount keeping its rate');
    });
  });
});
