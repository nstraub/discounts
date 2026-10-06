import type { ChangeRateRequest, PublishDiscountRequest } from '@app/types/discounts';

export const nothingTyped = () => ({ item: '', rate: '', storeName: '', storeAddress: '' });

export const discountToPublish = ({ rate, ...others }: ReturnType<typeof nothingTyped>): Partial<PublishDiscountRequest> => {
  if (rate.trim() === '') {
    return others;
  }
  return { ...others, rate };
};

export const changeToMake = (newRate: string): Partial<ChangeRateRequest> => {
  if (newRate === '') {
    return {};
  }
  return { rate: newRate };
};
