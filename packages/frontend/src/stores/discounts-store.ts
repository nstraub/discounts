import { defineStore } from 'pinia';

import type { PublishDiscountRequest } from '@app/types/discounts';

export const useDiscountsStore = defineStore('discounts', () => {
  const publish = async (discount: Partial<PublishDiscountRequest>): Promise<void> => {
    throw new Error(`not implemented: publishing ${discount.item}`);
  };
  return { publish };
});
