import { mock } from 'vitest-mock-extended';

import { aSourceDrawing } from '@backend/app/mocks/random-sources';
import { DiscountService } from '@backend/discounts/application/discount-service';
import type { Discount } from '@backend/discounts/application/domain/discount';
import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DiscountRepository } from '@backend/discounts/application/domain/discount-repository';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { publishedSpicesDiscount } from '@sut/support/example-discounts';

type KeptCoupons = ReturnType<Discount['toJSON']>['coupons'];

export const aServiceOverAKeptDiscount = ({ kept = publishedSpicesDiscount, drawing = '7K3QX9M2PD', coupons = [] as KeptCoupons } = {}) => {
  const events = mock<DomainEventPublisher>();
  const factory = new DiscountFactory(events);
  const repository = mock<DiscountRepository>();
  const discount = factory.reconstitute({ ...kept, coupons });
  repository.withId.calledWith(kept.id).mockResolvedValue(discount);
  repository.withCouponToken.mockResolvedValue(discount);
  return { events, repository, service: new DiscountService(factory, repository, aSourceDrawing(drawing)) };
};
