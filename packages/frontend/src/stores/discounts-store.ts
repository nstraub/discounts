import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { ChangeRateRequest, CountRequest, CountResponse, CouponResponse, DiscountResponse, PublishDiscountRequest, RedemptionRequest, RedemptionResponse } from '@app/types/discounts';

import { useRestApi } from '../rest-api-key';

const theStoreOf = ({ storeName, storeAddress }: DiscountResponse) => ({ storeName, storeAddress });

const theDistinctStoresPublishing = (discounts: DiscountResponse[]) => [
  ...new Map(discounts.map((discount) => [JSON.stringify(theStoreOf(discount)), theStoreOf(discount)])).values(),
];

export const useDiscountsStore = defineStore('discounts', () => {
  const restApi = useRestApi();
  const published = ref<DiscountResponse[]>([]);
  const coupon = ref<CouponResponse>();
  const redemption = ref<RedemptionResponse>();
  const counted = ref<CountResponse>();
  const stores = computed(() => theDistinctStoresPublishing(published.value));
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
  const redeemCoupon = async (request: RedemptionRequest): Promise<void> => {
    redemption.value = await restApi.post<RedemptionResponse>('/redemptions', request);
  };
  const countDiscountedSales = async (store: CountRequest): Promise<void> => {
    counted.value = await restApi.post<CountResponse>('/stores/counts', store);
  };
  return { published, stores, coupon, publish, load, changeRate, getCoupon, redemption, redeemCoupon, counted, countDiscountedSales };
});
