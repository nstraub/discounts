import { PiecesMissingException } from './pieces-missing-exception.js';
import { Store } from './store.js';

export class DiscountDetails {
  constructor(private readonly details: { item: string; rate: string; storeName: string; storeAddress: string; hook?: string }) {}

  withRate(rate: string): DiscountDetails {
    return new DiscountDetails({ ...this.details, rate });
  }

  whenComplete<Published>(complete: () => Published, refused: (rate: string, missing: readonly string[]) => void): Published {
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
