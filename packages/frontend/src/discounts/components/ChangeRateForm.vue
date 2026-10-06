<script setup lang="ts">
import { ref } from 'vue';

import type { DiscountResponse } from '@app/types/discounts';

import { useDiscountsStore } from '../../stores/discounts-store';
import { discountTexts } from '../texts';

import CaptionedInput from './CaptionedInput.vue';

defineProps<{ discount: DiscountResponse }>();

const discounts = useDiscountsStore();
const newRate = ref('');

const changeRate = async (): Promise<void> => {
  await discounts.changeRate('spices-id', { rate: newRate.value });
};
</script>

<template>
  <form
    :aria-label="`${discount.item}, ${discount.storeName}`"
    data-testid="change-rate-form"
    @submit.prevent="changeRate"
  >
    <CaptionedInput
      v-model="newRate"
      :caption="discountTexts.newRate"
      test-id="new-rate"
    />
    <button
      type="submit"
      class="rounded border px-3 py-1"
      data-testid="change-rate"
    >
      {{ discountTexts.changeRate }}
    </button>
  </form>
</template>
