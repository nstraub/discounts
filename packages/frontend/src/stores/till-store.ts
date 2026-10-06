import { defineStore } from 'pinia';
import { shallowRef } from 'vue';

import type { RedemptionRequest, RedemptionResponse } from '@app/types/discounts';
import { UnprocessableContentException } from '@app/types/rest-api-refusals';

import { CouponAlreadyUsed, CouponNotForThisStore, DiscountApplies, NoStoreSaid, NothingTold, type TillAnswer } from '../discounts/till-answers';
import { useRestApi } from '../rest-api-key';

const answersToRefusals = [{ refused: UnprocessableContentException, Answer: CouponNotForThisStore }];

const theAnswerTo = (refusal: unknown): TillAnswer => {
  const Answer = answersToRefusals.find(({ refused }) => refusal instanceof refused)?.Answer ?? CouponAlreadyUsed;
  return new Answer();
};

export const useTillStore = defineStore('till', () => {
  const restApi = useRestApi();
  const answer = shallowRef<TillAnswer>(new NothingTold());
  const redeemCoupon = async (request: RedemptionRequest): Promise<void> => {
    try {
      const { item } = await restApi.post<RedemptionResponse>('/redemptions', request);
      answer.value = new DiscountApplies(item);
    } catch (refusal) {
      answer.value = theAnswerTo(refusal);
    }
  };
  const noStoreSaid = (): void => {
    answer.value = new NoStoreSaid();
  };
  return { answer, redeemCoupon, noStoreSaid };
});
