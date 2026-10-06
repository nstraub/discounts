import { DiscountPublicationRejected } from './discount-publication-rejected.js';
import type { DomainEventPublisher } from './domain-event-publisher.js';
import { RateNotValidException } from './rate-not-valid-exception.js';

const moreThanOneDecimalPlace = /\.\d{2,}/;
const aComputersNotation = /[a-z]/i;

export class DiscountRate {
  private readonly withADecimalPoint: string;

  constructor(private readonly written: string) {
    this.withADecimalPoint = written.replace(',', '.');
  }

  whenValid<Published>(events: DomainEventPublisher, publish: () => Published): Published {
    if (this.isNotWrittenAsADecimal() || this.isOutOfBounds()) {
      events.publish(new DiscountPublicationRejected(this.written, 'not valid'));
      throw new RateNotValidException();
    }
    return publish();
  }

  private isNotWrittenAsADecimal(): boolean {
    return (
      Number.isNaN(Number(this.withADecimalPoint)) ||
      moreThanOneDecimalPlace.test(this.withADecimalPoint) ||
      aComputersNotation.test(this.written)
    );
  }

  private isOutOfBounds(): boolean {
    const value = Number(this.withADecimalPoint);
    return value <= 0 || value > 100;
  }
}
