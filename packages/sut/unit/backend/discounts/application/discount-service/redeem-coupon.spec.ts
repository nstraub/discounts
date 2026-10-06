import { describe, expect, it } from 'vitest';

import { CouponRedeemed } from '@backend/discounts/application/domain/coupon-redeemed';

import { aServiceOverAKeptDiscount } from './a-service-over-a-kept-discount';

const setupSut = ({ coupons = [{ token: '7K3QX9M2PD', redeemed: false }] } = {}) => aServiceOverAKeptDiscount({ coupons });

describe('class DiscountService', () => {
  describe('redeeming a coupon', () => {
    it('should keep the discount that owns the coupon with the coupon redeemed', async () => {
      const { repository, service } = setupSut();

      await service.redeemCoupon('7K3QX9M2PD');

      expect(repository.save.mock.lastCall?.at(0)?.toJSON().coupons).to.deep.equal([{ token: '7K3QX9M2PD', redeemed: true }]);
    });
    it('should announce CouponRedeemed for the coupon redeemed', async () => {
      const { events, service } = setupSut();

      await service.redeemCoupon('7K3QX9M2PD');

      expect(events.publish).to.have.been.calledWith(new CouponRedeemed('spices-id', '7K3QX9M2PD'));
    });
    it.todo('should answer with the item of the discount the coupon is for');

    describe('combination', () => {
      it.todo('should redeem the coupon whose code is typed in lower case, in two groups');
    });

    describe('dependency failure', () => {
      it.todo('should report that the coupon could not be checked when its discount cannot be loaded or kept, the coupon staying unused');
    });
  });
});
