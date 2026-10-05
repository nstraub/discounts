<script setup lang="ts">
import { discountTexts } from '../texts';

import CaptionedInput from './CaptionedInput.vue';
</script>

<template>
  <form @submit.prevent>
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
