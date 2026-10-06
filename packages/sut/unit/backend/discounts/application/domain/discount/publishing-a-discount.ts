import { mock, type MockProxy } from 'vitest-mock-extended';

import { DiscountDetails } from '@backend/discounts/application/domain/discount-details';
import type { DiscountPublicationRejected } from '@backend/discounts/application/domain/discount-publication-rejected';
import type { DiscountPublished } from '@backend/discounts/application/domain/discount-published';
import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { spicesDiscount } from '@sut/support/example-discounts';

export const setupSut = () => {
  const events = mock<DomainEventPublisher>();
  const factory = new DiscountFactory(events);
  const discountWith = (details: ConstructorParameters<typeof DiscountDetails>[0]) => factory.create(new DiscountDetails(details));
  const keep = async () => {};
  return { events, keep, discountWith, discountAt: (rate: string) => discountWith({ ...spicesDiscount, rate }) };
};

export const lastEventOf = (events: MockProxy<DomainEventPublisher>) => {
  const [published] = events.publish.mock.lastCall ?? [];
  return published as DiscountPublished;
};

export const lastRejectionOf = (events: MockProxy<DomainEventPublisher>) => {
  const [rejected] = events.publish.mock.lastCall ?? [];
  return rejected as DiscountPublicationRejected;
};
