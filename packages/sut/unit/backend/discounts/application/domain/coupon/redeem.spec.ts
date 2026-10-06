import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { Coupon } from '@backend/discounts/application/domain/coupon';
import { CouponRedeemed } from '@backend/discounts/application/domain/coupon-redeemed';
import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';

describe('class Coupon', () => {
  describe('being redeemed', () => {
    describe('the coupon redeemed', () => {
      it('should count as used once it is redeemed', () => {
        const coupon = new Coupon(CouponToken.keptAs('7K3QX9M2PD'), false, mock<DomainEventPublisher>());

        coupon.redeem('spices-id');

        expect(coupon.toJSON().redeemed).to.equal(true);
      });
      it('should raise CouponRedeemed carrying its discount\'s id and its token', () => {
        const events = mock<DomainEventPublisher>();
        const coupon = new Coupon(CouponToken.keptAs('7K3QX9M2PD'), false, events);

        coupon.redeem('spices-id');

        const [raised] = events.publish.mock.lastCall ?? [];
        expect(raised).to.be.instanceOf(CouponRedeemed);
        expect(raised).to.deep.include({ id: 'spices-id', token: '7K3QX9M2PD' });
      });
    });

    describe('state', () => {
      it.todo('should count as unused from its issue until it is redeemed');
    });
  });
});
