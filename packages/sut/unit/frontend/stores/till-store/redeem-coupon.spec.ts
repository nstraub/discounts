import { describe, expect, it } from 'vitest';

import { produceDiscount, spicesDiscount, stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { setupSut } from './till-store-of-an-app';

describe('Store till', () => {
  describe('redeeming a coupon', () => {
    it('should hand the code as typed and the store picked over to be redeemed', async () => {
      const { restApi, till } = setupSut();
      const atTheSpicesStore = { code: '7k3qx 9m2pd', storeName: spicesDiscount.storeName, storeAddress: spicesDiscount.storeAddress };

      await till.redeemCoupon(atTheSpicesStore);

      expect(restApi.post).to.have.been.calledWith('/redemptions', atTheSpicesStore);
    });
    it('should hand another code and another store over when given others', async () => {
      const { restApi, till } = setupSut();
      const atStephaniesMarket = { code: 'R4WZ0-BH8NE', storeName: stephaniesProduceDiscount.storeName, storeAddress: stephaniesProduceDiscount.storeAddress };

      await till.redeemCoupon(atStephaniesMarket);

      expect(restApi.post).to.have.been.calledWith('/redemptions', atStephaniesMarket);
    });
    it('should hold what the redemption answers once the coupon is redeemed', async () => {
      const { restApi, till } = setupSut();
      restApi.post.mockResolvedValue({ item: spicesDiscount.item });

      await till.redeemCoupon({ code: '7K3QX9M2PD', storeName: spicesDiscount.storeName, storeAddress: spicesDiscount.storeAddress });

      expect(till.redemption).to.deep.equal({ item: 'Peruvian spices' });
    });
    it('should hold another item when the redemption answers with another', async () => {
      const { restApi, till } = setupSut();
      restApi.post.mockResolvedValue({ item: produceDiscount.item });

      await till.redeemCoupon({ code: 'R4WZ0BH8NE', storeName: produceDiscount.storeName, storeAddress: produceDiscount.storeAddress });

      expect(till.redemption).to.deep.equal({ item: 'Fresh produce' });
    });

    describe('dependency failure', () => {
      it.todo('should hold that the coupon could not be checked when it cannot be');
    });
  });
  describe('redeeming a coupon already used', () => {
    it('should hold that the coupon has already been used', async () => {
      const { restApi, till } = setupSut();
      restApi.post.mockRejectedValue(new Error('POST /redemptions answered 409'));

      await till.redeemCoupon({ code: '7K3QX9M2PD', storeName: spicesDiscount.storeName, storeAddress: spicesDiscount.storeAddress });

      expect(till.couponAlreadyUsed, 'whether the coupon is held as already used').to.equal(true);
    });
    it('should no longer hold a coupon as already used once the next coupon is redeemed', async () => {
      const { restApi, till } = setupSut();
      const atTheSpicesStore = { storeName: spicesDiscount.storeName, storeAddress: spicesDiscount.storeAddress };
      restApi.post.mockRejectedValueOnce(new Error('POST /redemptions answered 409')).mockResolvedValueOnce({ item: spicesDiscount.item });
      await till.redeemCoupon({ code: '7K3QX9M2PD', ...atTheSpicesStore });

      await till.redeemCoupon({ code: 'R4WZ0BH8NE', ...atTheSpicesStore });

      expect(till.couponAlreadyUsed, 'whether a coupon is held as already used').to.equal(false);
    });
  });
  describe('redeeming a coupon at another store', () => {
    it.todo('should hold that the coupon is not for the store picked');
  });
});
