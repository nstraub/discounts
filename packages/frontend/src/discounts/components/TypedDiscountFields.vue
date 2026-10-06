<script setup lang="ts">
import type { PublishAnswer } from '../publish-answers';
import { theItem, theRate, theStoreAddress, theStoreName } from '../publish-pieces';
import { discountTexts } from '../texts';
import type { nothingTyped } from '../typed-discount';

import CaptionedInput from './CaptionedInput.vue';

defineProps<{ answer: PublishAnswer }>();

const discount = defineModel<ReturnType<typeof nothingTyped>>({ required: true });
</script>

<template>
  <CaptionedInput
    v-model="discount.item"
    :caption="discountTexts.item"
    :told="answer.toldOf(theItem, discountTexts)"
    test-id="discount-item"
  />
  <CaptionedInput
    v-model="discount.rate"
    :caption="discountTexts.rate"
    :told="answer.toldOf(theRate, discountTexts)"
    test-id="discount-rate"
  />
  <CaptionedInput
    v-model="discount.storeName"
    :caption="discountTexts.storeName"
    :told="answer.toldOf(theStoreName, discountTexts)"
    test-id="discount-store-name"
  />
  <CaptionedInput
    v-model="discount.storeAddress"
    :caption="discountTexts.storeAddress"
    :told="answer.toldOf(theStoreAddress, discountTexts)"
    test-id="discount-store-address"
  />
  <CaptionedInput
    v-model="discount.hook"
    class="sm:col-span-2"
    :caption="discountTexts.hook"
    test-id="discount-hook"
  />
</template>
