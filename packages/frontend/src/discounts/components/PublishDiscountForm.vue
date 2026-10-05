<script setup lang="ts">
import { useDiscountsStore } from '../../stores/discounts-store';
import { discountTexts } from '../texts';

import CaptionedInput from './CaptionedInput.vue';

const discounts = useDiscountsStore();

const publish = async (): Promise<void> => {
  await discounts.publish({
    item: 'Peruvian spices',
    rate: 20,
    storeName: "Mike's Groceries",
    storeAddress: '12 Market Street',
  });
};
</script>

<template>
  <form @submit.prevent="publish">
    <CaptionedInput
      :caption="discountTexts.item"
      test-id="discount-item"
    />
    <CaptionedInput
      :caption="discountTexts.rate"
      test-id="discount-rate"
    />
    <CaptionedInput
      :caption="discountTexts.storeName"
      test-id="discount-store-name"
    />
    <CaptionedInput
      :caption="discountTexts.storeAddress"
      test-id="discount-store-address"
    />
    <button
      type="submit"
      class="rounded border px-3 py-1"
      data-testid="publish-discount"
    >
      {{ discountTexts.publish }}
    </button>
  </form>
</template>
