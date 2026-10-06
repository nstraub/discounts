import { mock } from 'vitest-mock-extended';
import { describe, expect, it } from 'vitest';

import { tokenDrawnAs } from '@backend/app/mocks/coupon-tokens';
import { DiscountDetails } from '@backend/discounts/application/domain/discount-details';
import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { spicesDiscount } from '@sut/support/example-discounts';

const setupSut = () => {
  const events = mock<DomainEventPublisher>();
  return { events, discount: new DiscountFactory(events).create(new DiscountDetails(spicesDiscount)) };
};

describe('class Discount', () => {
  describe('issuing a coupon', () => {
    describe('the coupon issued', () => {
      it('should hold the coupon it issues, with the token it is given', () => {
        const { discount } = setupSut();

        discount.issueCoupon(tokenDrawnAs('7K3QX9M2PD'));

        expect(discount.toJSON().coupons).to.deep.equal(['7K3QX9M2PD']);
      });
      it.todo('should raise CouponIssued carrying its id and the coupon\'s token');
    });

    describe('state', () => {
      it.todo('should issue a second coupon with a token of its own when tried twice, holding both');
    });
  });
});
