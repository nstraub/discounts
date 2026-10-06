import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { Coupon } from '@backend/discounts/application/domain/coupon';
import { CouponRedeemed } from '@backend/discounts/application/domain/coupon-redeemed';
import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { couponForTheProduceDiscount, publishedProduceDiscount } from '@sut/support/example-discounts';

const setupSut = ({ token = '7K3QX9M2PD' } = {}) => {
  const events = mock<DomainEventPublisher>();
  return { events, coupon: new Coupon(CouponToken.keptAs(token), false, false, events) };
};

describe('class Coupon', () => {
  describe('being redeemed', () => {
    describe('the coupon redeemed', () => {
      it('should count as used once it is redeemed', () => {
        const { coupon } = setupSut();

        coupon.redeem('spices-id');

        expect(coupon.toJSON().redeemed).to.equal(true);
      });
      it('should raise CouponRedeemed carrying its discount\'s id and its token', () => {
        const { events, coupon } = setupSut();

        coupon.redeem('spices-id');

        const [raised] = events.publish.mock.lastCall ?? [];
        expect(raised).to.be.instanceOf(CouponRedeemed);
        expect(raised).to.deep.include({ discountId: 'spices-id', token: '7K3QX9M2PD' });
      });
      it('should raise CouponRedeemed carrying the id of another discount and the token of a coupon it issued', () => {
        const { events, coupon } = setupSut({ token: couponForTheProduceDiscount.token });

        coupon.redeem(publishedProduceDiscount.id);

        const { discountId, token } = events.publish.mock.lastCall?.at(0) as CouponRedeemed;
        expect({ discountId, token }).to.deep.equal({ discountId: publishedProduceDiscount.id, token: couponForTheProduceDiscount.token });
      });
    });

    describe('state', () => {
      it('should count as unused from its issue until it is redeemed', () => {
        const { coupon } = setupSut();

        expect(coupon.toJSON().redeemed).to.equal(false);
      });
    });
  });
});
