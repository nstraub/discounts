<script setup lang="ts">
import { ref } from 'vue';

import type { DiscountResponse } from '@app/types/discounts';

import { useDiscountsStore } from '../../stores/discounts-store';
import { discountTexts } from '../texts';

import CaptionedInput from './CaptionedInput.vue';
import StorePicker from './StorePicker.vue';

defineProps<{ stores: Pick<DiscountResponse, 'storeName' | 'storeAddress'>[] }>();

const discounts = useDiscountsStore();
const code = ref('');

const redeem = async (): Promise<void> => {
  await discounts.redeemCoupon({ code: code.value, storeName: "Mike's Groceries", storeAddress: '12 Market Street' });
};
</script>

<template>
  <form @submit.prevent="redeem">
    <StorePicker :stores="stores" />
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
  </form>
</template>
