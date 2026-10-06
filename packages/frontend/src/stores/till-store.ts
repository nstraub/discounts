import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { RedemptionRequest, RedemptionResponse } from '@app/types/discounts';
import { UnprocessableContentException } from '@app/types/rest-api';

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
      couponNotForThisStore.value = false;
    } catch (refusal) {
      couponNotForThisStore.value = refusal instanceof UnprocessableContentException;
      couponAlreadyUsed.value = !couponNotForThisStore.value;
    }
  };
  return { redemption, couponAlreadyUsed, couponNotForThisStore, redeemCoupon };
});
