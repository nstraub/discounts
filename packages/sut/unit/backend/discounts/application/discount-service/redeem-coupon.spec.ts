import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { CouponAlreadyUsedException } from '@backend/discounts/application/domain/coupon-already-used-exception';
import { CouponRedeemed } from '@backend/discounts/application/domain/coupon-redeemed';
import { CouponRedemptionRejected } from '@backend/discounts/application/domain/coupon-redemption-rejected';
import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import type { DiscountRepository } from '@backend/discounts/application/domain/discount-repository';
import { spicesDiscount } from '@sut/support/example-discounts';
import { atTheSpicesStore } from '@sut/support/example-stores';

import { aServiceOverAKeptDiscount } from './a-service-over-a-kept-discount';

const setupSut = ({ coupons = [{ token: '7K3QX9M2PD', redeemed: false, counted: false }] } = {}) => aServiceOverAKeptDiscount({ coupons });

describe('class DiscountService', () => {
  describe('redeeming a coupon', () => {
    it('should keep the discount that owns the coupon with the coupon redeemed', async () => {
      const { repository, service } = setupSut();

      await service.redeemCoupon('7K3QX9M2PD', atTheSpicesStore);

      expect(repository.save.mock.lastCall?.at(0)?.toJSON().coupons).to.deep.equal([{ token: '7K3QX9M2PD', redeemed: true, counted: false }]);
    });
    it('should announce CouponRedeemed for the coupon redeemed', async () => {
      const { events, service } = setupSut();

      await service.redeemCoupon('7K3QX9M2PD', atTheSpicesStore);

      expect(events.publish).to.have.been.calledWith(new CouponRedeemed('spices-id', '7K3QX9M2PD'));
    });
    it('should answer with the item of the discount the coupon is for', async () => {
      const { service } = setupSut();

      const redeemed = await service.redeemCoupon('7K3QX9M2PD', atTheSpicesStore);

      expect(redeemed.toJSON()).to.deep.equal({ item: spicesDiscount.item });
    });

    describe('combination', () => {
      it('should redeem the coupon whose code is typed in lower case, in two groups', async () => {
        const { repository, service } = setupSut();

        await service.redeemCoupon('7k3qx 9m2pd', atTheSpicesStore);

        const [kept] = repository.save.mock.lastCall?.at(0)?.toJSON().coupons ?? [];
        expect(kept, 'the coupon of the code typed').to.deep.equal({ token: '7K3QX9M2PD', redeemed: true, counted: false });
      });
    });

    describe('one change at a time', () => {
      it('should keep the coupon redeemed through the repository its change is given', async () => {
        const { repository, service } = setupSut();
        const given = mock<DiscountRepository>();
        given.withCouponToken.mockResolvedValue(await repository.withCouponToken(CouponToken.read('7K3QX9M2PD')));
        repository.changing.mockImplementation((work) => work(given));

        await service.redeemCoupon('7K3QX9M2PD', atTheSpicesStore);

        expect(given.save.mock.lastCall?.at(0)?.toJSON().coupons, 'the coupons kept through the repository given').to.deep.equal([{ token: '7K3QX9M2PD', redeemed: true, counted: false }]);
      });
    });

    describe('dependency failure', () => {
      it.todo('should report that the coupon could not be checked when its discount cannot be loaded or kept, the coupon staying unused');
    });
  });
  describe('redeeming a coupon already used', () => {
    it('should report that the coupon has already been used', async () => {
      const { service } = setupSut({ coupons: [{ token: '7K3QX9M2PD', redeemed: true, counted: false }] });

      await expect(service.redeemCoupon('7K3QX9M2PD', atTheSpicesStore)).rejects.to.be.instanceOf(CouponAlreadyUsedException);
    });
    it('should announce CouponRedemptionRejected for the coupon already used', async () => {
      const { events, service } = setupSut({ coupons: [{ token: '7K3QX9M2PD', redeemed: true, counted: false }] });

      await expect(service.redeemCoupon('7K3QX9M2PD', atTheSpicesStore)).rejects.to.be.instanceOf(CouponAlreadyUsedException);

      expect(events.publish).to.have.been.calledWith(new CouponRedemptionRejected('spices-id', '7K3QX9M2PD', 'already used'));
    });
  });
  describe('redeeming a coupon at a store', () => {
    it.todo('should redeem a coupon at the store given when it is the store its discount names');
    it.todo('should report that the coupon is not for the store given');
    it.todo('should keep nothing when the coupon is not for the store given');
    it.todo('should announce CouponRedemptionRejected for the coupon refused at another store');
  });
});
