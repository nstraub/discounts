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
  const changeRate = async (id: string, change: Partial<ChangeRateRequest>): Promise<void> => {
    await restApi.patch(`/discounts/${id}`, change);
  };
  return { published, publish, load, changeRate };
});
