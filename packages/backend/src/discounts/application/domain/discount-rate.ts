const moreThanOneDecimalPlace = /\.\d{2,}/;

export class DiscountRate {
  constructor(private readonly written: string) {}

  isNotValid(): boolean {
    const value = Number(this.written);
    return value <= 0 || value > 100 || moreThanOneDecimalPlace.test(this.written);
  }
}
