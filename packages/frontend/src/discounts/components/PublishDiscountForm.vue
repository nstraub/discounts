<script setup lang="ts">
import { ref } from 'vue';

import { useDiscountsStore } from '../../stores/discounts-store';
import { discountTexts } from '../texts';

import CaptionedInput from './CaptionedInput.vue';

const discounts = useDiscountsStore();
const item = ref('');
const rate = ref('');
const storeName = ref('');
const storeAddress = ref('');

const publish = async (): Promise<void> => {
  await discounts.publish({
    item: item.value,
    rate: Number(rate.value),
    storeName: storeName.value,
    storeAddress: storeAddress.value,
  });
};
</script>

<template>
  <form @submit.prevent="publish">
    <CaptionedInput
      v-model="item"
      :caption="discountTexts.item"
      test-id="discount-item"
    />
    <CaptionedInput
      v-model="rate"
      :caption="discountTexts.rate"
      test-id="discount-rate"
    />
    <CaptionedInput
      v-model="storeName"
      :caption="discountTexts.storeName"
      test-id="discount-store-name"
    />
    <CaptionedInput
      v-model="storeAddress"
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
