import { describe, expect, it } from 'vitest';

import { CouponAlreadyUsedException } from '@backend/discounts/application/domain/coupon-already-used-exception';
import { CouponNotForThisStoreException } from '@backend/discounts/application/domain/coupon-not-for-this-store-exception';
import { CouponRedeemed } from '@backend/discounts/application/domain/coupon-redeemed';
import { CouponRedemptionRejected } from '@backend/discounts/application/domain/coupon-redemption-rejected';
import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import type { Discount } from '@backend/discounts/application/domain/discount';
import { Store } from '@backend/discounts/application/domain/store';
import { publishedProduceDiscount, publishedSpicesDiscount, theStoreOf } from '@sut/support/example-discounts';
import { atStephaniesStore, atTheSpicesStore } from '@sut/support/example-stores';

import { aSpicesDiscountWithItsEvents } from './a-spices-discount';

const setupSutWithItsEvents = ({ kept = publishedSpicesDiscount, coupons = [{ token: '7K3QX9M2PD', redeemed: false, counted: false }] } = {}) => {
  const { events, factory } = aSpicesDiscountWithItsEvents();
  return { events, discount: factory.reconstitute({ ...kept, coupons }) };
};

const tryingItsCouponAtStephaniesStore = (discount: Discount) => () => discount.redeemCoupon(CouponToken.keptAs('7K3QX9M2PD'), atStephaniesStore);

const setupSut = (options: Parameters<typeof setupSutWithItsEvents>[0] = {}) => setupSutWithItsEvents(options).discount;

describe('class Discount', () => {
  describe('redeeming one of its coupons', () => {
    it('should redeem its coupon with the token given', () => {
      const discount = setupSut();

      discount.redeemCoupon(CouponToken.keptAs('7K3QX9M2PD'), atTheSpicesStore);

      expect(discount.toJSON().coupons).to.deep.equal([{ token: '7K3QX9M2PD', redeemed: true, counted: false }]);
    });

    it('should answer with the item of the discount the coupon redeemed is for', () => {
      const discount = setupSut();

      const redeemed = discount.redeemCoupon(CouponToken.keptAs('7K3QX9M2PD'), atTheSpicesStore);

      expect(redeemed.toJSON()).to.deep.equal({ item: publishedSpicesDiscount.item });
    });
    it('should answer with the item of another discount when one of its coupons is redeemed', () => {
      const discount = setupSut({ kept: publishedProduceDiscount });

      const redeemed = discount.redeemCoupon(CouponToken.keptAs('7K3QX9M2PD'), new Store(theStoreOf(publishedProduceDiscount)));

      expect(redeemed.toJSON()).to.deep.equal({ item: publishedProduceDiscount.item });
    });

    describe('combination', () => {
      it('should leave its other coupons unused when one is redeemed', () => {
        const discount = setupSut({ coupons: [{ token: '7K3QX9M2PD', redeemed: false, counted: false }, { token: 'R4WZ0BH8NE', redeemed: false, counted: false }] });

        discount.redeemCoupon(CouponToken.keptAs('R4WZ0BH8NE'), atTheSpicesStore);

        expect(discount.toJSON().coupons.at(0)).to.deep.equal({ token: '7K3QX9M2PD', redeemed: false, counted: false });
      });
    });
  });
  describe('redeeming a coupon already used', () => {
    it('should refuse the used coupon, leaving its other coupons as they were', () => {
      const asTheyWere = [{ token: '7K3QX9M2PD', redeemed: true, counted: false }, { token: 'R4WZ0BH8NE', redeemed: false, counted: false }];
      const discount = setupSut({ coupons: asTheyWere });

      expect(() => discount.redeemCoupon(CouponToken.keptAs('7K3QX9M2PD'), atTheSpicesStore)).to.throw(CouponAlreadyUsedException);
      expect(discount.toJSON().coupons).to.deep.equal(asTheyWere);
    });
  });
  describe('redeeming one of its coupons at a store', () => {
    it('should redeem its coupon at its own store, the name and address it was published with', () => {
      const discount = setupSut();

      discount.redeemCoupon(CouponToken.keptAs('7K3QX9M2PD'), new Store(theStoreOf(publishedSpicesDiscount)));

      expect(discount.toJSON().coupons).to.deep.equal([{ token: '7K3QX9M2PD', redeemed: true, counted: false }]);
    });
    it('should refuse its coupon at another store, the coupon staying unused', () => {
      const discount = setupSut();

      expect(tryingItsCouponAtStephaniesStore(discount)).to.throw(CouponNotForThisStoreException);
      expect(discount.toJSON().coupons).to.deep.equal([{ token: '7K3QX9M2PD', redeemed: false, counted: false }]);
    });
    it('should raise CouponRedemptionRejected carrying its id, the coupon\'s token and that the coupon is not for that store', () => {
      const { events, discount } = setupSutWithItsEvents();

      expect(tryingItsCouponAtStephaniesStore(discount)).to.throw(CouponNotForThisStoreException);

      expect(events.publish).to.have.been.calledWith(new CouponRedemptionRejected(publishedSpicesDiscount.id, '7K3QX9M2PD', 'not for this store'));
    });
    it('should not raise CouponRedeemed when its coupon is refused at another store', () => {
      const { events, discount } = setupSutWithItsEvents();

      expect(tryingItsCouponAtStephaniesStore(discount)).to.throw(CouponNotForThisStoreException);

      expect(events.publish).to.not.have.been.calledWith(expect.any(CouponRedeemed));
    });

    describe('boundary', () => {
      it('should refuse its coupon at a store with the same name at another address', () => {
        const discount = setupSut();
        const atAnotherAddress = new Store({ storeName: publishedSpicesDiscount.storeName, storeAddress: '9 Quay Street' });

        expect(() => discount.redeemCoupon(CouponToken.keptAs('7K3QX9M2PD'), atAnotherAddress)).to.throw(CouponNotForThisStoreException);
      });
      it.todo('should refuse its coupon at a store with another name at the same address');
      it.todo('should refuse its coupon at a store whose name differs from its own only in its capitals');
      it.todo('should refuse its coupon at a store whose name has spaces around it that its own has not');
    });

    describe('state', () => {
      it.todo('should redeem at its own store a coupon refused at another store before');
    });

    describe('combination', () => {
      it.todo('should refuse a coupon already used, tried at another store, as not for that store');
    });
  });
});
