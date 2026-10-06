const moreThanOneDecimalPlace = /\.\d{2,}/;
const aComputersNotation = /[a-z]/i;

export class DiscountRate {
  constructor(private readonly written: string) {}

  isNotValid(): boolean {
    const withADecimalPoint = this.written.replace(',', '.');
    const value = Number(withADecimalPoint);
    return (
      Number.isNaN(value) ||
      value <= 0 ||
      value > 100 ||
      moreThanOneDecimalPlace.test(withADecimalPoint) ||
      aComputersNotation.test(this.written)
    );
  }
}
