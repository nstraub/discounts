import { describe, expect, it } from 'vitest';

import { produceDiscount, spicesDiscount, stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { setupSut } from './discounts-store-of-an-app';

describe('Store discounts', () => {
  describe('redeeming a coupon', () => {
    it('should hand the code as typed and the store picked over to be redeemed', async () => {
      const { restApi, discounts } = setupSut();
      const atTheSpicesStore = { code: '7k3qx 9m2pd', storeName: spicesDiscount.storeName, storeAddress: spicesDiscount.storeAddress };

      await discounts.redeemCoupon(atTheSpicesStore);

      expect(restApi.post).to.have.been.calledWith('/redemptions', atTheSpicesStore);
    });
    it('should hand another code and another store over when given others', async () => {
      const { restApi, discounts } = setupSut();
      const atStephaniesMarket = { code: 'R4WZ0-BH8NE', storeName: stephaniesProduceDiscount.storeName, storeAddress: stephaniesProduceDiscount.storeAddress };

      await discounts.redeemCoupon(atStephaniesMarket);

      expect(restApi.post).to.have.been.calledWith('/redemptions', atStephaniesMarket);
    });
    it('should hold what the redemption answers once the coupon is redeemed', async () => {
      const { restApi, discounts } = setupSut();
      restApi.post.mockResolvedValue({ item: spicesDiscount.item });

      await discounts.redeemCoupon({ code: '7K3QX9M2PD', storeName: spicesDiscount.storeName, storeAddress: spicesDiscount.storeAddress });

      expect(discounts.redemption).to.deep.equal({ item: 'Peruvian spices' });
    });
    it('should hold another item when the redemption answers with another', async () => {
      const { restApi, discounts } = setupSut();
      restApi.post.mockResolvedValue({ item: produceDiscount.item });

      await discounts.redeemCoupon({ code: 'R4WZ0BH8NE', storeName: produceDiscount.storeName, storeAddress: produceDiscount.storeAddress });

      expect(discounts.redemption).to.deep.equal({ item: 'Fresh produce' });
    });

    describe('dependency failure', () => {
      it.todo('should hold that the coupon could not be checked when it cannot be');
    });
  });
  describe('redeeming a coupon already used', () => {
    it('should hold that the coupon has already been used', async () => {
      const { restApi, discounts } = setupSut();
      restApi.post.mockRejectedValue(new Error('POST /redemptions answered 409'));

      await discounts.redeemCoupon({ code: '7K3QX9M2PD', storeName: spicesDiscount.storeName, storeAddress: spicesDiscount.storeAddress });

      expect(discounts.couponAlreadyUsed, 'whether the coupon is held as already used').to.equal(true);
    });
  });
});
