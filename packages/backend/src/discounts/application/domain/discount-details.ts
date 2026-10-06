export class DiscountDetails {
  constructor(private readonly details: { item: string; rate: string; storeName: string; storeAddress: string; hook?: string }) {}

  withRate(rate: string): DiscountDetails {
    return new DiscountDetails({ ...this.details, rate });
  }

  toJSON() {
    return { ...this.details };
  }
}
