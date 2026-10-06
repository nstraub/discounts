import { describe, expect, it } from 'vitest';

import { setupSut } from './discounts-store-of-an-app';

describe('Store discounts', () => {
  describe('changing the rate of a discount', () => {
    it('should hand the discount and its new rate over to be changed', async () => {
      const { restApi, discounts } = setupSut();

      await discounts.changeRate('spices-id', { rate: '30' });

      expect(restApi.patch).to.have.been.calledWith('/discounts/spices-id', { rate: '30' });
    });
    it.todo('should hold the discount at its new rate once the change succeeds');
    it.todo('should hold the new rate on that discount only, the others keeping theirs');

    describe('dependency failure', () => {
      it.todo('should hold that the rate could not be changed when the change fails, the discount keeping its rate');
    });
  });
});
