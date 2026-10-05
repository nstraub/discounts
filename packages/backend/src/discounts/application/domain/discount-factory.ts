import { Discount } from './discount.js';
import type { DiscountDetails } from './discount-details.js';
import type { DomainEventPublisher } from './domain-event-publisher.js';

export class DiscountFactory {
  constructor(private readonly events: DomainEventPublisher) {}

  create(details: DiscountDetails): Discount {
    return new Discount('', details, this.events);
  }
}
