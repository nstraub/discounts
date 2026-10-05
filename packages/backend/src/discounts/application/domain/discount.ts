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

  toJSON(): { id: string; item: string; rate: number; storeName: string; storeAddress: string } {
    return { id: '', item: 'Peruvian spices', rate: 20, storeName: "Mike's Groceries", storeAddress: '12 Market Street' };
  }
}
