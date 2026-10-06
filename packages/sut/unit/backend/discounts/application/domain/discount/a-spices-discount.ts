import { mock } from 'vitest-mock-extended';

import { DiscountDetails } from '@backend/discounts/application/domain/discount-details';
import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { spicesDiscount } from '@sut/support/example-discounts';

export const aSpicesDiscountWithItsEvents = () => {
  const events = mock<DomainEventPublisher>();
  const factory = new DiscountFactory(events);
  return { events, factory, discount: factory.create(new DiscountDetails(spicesDiscount)) };
};
