import { mock } from 'vitest-mock-extended';
import { describe, expect, it } from 'vitest';

import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { spicesDiscount } from '@sut/support/example-discounts';

describe('class DiscountFactory', () => {
  describe('rebuilding a kept discount', () => {
    it('should rebuild a kept discount with the identity and details it was kept with', () => {
      const factory = new DiscountFactory(mock<DomainEventPublisher>());
      const kept = { id: 'kept-spices-id', ...spicesDiscount };

      const rebuilt = factory.reconstitute(kept);

      expect(rebuilt.toJSON()).to.deep.equal(kept);
    });
  });
});
