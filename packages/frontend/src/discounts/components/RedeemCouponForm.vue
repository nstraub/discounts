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

const theStoreTheRequiredPickerHolds = (): Store => picked.value!;

const redeem = async (): Promise<void> => {
  await till.redeemCoupon({ code: code.value, ...theStoreTheRequiredPickerHolds() });
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
