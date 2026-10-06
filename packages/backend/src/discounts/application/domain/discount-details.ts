import { DiscountRate } from './discount-rate.js';
import { PiecesMissingException } from './pieces-missing-exception.js';
import { Store } from './store.js';

export class DiscountDetails {
  constructor(private readonly details: { item: string; rate: string; storeName: string; storeAddress: string; hook?: string }) {}

  withRate(rate: string): DiscountDetails {
    return new DiscountDetails({ ...this.details, rate });
  }

  whenPublishable<Published>(publishable: () => Published, refused: (rate: string, reason: string, pieces: readonly string[]) => void): Published {
    const publishAtAValidRate = () => new DiscountRate(this.details.rate).whenValid(publishable, (rate) => refused(rate, 'not valid', ['rate']));
    return this.whenComplete(publishAtAValidRate, (rate, missing) => refused(rate, 'missing', missing));
  }

  private whenComplete<Published>(complete: () => Published, refused: (rate: string, missing: readonly string[]) => void): Published {
    const missing = this.piecesLeftOut();
    if (missing.length > 0) {
      refused(this.details.rate, missing);
      throw new PiecesMissingException(missing);
    }
    return complete();
  }

  private piecesLeftOut(): string[] {
    const { item, rate, storeName, storeAddress } = this.details;
    return Object.entries({ item, rate, storeName, storeAddress }).filter(([, text]) => text.trim() === '').map(([piece]) => piece);
  }

  store(): Store {
    return new Store({ storeName: this.details.storeName, storeAddress: this.details.storeAddress });
  }

  toJSON() {
    return { ...this.details };
  }
}
