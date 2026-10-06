import type { discountTexts } from './texts';

type DiscountTexts = typeof discountTexts;

export class Piece {
  constructor(
    private readonly name: string,
    private readonly toldWhenMissing: (texts: DiscountTexts) => string,
  ) {}

  toldWhenAmong(missing: readonly string[], texts: DiscountTexts): string {
    return missing.includes(this.name) ? this.toldWhenMissing(texts) : '';
  }
}

export const theItem = new Piece('item', (texts) => texts.itemMissing);
export const theRate = new Piece('rate', (texts) => texts.rateMissing);
export const theStoreName = new Piece('storeName', (texts) => texts.storeNameMissing);
export const theStoreAddress = new Piece('storeAddress', (texts) => texts.storeAddressMissing);
