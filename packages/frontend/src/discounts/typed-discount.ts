import type { ChangeRateRequest, PublishDiscountRequest } from '@app/types/discounts';

export const nothingTyped = () => ({ item: '', rate: '', storeName: '', storeAddress: '', hook: '' });

const isBlank = (typed: string): boolean => typed.trim() === '';

const withTheHookGiven = (discount: Partial<PublishDiscountRequest>, hook: string): Partial<PublishDiscountRequest> => {
  if (isBlank(hook)) {
    return discount;
  }
  return { ...discount, hook };
};

export const discountToPublish = ({ rate, hook, ...others }: ReturnType<typeof nothingTyped>): Partial<PublishDiscountRequest> => {
  const discount = isBlank(rate) ? others : { ...others, rate };
  return withTheHookGiven(discount, hook);
};

export const changeToMake = (newRate: string): Partial<ChangeRateRequest> => {
  if (isBlank(newRate)) {
    return {};
  }
  return { rate: newRate };
};
