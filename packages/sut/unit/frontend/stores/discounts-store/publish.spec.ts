import { describe, expect, it } from 'vitest';

import { spicesDiscount, spicesDiscountWithItsHook } from '@sut/support/example-discounts';

import { setupSut } from './discounts-store-of-an-app';

describe('Store discounts', () => {
  describe('publishing a discount', () => {
    it('should hand the item, rate, store name and store address over to be published', async () => {
      const { restApi, discounts } = setupSut();

      await discounts.publish(spicesDiscount);

      expect(restApi.post).to.have.been.calledWith('/discounts', spicesDiscount);
    });
    it('should hand other pieces over when given others', async () => {
      const { restApi, discounts } = setupSut();
      const produceDiscount = { item: 'Fresh produce', rate: '10', storeName: 'Corner Grocery', storeAddress: '3 Hill Road' };

      await discounts.publish(produceDiscount);

      expect(restApi.post).to.have.been.calledWith('/discounts', produceDiscount);
    });
    it.todo('should hold the discount just published without loading the page again');
  });
  describe('publishing a discount with a hook', () => {
    it('should hand the hook over to be published with the rest', async () => {
      const { restApi, discounts } = setupSut();

      await discounts.publish(spicesDiscountWithItsHook);

      expect(restApi.post).to.have.been.calledWith('/discounts', spicesDiscountWithItsHook);
    });
  });
  describe('publishing a discount at a rate that is not valid', () => {
    it('should hold that the rate is not valid when the publish is refused for it', async () => {
      const { restApi, discounts } = setupSut();
      restApi.post.mockRejectedValue(new Error('POST /discounts answered 400'));

      await discounts.publish({ ...spicesDiscount, rate: '150' });

      expect(discounts.rateNotValid, 'whether the rate is held as not valid').to.equal(true);
    });
    it('should no longer hold the rate as not valid once the next discount is published', async () => {
      const { restApi, discounts } = setupSut();
      restApi.post.mockRejectedValueOnce(new Error('POST /discounts answered 400')).mockResolvedValueOnce(undefined);
      await discounts.publish({ ...spicesDiscount, rate: '150' });

      await discounts.publish(spicesDiscount);

      expect(discounts.rateNotValid, 'whether the rate is held as not valid').to.equal(false);
    });
  });
});
