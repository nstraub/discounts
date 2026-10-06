import { RateNotValidException } from './rate-not-valid-exception.js';

const digitsWithAtMostOneDecimalAfterAPointOrAComma = /^(0|[1-9][0-9]*)([.,][0-9])?$/;

export class DiscountRate {
  constructor(private readonly written: string) {}

  whenValid<Published>(valid: () => Published, refused: (written: string) => void): Published {
    if (this.isNotWrittenAsADecimal() || this.isOutOfBounds()) {
      refused(this.written);
      throw new RateNotValidException();
    }
    return valid();
  }

  private isNotWrittenAsADecimal(): boolean {
    return !digitsWithAtMostOneDecimalAfterAPointOrAComma.test(this.written);
  }

  private isOutOfBounds(): boolean {
    const value = Number(this.written.replace(',', '.'));
    return value <= 0 || value > 100;
  }
}
