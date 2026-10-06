import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { CouponAlreadyUsedException } from '@backend/discounts/application/domain/coupon-already-used-exception';
import { CouponNotForThisStoreException } from '@backend/discounts/application/domain/coupon-not-for-this-store-exception';
import { CouponRedeemed } from '@backend/discounts/application/domain/coupon-redeemed';
import { CouponRedemptionRejected } from '@backend/discounts/application/domain/coupon-redemption-rejected';
import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import type { DiscountRepository } from '@backend/discounts/application/domain/discount-repository';
import { NoCouponHasTheCodeException } from '@backend/discounts/application/domain/no-coupon-has-the-code-exception';
import { Store } from '@backend/discounts/application/domain/store';
import { publishedProduceDiscount, publishedSpicesDiscount, spicesDiscount, theStoreOf } from '@sut/support/example-discounts';
import { atStephaniesStore, atTheSpicesStore } from '@sut/support/example-stores';

import { aServiceOverAKeptDiscount } from './a-service-over-a-kept-discount';

const setupSut = ({ kept = publishedSpicesDiscount, coupons = [{ token: '7K3QX9M2PD', redeemed: false, counted: false }] } = {}) => aServiceOverAKeptDiscount({ kept, coupons });

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
    it('should redeem a coupon at the store given when it is the store its discount names', async () => {
      const { repository, service } = setupSut({ kept: publishedProduceDiscount });

      await service.redeemCoupon('7K3QX9M2PD', new Store(theStoreOf(publishedProduceDiscount)));

      expect(repository.save.mock.lastCall?.at(0)?.toJSON().coupons).to.deep.equal([{ token: '7K3QX9M2PD', redeemed: true, counted: false }]);
    });
    it('should report that the coupon is not for the store given', async () => {
      const { service } = setupSut();

      await expect(service.redeemCoupon('7K3QX9M2PD', atStephaniesStore)).rejects.to.be.instanceOf(CouponNotForThisStoreException);
    });
    it('should keep nothing when the coupon is not for the store given', async () => {
      const { repository, service } = setupSut();

      await expect(service.redeemCoupon('7K3QX9M2PD', atStephaniesStore)).rejects.to.be.instanceOf(CouponNotForThisStoreException);

      expect(repository.save.mock.calls, 'the discounts saved').to.deep.equal([]);
    });
    it('should announce CouponRedemptionRejected for the coupon refused at another store', async () => {
      const { events, service } = setupSut();

      await expect(service.redeemCoupon('7K3QX9M2PD', atStephaniesStore)).rejects.to.be.instanceOf(CouponNotForThisStoreException);

      expect(events.publish).to.have.been.calledWith(new CouponRedemptionRejected('spices-id', '7K3QX9M2PD', 'not for this store'));
    });
  });
  describe('redeeming a code nobody issued', () => {
    it('should report that no coupon has the code when none was issued with it', async () => {
      const { repository, service } = setupSut();
      repository.withCouponToken.mockResolvedValue(undefined);

      await expect(service.redeemCoupon('ZZZZZZZZZZ', atTheSpicesStore)).rejects.to.be.instanceOf(NoCouponHasTheCodeException);
    });
    it.todo('should report a code that cannot be a coupon\'s as one nobody issued');
    it.todo('should keep nothing and announce nothing when no coupon has the code');
  });
});
