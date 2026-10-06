<script setup lang="ts">
import { ref } from 'vue';

import type { DiscountResponse } from '@app/types/discounts';

import { discountTexts } from '../texts';

import CaptionedInput from './CaptionedInput.vue';
import StorePicker from './StorePicker.vue';

defineProps<{ stores: Pick<DiscountResponse, 'storeName' | 'storeAddress'>[] }>();

const code = ref('');
</script>

<template>
  <form>
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
