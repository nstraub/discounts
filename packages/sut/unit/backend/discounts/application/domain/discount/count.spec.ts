import { describe, expect, it } from 'vitest';

import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import { DiscountedSalesCounted } from '@backend/discounts/application/domain/discounted-sales-counted';
import { publishedSpicesDiscount } from '@sut/support/example-discounts';

import { aSpicesDiscountWithItsEvents } from './a-spices-discount';

const threeRedeemedCoupons = [
  { token: '7K3QX9M2PD', redeemed: true },
  { token: 'R4WZ0BH8NE', redeemed: true },
  { token: 'C9D2F6H8JK', redeemed: true },
];

const setupSut = ({ kept = publishedSpicesDiscount, coupons = threeRedeemedCoupons } = {}) => {
  const { events, factory } = aSpicesDiscountWithItsEvents();
  return { events, discount: factory.reconstitute({ ...kept, coupons }) };
};

describe('class Discount', () => {
  describe('counting its discounted sales', () => {
    describe('the count', () => {
      it('should count three sales when three of its coupons were redeemed since its last count', () => {
        const { discount } = setupSut({ coupons: threeRedeemedCoupons });

        const counted = discount.count();

        expect(counted.toJSON().discountedSales).to.equal(3);
      });
      it('should raise DiscountedSalesCounted carrying its id and the number of sales counted', () => {
        const { events, discount } = setupSut({ coupons: threeRedeemedCoupons });

        discount.count();

        const [raised] = events.publish.mock.lastCall ?? [];
        expect(raised).to.be.instanceOf(DiscountedSalesCounted);
        expect(raised).to.deep.include({ discountId: publishedSpicesDiscount.id, discountedSales: 3 });
      });
    });

    describe('state', () => {
      it('should leave out of a count the coupons redeemed before its last count', () => {
        const coupons = [...threeRedeemedCoupons.slice(0, 2), { token: 'C9D2F6H8JK', redeemed: false }];
        const { discount } = setupSut({ coupons });
        discount.count();
        discount.redeemCoupon(CouponToken.keptAs('C9D2F6H8JK'));

        const counted = discount.count();

        expect(counted.toJSON().discountedSales, 'the sales since the last count').to.equal(1);
      });
      it.todo('should count a coupon issued before its last count and redeemed after it');
      it.todo('should not count a coupon issued and not yet redeemed');
    });

    describe('boundary', () => {
      it.todo('should count every coupon redeemed since it was published when it has never been counted');
    });
  });
});
