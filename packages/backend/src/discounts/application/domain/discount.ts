import type { DiscountDetails } from './discount-details.js';
import { DiscountPublished } from './discount-published.js';
import type { DomainEventPublisher } from './domain-event-publisher.js';

export class Discount {
  constructor(
    private readonly id: string,
    private readonly details: DiscountDetails,
    private readonly events: DomainEventPublisher,
  ) {}

  publish(): void {
    this.events.publish(new DiscountPublished(this.toJSON()));
  }

  toJSON(): { id: string } & ReturnType<DiscountDetails['toJSON']> {
    return { id: this.id, ...this.details.toJSON() };
  }
}
