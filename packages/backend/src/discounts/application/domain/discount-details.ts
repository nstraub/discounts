export class DiscountDetails {
  constructor(private readonly details: { item: string; rate: number; storeName: string; storeAddress: string }) {}

  toJSON() {
    return { ...this.details };
  }
}
