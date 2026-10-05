import type { PublishDiscountRequest } from '@app/types/discounts';

export const nothingTyped = () => ({ item: '', rate: '', storeName: '', storeAddress: '' });

const rateGiven = (rate: string): number | undefined => (rate === '' ? undefined : Number(rate));

export const discountToPublish = (typed: ReturnType<typeof nothingTyped>): Partial<PublishDiscountRequest> => ({
  ...typed,
  rate: rateGiven(typed.rate),
});
