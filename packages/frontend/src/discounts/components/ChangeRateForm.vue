<script setup lang="ts">
import { ref } from 'vue';

import type { DiscountResponse } from '@app/types/discounts';

import { useDiscountsStore } from '../../stores/discounts-store';
import { discountTexts } from '../texts';
import { changeToMake } from '../typed-discount';

import CaptionedInput from './CaptionedInput.vue';

const props = defineProps<{ discount: DiscountResponse; namedBy: string }>();

const discounts = useDiscountsStore();
const newRate = ref('');

const changeRate = async (): Promise<void> => {
  await discounts.changeRate(props.discount.id, changeToMake(newRate.value));
};
</script>

<template>
  <form
    class="flex items-end gap-2"
    :aria-labelledby="namedBy"
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
      class="border border-shopfront bg-paper text-shopfront hover:bg-counter"
      data-testid="change-rate"
    >
      {{ discountTexts.changeRate }}
    </button>
  </form>
</template>
