import { defineStore } from 'pinia';
import { computed, ref, shallowRef } from 'vue';

import type { ChangeRateRequest, CountRequest, CountResponse, CouponResponse, DiscountResponse, PublishDiscountRequest } from '@app/types/discounts';
import { BadRequestException } from '@app/types/rest-api-refusals';

import { NothingToldOfThePublish, type PublishAnswer, theAnswerTo } from '../discounts/publish-answers';
import { useRestApi } from '../rest-api-key';

const theStoreOf = ({ storeName, storeAddress }: DiscountResponse) => ({ storeName, storeAddress });

const theDistinctStoresPublishing = (discounts: DiscountResponse[]) => [
  ...new Map(discounts.map((discount) => [JSON.stringify(theStoreOf(discount)), theStoreOf(discount)])).values(),
];

export const useDiscountsStore = defineStore('discounts', () => {
  const restApi = useRestApi();
  const published = ref<DiscountResponse[]>([]);
  const coupon = ref<CouponResponse>();
  const publishAnswer = shallowRef<PublishAnswer>(new NothingToldOfThePublish());
  const counted = ref<CountResponse>();
  const stores = computed(() => theDistinctStoresPublishing(published.value));
  const publish = async (discount: Partial<PublishDiscountRequest>): Promise<void> => {
    try {
      await restApi.post('/discounts', discount);
      publishAnswer.value = new NothingToldOfThePublish();
    } catch (refusal) {
      if (!(refusal instanceof BadRequestException)) {
        throw refusal;
      }
      publishAnswer.value = theAnswerTo(refusal);
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
  return { published, stores, coupon, publish, publishAnswer, load, changeRate, getCoupon, counted, countDiscountedSales };
});
