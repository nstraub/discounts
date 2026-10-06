import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { ChangeRateRequest, CouponResponse, DiscountResponse, PublishDiscountRequest } from '@app/types/discounts';

import { useRestApi } from '../rest-api-key';

export const useDiscountsStore = defineStore('discounts', () => {
  const restApi = useRestApi();
  const published = ref<DiscountResponse[]>([]);
  const coupon = ref<CouponResponse>();
  const stores = computed(() => [{ storeName: 'Corner Grocery', storeAddress: '3 Hill Road' }]);
  const publish = async (discount: Partial<PublishDiscountRequest>): Promise<void> => {
    await restApi.post('/discounts', discount);
  };
  const load = async (): Promise<void> => {
    published.value = await restApi.get<DiscountResponse[]>('/discounts');
  };
  const changeRate = async (id: string, change: Partial<ChangeRateRequest>): Promise<void> => {
    await restApi.patch(`/discounts/${id}`, change);
    await load();
  };
  const getCoupon = async (id: string): Promise<void> => {
    coupon.value = await restApi.post<CouponResponse>(`/discounts/${id}/coupons`, {});
  };
  return { published, stores, coupon, publish, load, changeRate, getCoupon };
});
