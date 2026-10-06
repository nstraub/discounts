import type { ChangeRateRequest, PublishDiscountRequest } from '@app/types/discounts';

export const nothingTyped = () => ({ item: '', rate: '', storeName: '', storeAddress: '' });

const isBlank = (typed: string): boolean => typed.trim() === '';

export const discountToPublish = ({ rate, ...others }: ReturnType<typeof nothingTyped>): Partial<PublishDiscountRequest> => {
  if (isBlank(rate)) {
    return others;
  }
  return { ...others, rate };
};

export const changeToMake = (newRate: string): Partial<ChangeRateRequest> => {
  if (isBlank(newRate)) {
    return {};
  }
  return { rate: newRate };
};
