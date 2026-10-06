export class RedeemedCoupon {
  constructor(private readonly item: string) {}

  toJSON(): { item: string } {
    return { item: this.item };
  }
}
