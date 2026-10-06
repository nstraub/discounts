const moreThanOneDecimalPlace = /\.\d{2,}/;
const aComputersNotation = /[a-z]/i;

export class DiscountRate {
  private readonly withADecimalPoint: string;

  constructor(private readonly written: string) {
    this.withADecimalPoint = written.replace(',', '.');
  }

  isNotValid(): boolean {
    return this.isNotWrittenAsADecimal() || this.isOutOfBounds();
  }

  private isNotWrittenAsADecimal(): boolean {
    return (
      Number.isNaN(Number(this.withADecimalPoint)) ||
      moreThanOneDecimalPlace.test(this.withADecimalPoint) ||
      aComputersNotation.test(this.written)
    );
  }

  private isOutOfBounds(): boolean {
    const value = Number(this.withADecimalPoint);
    return value <= 0 || value > 100;
  }
}
