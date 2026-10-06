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
      const kept = { id: 'kept-spices-id', ...spicesDiscount, coupons: ['7K3QX9M2PD', 'R4WZ0BH8NE'] };

      const rebuilt = factory.reconstitute(kept);

      expect(rebuilt.toJSON().coupons).to.deep.equal(['7K3QX9M2PD', 'R4WZ0BH8NE']);
    });
  });
  describe('rebuilding a kept discount with a redeemed coupon', () => {
    it.todo('should rebuild each kept coupon redeemed or unused, as it was kept');
  });
});
