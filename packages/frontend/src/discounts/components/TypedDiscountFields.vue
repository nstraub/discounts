<script setup lang="ts">
import { discountTexts } from '../texts';
import type { nothingTyped } from '../typed-discount';

import CaptionedInput from './CaptionedInput.vue';

const discount = defineModel<ReturnType<typeof nothingTyped>>({ required: true });
</script>

<template>
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
  <CaptionedInput
    v-model="discount.hook"
    :caption="discountTexts.hook"
    test-id="discount-hook"
  />
</template>
