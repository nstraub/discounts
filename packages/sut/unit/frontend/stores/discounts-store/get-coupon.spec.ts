import { describe, expect, it } from 'vitest';

import { setupSut } from './discounts-store-of-an-app';

describe('Store discounts', () => {
  describe('getting a coupon for a discount', () => {
    it('should hand the discount over to get a coupon for it', async () => {
      const { restApi, discounts } = setupSut();

      await discounts.getCoupon('spices-id');

      expect(restApi.post).to.have.been.calledWith('/discounts/spices-id/coupons', {});
    });
    it('should hand another discount over to get a coupon for that one', async () => {
      const { restApi, discounts } = setupSut();

      await discounts.getCoupon('produce-id');

      expect(restApi.post).to.have.been.calledWith('/discounts/produce-id/coupons', {});
    });
    it.todo('should hold the coupon got once it is issued');
    it.todo('should keep the coupon got when the page is opened again');

    describe('dependency failure', () => {
      it.todo('should hold that a coupon could not be got when it cannot be issued');
    });
  });
});
