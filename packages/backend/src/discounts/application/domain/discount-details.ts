export class DiscountDetails {
  constructor(private readonly details: { item: string; rate: string; storeName: string; storeAddress: string }) {}

  toJSON() {
    return { ...this.details };
  }
}
