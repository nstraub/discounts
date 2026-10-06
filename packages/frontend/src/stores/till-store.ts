import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { RedemptionRequest, RedemptionResponse } from '@app/types/discounts';

import { useRestApi } from '../rest-api-key';

export const useTillStore = defineStore('till', () => {
  const restApi = useRestApi();
  const redemption = ref<RedemptionResponse>();
  const couponAlreadyUsed = ref(false);
  const couponNotForThisStore = ref(false);
  const redeemCoupon = async (request: RedemptionRequest): Promise<void> => {
    try {
      redemption.value = await restApi.post<RedemptionResponse>('/redemptions', request);
      couponAlreadyUsed.value = false;
    } catch {
      couponAlreadyUsed.value = true;
      couponNotForThisStore.value = true;
    }
  };
  return { redemption, couponAlreadyUsed, couponNotForThisStore, redeemCoupon };
});
