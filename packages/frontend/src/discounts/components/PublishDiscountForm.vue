<script setup lang="ts">
import { ref } from 'vue';

import { useDiscountsStore } from '../../stores/discounts-store';
import { discountTexts } from '../texts';
import { discountToPublish, nothingTyped } from '../typed-discount';

import CaptionedInput from './CaptionedInput.vue';

const discounts = useDiscountsStore();
const discount = ref(nothingTyped());

const publish = async (): Promise<void> => {
  await discounts.publish(discountToPublish(discount.value));
  discount.value = nothingTyped();
};
</script>

<template>
  <form @submit.prevent="publish">
    <CaptionedInput
      v-model="discount.item"
      :caption="discountTexts.item"
      test-id="discount-item"
    />
    <CaptionedInput
      v-model="discount.rate"
      :caption="discountTexts.rate"
      test-id="discount-rate"
    />
    <CaptionedInput
      v-model="discount.storeName"
      :caption="discountTexts.storeName"
      test-id="discount-store-name"
    />
    <CaptionedInput
      v-model="discount.storeAddress"
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
