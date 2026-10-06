import { mock } from 'vitest-mock-extended';

import { aSourceDrawing } from '@backend/app/mocks/random-sources';
import { DiscountService } from '@backend/discounts/application/discount-service';
import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DiscountRepository } from '@backend/discounts/application/domain/discount-repository';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { publishedSpicesDiscount } from '@sut/support/example-discounts';

export const aServiceOverTheKeptSpicesDiscount = ({ kept = publishedSpicesDiscount, drawing = '7K3QX9M2PD' } = {}) => {
  const events = mock<DomainEventPublisher>();
  const factory = new DiscountFactory(events);
  const repository = mock<DiscountRepository>();
  repository.withId.calledWith(kept.id).mockResolvedValue(factory.reconstitute({ ...kept, coupons: [] }));
  return { events, repository, service: new DiscountService(factory, repository, aSourceDrawing(drawing)) };
};
