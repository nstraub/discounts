<script setup lang="ts">
import { ref } from 'vue';

import type { Store } from '@app/types/discounts';

import { useTillStore } from '../../stores/till-store';
import { discountTexts } from '../texts';

import CaptionedInput from './CaptionedInput.vue';
import StorePicker from './StorePicker.vue';
import TillAnswer from './TillAnswer.vue';

defineProps<{ stores: Store[] }>();

const till = useTillStore();
const picked = ref<Store>();
const code = ref('');

const redeem = async (): Promise<void> => {
  if (!picked.value) {
    till.told = discountTexts.sayWhichStoreYouAreAt;
    return;
  }
  await till.redeemCoupon({ code: code.value, ...picked.value });
};
</script>

<template>
  <form @submit.prevent="redeem">
    <StorePicker
      v-model="picked"
      :caption="discountTexts.yourStore"
      :stores="stores"
    />
    <CaptionedInput
      v-model="code"
      :caption="discountTexts.couponCode"
      test-id="typed-coupon-code"
    />
    <button
      type="submit"
      class="rounded border px-3 py-1"
    >
      {{ discountTexts.redeem }}
    </button>
    <TillAnswer />
  </form>
</template>
