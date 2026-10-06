import { Store } from './store.js';

export class DiscountDetails {
  constructor(private readonly details: { item: string; rate: string; storeName: string; storeAddress: string; hook?: string }) {}

  withRate(rate: string): DiscountDetails {
    return new DiscountDetails({ ...this.details, rate });
  }

  store(): Store {
    return new Store({ storeName: this.details.storeName, storeAddress: this.details.storeAddress });
  }

  toJSON() {
    return { ...this.details };
  }
}
