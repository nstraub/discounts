import type { discountTexts } from './texts';

type DiscountTexts = typeof discountTexts;

export interface TillAnswer {
  told(texts: DiscountTexts): string;
}

export class NothingTold implements TillAnswer {
  told(): string {
    return '';
  }
}

export class DiscountApplies implements TillAnswer {
  constructor(private readonly item: string) {}

  told(texts: DiscountTexts): string {
    return `${texts.theDiscountAppliesTo} ${this.item}`;
  }
}

export class CouponAlreadyUsed implements TillAnswer {
  told(texts: DiscountTexts): string {
    return texts.couponAlreadyUsed;
  }
}

export class CouponNotForThisStore implements TillAnswer {
  told(texts: DiscountTexts): string {
    return texts.couponNotForYourStore;
  }
}

export class NoStoreSaid implements TillAnswer {
  told(texts: DiscountTexts): string {
    return texts.sayWhichStoreYouAreAt;
  }
}

export class CouponNotValid implements TillAnswer {
  told(texts: DiscountTexts): string {
    return texts.couponNotValid;
  }
}
