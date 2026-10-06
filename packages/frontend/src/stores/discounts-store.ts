import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { ChangeRateRequest, DiscountResponse, PublishDiscountRequest } from '@app/types/discounts';

import { useRestApi } from '../rest-api-key';

export const useDiscountsStore = defineStore('discounts', () => {
  const restApi = useRestApi();
  const published = ref<DiscountResponse[]>([]);
  const publish = async (discount: Partial<PublishDiscountRequest>): Promise<void> => {
    await restApi.post('/discounts', discount);
  };
  const load = async (): Promise<void> => {
    published.value = await restApi.get<DiscountResponse[]>('/discounts');
  };
  const changeRate: (id: string, change: Partial<ChangeRateRequest>) => Promise<void> = async () => {
    throw new Error('discounts store changeRate is not implemented');
  };
  return { published, publish, load, changeRate };
});
