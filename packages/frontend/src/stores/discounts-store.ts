import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { ChangeRateRequest, CountRequest, CountResponse, CouponResponse, DiscountResponse, PublishDiscountRequest } from '@app/types/discounts';
import { BadRequestException } from '@app/types/rest-api-refusals';

import { useRestApi } from '../rest-api-key';

const theStoreOf = ({ storeName, storeAddress }: DiscountResponse) => ({ storeName, storeAddress });

const theDistinctStoresPublishing = (discounts: DiscountResponse[]) => [
  ...new Map(discounts.map((discount) => [JSON.stringify(theStoreOf(discount)), theStoreOf(discount)])).values(),
];

export const useDiscountsStore = defineStore('discounts', () => {
  const restApi = useRestApi();
  const published = ref<DiscountResponse[]>([]);
  const coupon = ref<CouponResponse>();
  const rateNotValid = ref(false);
  const missing = ref<readonly string[]>([]);
  const counted = ref<CountResponse>();
  const stores = computed(() => theDistinctStoresPublishing(published.value));
  const publish = async (discount: Partial<PublishDiscountRequest>): Promise<void> => {
    try {
      await restApi.post('/discounts', discount);
      rateNotValid.value = false;
    } catch (refusal) {
      if (!(refusal instanceof BadRequestException)) {
        throw refusal;
      }
      rateNotValid.value = true;
      if (refusal instanceof BadRequestException) {
        missing.value = refusal.missing;
        rateNotValid.value = refusal.missing.length === 0;
      }
    }
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
  const countDiscountedSales = async (store: CountRequest): Promise<void> => {
    counted.value = await restApi.post<CountResponse>('/stores/counts', store);
  };
  return { published, stores, coupon, publish, rateNotValid, missing, load, changeRate, getCoupon, counted, countDiscountedSales };
});
