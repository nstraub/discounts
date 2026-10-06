<script setup lang="ts">
import { ref } from 'vue';

import { useDiscountsStore } from '../../stores/discounts-store';
import { discountTexts } from '../texts';
import { discountToPublish, nothingTyped } from '../typed-discount';

import TypedDiscountFields from './TypedDiscountFields.vue';

const discounts = useDiscountsStore();
const discount = ref(nothingTyped());

const publish = async (): Promise<void> => {
  await discounts.publish(discountToPublish(discount.value));
  discount.value = nothingTyped();
};
</script>

<template>
  <form
    class="grid gap-4 rounded-lg border border-ink/15 bg-paper p-5 sm:grid-cols-2"
    @submit.prevent="publish"
  >
    <TypedDiscountFields
      v-model="discount"
      :answer="discounts.publishAnswer"
    />
    <button
      type="submit"
      class="justify-self-start bg-shopfront text-paper hover:bg-ink"
      data-testid="publish-discount"
    >
      {{ discountTexts.publish }}
    </button>
    <p
      v-if="discounts.publishAnswer.told(discountTexts)"
      role="status"
      class="self-center text-sm text-alert"
    >
      {{ discounts.publishAnswer.told(discountTexts) }}
    </p>
  </form>
</template>
