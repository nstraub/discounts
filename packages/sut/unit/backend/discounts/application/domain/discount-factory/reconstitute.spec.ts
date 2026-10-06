import { mock } from 'vitest-mock-extended';
import { describe, expect, it } from 'vitest';

import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { spicesDiscount, spicesDiscountWithItsHook } from '@sut/support/example-discounts';

describe('class DiscountFactory', () => {
  describe('rebuilding a kept discount', () => {
    it('should rebuild a kept discount with the identity and details it was kept with', () => {
      const factory = new DiscountFactory(mock<DomainEventPublisher>());
      const kept = { id: 'kept-spices-id', ...spicesDiscount, coupons: [] };

      const rebuilt = factory.reconstitute(kept);

      expect(rebuilt.toJSON()).to.deep.equal(kept);
    });
  });
  describe('rebuilding a kept discount with a hook', () => {
    it('should rebuild a kept discount with its hook', () => {
      const factory = new DiscountFactory(mock<DomainEventPublisher>());
      const kept = { id: 'kept-spices-id', ...spicesDiscountWithItsHook, coupons: [] };

      const rebuilt = factory.reconstitute(kept);

      expect(rebuilt.toJSON().hook).to.equal(spicesDiscountWithItsHook.hook);
    });
  });
  describe('rebuilding a kept discount with its coupons', () => {
    it('should rebuild a kept discount with the coupons it has issued', () => {
      const factory = new DiscountFactory(mock<DomainEventPublisher>());
      const kept = { id: 'kept-spices-id', ...spicesDiscount, coupons: [{ token: '7K3QX9M2PD', redeemed: false, counted: false }, { token: 'R4WZ0BH8NE', redeemed: false, counted: false }] };

      const rebuilt = factory.reconstitute(kept);

      expect(rebuilt.toJSON().coupons).to.deep.equal(kept.coupons);
    });
  });
  describe('rebuilding a kept discount with a redeemed coupon', () => {
    it('should rebuild each kept coupon redeemed or unused, as it was kept', () => {
      const factory = new DiscountFactory(mock<DomainEventPublisher>());
      const coupons = [{ token: '7K3QX9M2PD', redeemed: true, counted: false }, { token: 'R4WZ0BH8NE', redeemed: false, counted: false }];

      const rebuilt = factory.reconstitute({ id: 'kept-spices-id', ...spicesDiscount, coupons });

      expect(rebuilt.toJSON().coupons.map(({ redeemed }) => redeemed), 'each coupon redeemed').to.deep.equal([true, false]);
    });
  });
  describe('rebuilding a kept discount with its sales counted', () => {
    it('should rebuild each kept redeemed coupon counted or not yet counted, as it was kept', () => {
      const factory = new DiscountFactory(mock<DomainEventPublisher>());
      const coupons = [{ token: '7K3QX9M2PD', redeemed: true, counted: true }, { token: 'R4WZ0BH8NE', redeemed: true, counted: false }];

      const rebuilt = factory.reconstitute({ id: 'kept-spices-id', ...spicesDiscount, coupons });

      expect(rebuilt.toJSON().coupons.map(({ counted }) => counted), 'each coupon counted').to.deep.equal([true, false]);
    });
  });
});
