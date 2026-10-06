<script setup lang="ts">
import { ref } from 'vue';

import type { DiscountResponse } from '@app/types/discounts';

import { useDiscountsStore } from '../../stores/discounts-store';
import { discountTexts } from '../texts';

import CaptionedInput from './CaptionedInput.vue';
import StorePicker from './StorePicker.vue';

type Store = Pick<DiscountResponse, 'storeName' | 'storeAddress'>;

defineProps<{ stores: Store[] }>();

const discounts = useDiscountsStore();
const picked = ref<Store>();
const code = ref('');

const theStoreTheRequiredPickerHolds = (): Store => picked.value!;

const redeem = async (): Promise<void> => {
  await discounts.redeemCoupon({ code: code.value, ...theStoreTheRequiredPickerHolds() });
};
</script>

<template>
  <form @submit.prevent="redeem">
    <StorePicker
      v-model="picked"
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
    <p
      v-if="discounts.redemption"
      role="status"
    >
      {{ discountTexts.theDiscountAppliesTo }} {{ discounts.redemption.item }}
    </p>
  </form>
</template>
