import { DiscountPublicationRejected } from './discount-publication-rejected.js';
import type { DomainEventPublisher } from './domain-event-publisher.js';
import { RateNotValidException } from './rate-not-valid-exception.js';

const digitsWithAtMostOneDecimalAfterAPointOrAComma = /^(0|[1-9][0-9]*)([.,][0-9])?$/;

export class DiscountRate {
  constructor(private readonly written: string) {}

  whenValid<Published>(events: DomainEventPublisher, publish: () => Published): Published {
    if (this.isNotWrittenAsADecimal() || this.isOutOfBounds()) {
      events.publish(new DiscountPublicationRejected(this.written, 'not valid'));
      throw new RateNotValidException();
    }
    return publish();
  }

  private isNotWrittenAsADecimal(): boolean {
    return !digitsWithAtMostOneDecimalAfterAPointOrAComma.test(this.written);
  }

  private isOutOfBounds(): boolean {
    const value = Number(this.written.replace(',', '.'));
    return value <= 0 || value > 100;
  }
}
