import type { ChangeRateRequest, PublishDiscountRequest } from '@app/types/discounts';

export const nothingTyped = () => ({ item: '', rate: '', storeName: '', storeAddress: '' });

const isBlank = (typed: string): boolean => typed.trim() === '';

const withTheHookGiven = (discount: Partial<PublishDiscountRequest>, hook: string): Partial<PublishDiscountRequest> => {
  if (hook === '') {
    return discount;
  }
  return { ...discount, hook };
};

export const discountToPublish = ({ rate, ...others }: ReturnType<typeof nothingTyped>, hook: string): Partial<PublishDiscountRequest> => {
  if (isBlank(rate)) {
    return withTheHookGiven(others, hook);
  }
  return withTheHookGiven({ ...others, rate }, hook);
};

export const changeToMake = (newRate: string): Partial<ChangeRateRequest> => {
  if (isBlank(newRate)) {
    return {};
  }
  return { rate: newRate };
};
