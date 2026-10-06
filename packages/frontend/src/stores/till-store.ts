import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { RedemptionRequest, RedemptionResponse } from '@app/types/discounts';
import { UnprocessableContentException } from '@app/types/rest-api';

import { discountTexts } from '../discounts/texts';
import { useRestApi } from '../rest-api-key';

export const useTillStore = defineStore('till', () => {
  const restApi = useRestApi();
  const told = ref('');
  const redeemCoupon = async (request: RedemptionRequest): Promise<void> => {
    try {
      const { item } = await restApi.post<RedemptionResponse>('/redemptions', request);
      told.value = `${discountTexts.theDiscountAppliesTo} ${item}`;
    } catch (refusal) {
      told.value = refusal instanceof UnprocessableContentException ? discountTexts.couponNotForYourStore : discountTexts.couponAlreadyUsed;
    }
  };
  const noStoreSaid = (): void => {
    told.value = discountTexts.sayWhichStoreYouAreAt;
  };
  return { told, redeemCoupon, noStoreSaid };
});
