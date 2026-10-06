import { PiecesMissingException } from './pieces-missing-exception.js';
import { Store } from './store.js';

export class DiscountDetails {
  constructor(private readonly details: { item: string; rate: string; storeName: string; storeAddress: string; hook?: string }) {}

  withRate(rate: string): DiscountDetails {
    return new DiscountDetails({ ...this.details, rate });
  }

  whenComplete<Published>(complete: () => Published, refused: (rate: string, missing: readonly string[]) => void): Published {
    if (this.details.item === '') {
      const missing = ['item', 'rate', 'storeName', 'storeAddress'];
      refused(this.details.rate, missing);
      throw new PiecesMissingException(missing);
    }
    return complete();
  }

  store(): Store {
    return new Store({ storeName: this.details.storeName, storeAddress: this.details.storeAddress });
  }

  toJSON() {
    return { ...this.details };
  }
}
